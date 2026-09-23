import crypto from "crypto";
import fs from "fs";
import http from "http";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";
import express from "express";
import nodemailer from "nodemailer";
import pg from "pg";
import { WebSocketServer, WebSocket } from "ws";

const scrypt = promisify(crypto.scrypt);
const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "../web");

const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || "";
const APP_ORIGIN = process.env.APP_ORIGIN || "";
const TURN_HOST = process.env.TURN_HOST || "";
const TURN_PORT = Number(process.env.TURN_PORT || 3478);
const TURN_SECRET = process.env.TURN_SECRET || "";
const DATA_DIR = process.env.DATA_DIR || "/data";
const SESSION_DAYS = 30;
const MAX_UPLOAD = 12 * 1024 * 1024;
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false") === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "";
const INVITE_TTL_HOURS = Number(process.env.INVITE_TTL_HOURS || 168);

if (!DATABASE_URL || !TURN_SECRET || !APP_ORIGIN || !TURN_HOST) {
  throw new Error("DATABASE_URL, TURN_SECRET, APP_ORIGIN and TURN_HOST are required");
}

fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
const db = new Pool({ connectionString: DATABASE_URL, max: 10 });
const mailer = SMTP_HOST && SMTP_FROM
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      ...(SMTP_USER && SMTP_PASS ? { auth: { user: SMTP_USER, pass: SMTP_PASS } } : {})
    })
  : null;
const app = express();
const server = http.createServer(app);
const socketsByUser = new Map();
const rateBuckets = new Map();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "256kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(self), microphone=(self), display-capture=(self)");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' wss:; img-src 'self' data: blob:; " +
      "media-src 'self' blob:; style-src 'self'; script-src 'self'; object-src 'none'; " +
      "base-uri 'none'; frame-ancestors 'none'"
  );
  next();
});

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function cleanName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 40);
}

function cookieMap(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function hashCredential(authSecret, salt = crypto.randomBytes(16).toString("base64url")) {
  const key = await scrypt(authSecret, salt, 32);
  return { salt, hash: Buffer.from(key).toString("base64url") };
}

async function verifyCredential(authSecret, salt, expected) {
  const got = await hashCredential(authSecret, salt);
  const a = Buffer.from(got.hash);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function rateLimit(key, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return bucket.count <= limit;
}

function requireOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (origin && origin !== APP_ORIGIN) return res.status(403).json({ error: "bad_origin" });
  next();
}

app.use("/api", requireOrigin);

async function getSession(req) {
  const token = cookieMap(req).m0d_session;
  if (!token) return null;
  const result = await db.query(
    `SELECT u.id,u.email,u.display_name,u.public_key_jwk,u.encrypted_private_key
       FROM sessions s
       JOIN users u ON u.id=s.user_id
      WHERE s.token_hash=$1 AND s.expires_at>now()`,
    [tokenHash(token)]
  );
  return result.rows[0] || null;
}

async function auth(req, res, next) {
  try {
    const user = await getSession(req);
    if (!user) return res.status(401).json({ error: "unauthorized" });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  await db.query(
    `INSERT INTO sessions(token_hash,user_id,expires_at)
     VALUES($1,$2,now()+($3 || ' days')::interval)`,
    [tokenHash(token), userId, String(SESSION_DAYS)]
  );
  res.setHeader(
    "Set-Cookie",
    `m0d_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DAYS * 86400}`
  );
}

async function isMember(userId, conversationId) {
  const result = await db.query(
    "SELECT 1 FROM conversation_members WHERE user_id=$1 AND conversation_id=$2",
    [userId, conversationId]
  );
  return result.rowCount > 0;
}

async function memberIds(conversationId) {
  const result = await db.query(
    "SELECT user_id FROM conversation_members WHERE conversation_id=$1",
    [conversationId]
  );
  return result.rows.map(row => row.user_id);
}

function emitToUser(userId, payload) {
  for (const ws of socketsByUser.get(userId) || []) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
  }
}

async function emitConversation(conversationId, payload) {
  for (const userId of await memberIds(conversationId)) emitToUser(userId, payload);
}

app.post("/api/auth/register/start", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const language = ["ru", "en", "uk"].includes(req.body?.language) ? req.body.language : "en";
    if (!validEmail(email)) return res.status(400).json({ error: "invalid_email" });
    if (!rateLimit(`verify:${req.ip}:${email}`, 5, 15 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }
    if (!mailer) return res.status(503).json({ error: "mail_not_configured" });

    const existing = await db.query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (existing.rowCount) return res.status(409).json({ error: "email_exists" });

    const id = crypto.randomUUID();
    const code = String(crypto.randomInt(100000, 1000000));
    await db.query(
      `INSERT INTO email_verifications(id,email,code_hash,expires_at)
       VALUES($1,$2,$3,now()+interval '10 minutes')`,
      [id, email, tokenHash(`${id}:${code}`)]
    );

    const mailCopy = {
      ru: {
        subject: "M0D — код подтверждения",
        text: `Код подтверждения M0D: ${code}\n\nКод действует 10 минут.`
      },
      en: {
        subject: "M0D — verification code",
        text: `M0D verification code: ${code}\n\nThe code expires in 10 minutes.`
      },
      uk: {
        subject: "M0D — код підтвердження",
        text: `Код підтвердження M0D: ${code}\n\nКод діє 10 хвилин.`
      }
    }[language];

    await mailer.sendMail({
      from: SMTP_FROM,
      to: email,
      subject: mailCopy.subject,
      text: mailCopy.text
    });
    res.json({ verificationId: id, expiresIn: 600 });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  const client = await db.connect();
  try {
    const email = normalizeEmail(req.body?.email);
    const displayName = cleanName(req.body?.displayName);
    const authSecret = String(req.body?.authSecret || "");
    const publicKey = req.body?.publicKeyJwk;
    const encryptedPrivateKey = req.body?.encryptedPrivateKey;
    const verificationId = String(req.body?.verificationId || "");
    const verificationCode = String(req.body?.code || "");

    if (!rateLimit(`reg:${req.ip}`, 8, 10 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }
    if (!validEmail(email) || !displayName || authSecret.length < 32 || authSecret.length > 128) {
      return res.status(400).json({ error: "invalid_registration" });
    }
    if (!publicKey || typeof publicKey !== "object" || !encryptedPrivateKey || typeof encryptedPrivateKey !== "object") {
      return res.status(400).json({ error: "missing_crypto_identity" });
    }

    await client.query("BEGIN");
    const verificationResult = await client.query(
      `SELECT id,email,code_hash,expires_at,attempts,consumed_at
       FROM email_verifications WHERE id=$1 FOR UPDATE`,
      [verificationId]
    );
    const verification = verificationResult.rows[0];
    const expectedCodeHash = tokenHash(`${verificationId}:${verificationCode}`);
    const validVerification = Boolean(
      verification &&
      verification.email === email &&
      !verification.consumed_at &&
      new Date(verification.expires_at).getTime() >= Date.now() &&
      verification.attempts < 5 &&
      verification.code_hash.length === expectedCodeHash.length &&
      crypto.timingSafeEqual(Buffer.from(verification.code_hash), Buffer.from(expectedCodeHash))
    );

    if (!validVerification) {
      if (verification) {
        await client.query("UPDATE email_verifications SET attempts=attempts+1 WHERE id=$1", [verificationId]);
        await client.query("COMMIT");
      } else {
        await client.query("ROLLBACK");
      }
      return res.status(400).json({ error: "verification_invalid" });
    }

    const { salt, hash } = await hashCredential(authSecret);
    const result = await client.query(
      `INSERT INTO users(email,display_name,auth_secret_salt,auth_secret_hash,email_verified_at,public_key_jwk,encrypted_private_key)
       VALUES($1,$2,$3,$4,now(),$5,$6)
       RETURNING id,email,display_name,public_key_jwk,encrypted_private_key,created_at`,
      [email, displayName, salt, hash, publicKey, encryptedPrivateKey]
    );
    await client.query(
      "UPDATE email_verifications SET consumed_at=now(),attempts=attempts+1 WHERE id=$1",
      [verificationId]
    );
    await client.query("COMMIT");

    await createSession(res, result.rows[0].id);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    if (err?.code === "23505") return res.status(409).json({ error: "email_exists" });
    next(err);
  } finally {
    client.release();
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const authSecret = String(req.body?.authSecret || "");
    const legacyPassword = String(req.body?.password || "");
    if (!rateLimit(`login:${req.ip}`, 20, 10 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }

    const result = await db.query(
      `SELECT id,email,display_name,auth_secret_salt,auth_secret_hash,password_salt,password_hash,
              public_key_jwk,encrypted_private_key
       FROM users WHERE email=$1`,
      [email]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    let valid = false;
    let migrated = false;
    if (user.auth_secret_salt && user.auth_secret_hash) {
      valid = await verifyCredential(authSecret, user.auth_secret_salt, user.auth_secret_hash);
    } else if (user.password_salt && user.password_hash) {
      if (!legacyPassword) {
        return res.status(428).json({ error: "legacy_auth_required" });
      }
      valid = await verifyCredential(legacyPassword, user.password_salt, user.password_hash);
      if (valid) {
        const upgraded = await hashCredential(authSecret);
        await db.query(
          `UPDATE users
           SET auth_secret_salt=$2,auth_secret_hash=$3,password_salt=NULL,password_hash=NULL
           WHERE id=$1`,
          [user.id, upgraded.salt, upgraded.hash]
        );
        migrated = true;
      }
    }
    if (!valid) return res.status(401).json({ error: "invalid_credentials" });

    await createSession(res, user.id);
    delete user.auth_secret_salt;
    delete user.auth_secret_hash;
    delete user.password_salt;
    delete user.password_hash;
    user.auth_migrated = migrated;
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/logout", auth, async (req, res, next) => {
  try {
    const token = cookieMap(req).m0d_session;
    if (token) await db.query("DELETE FROM sessions WHERE token_hash=$1", [tokenHash(token)]);
    res.setHeader("Set-Cookie", "m0d_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0");
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.get("/api/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/invites", auth, async (req, res, next) => {
  try {
    const kind = req.body?.kind === "group" ? "group" : "direct";
    const title = kind === "group" ? cleanName(req.body?.title) : null;
    if (kind === "group" && !title) return res.status(400).json({ error: "title_required" });
    if (!rateLimit(`invite:${req.user.id}`, 20, 60 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const maxUses = kind === "direct"
      ? 1
      : Math.min(Math.max(Number(req.body?.maxUses || 20), 1), 50);
    const result = await db.query(
      `INSERT INTO conversation_invites(token_hash,kind,title,created_by,max_uses,expires_at)
       VALUES($1,$2,$3,$4,$5,now()+($6 || ' hours')::interval)
       RETURNING id,kind,title,max_uses,use_count,expires_at`,
      [tokenHash(token), kind, title, req.user.id, maxUses, String(INVITE_TTL_HOURS)]
    );
    res.status(201).json({ token, invite: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.get("/api/invites/:token", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT i.id,i.kind,i.title,i.max_uses,i.use_count,i.expires_at,i.conversation_id,
              u.id AS creator_id,u.display_name AS creator_name,u.public_key_jwk AS creator_public_key
       FROM conversation_invites i
       JOIN users u ON u.id=i.created_by
       WHERE i.token_hash=$1 AND i.revoked_at IS NULL AND i.expires_at>now() AND i.use_count<i.max_uses`,
      [tokenHash(req.params.token)]
    );
    if (!result.rowCount) return res.status(404).json({ error: "invite_invalid" });
    res.json({ invite: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.post("/api/invites/:token/accept", auth, async (req, res, next) => {
  const client = await db.connect();
  try {
    const selfEnvelope = req.body?.selfEnvelope;
    const creatorEnvelope = req.body?.creatorEnvelope;
    if (!selfEnvelope?.iv || !selfEnvelope?.ciphertext) {
      return res.status(400).json({ error: "missing_key_envelope" });
    }

    await client.query("BEGIN");
    const lookup = await client.query(
      `SELECT i.*,u.public_key_jwk AS creator_public_key
       FROM conversation_invites i JOIN users u ON u.id=i.created_by
       WHERE i.token_hash=$1 FOR UPDATE`,
      [tokenHash(req.params.token)]
    );
    const invite = lookup.rows[0];
    if (!invite || invite.revoked_at || new Date(invite.expires_at).getTime() < Date.now() ||
        invite.use_count >= invite.max_uses || invite.created_by === req.user.id) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "invite_invalid" });
    }

    let conversationId = invite.conversation_id;
    if (!conversationId) {
      if (!creatorEnvelope?.iv || !creatorEnvelope?.ciphertext) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "missing_creator_envelope" });
      }
      const created = await client.query(
        "INSERT INTO conversations(kind,title,created_by) VALUES($1,$2,$3) RETURNING id",
        [invite.kind, invite.title, invite.created_by]
      );
      conversationId = created.rows[0].id;
      for (const userId of [invite.created_by, req.user.id]) {
        await client.query(
          "INSERT INTO conversation_members(conversation_id,user_id) VALUES($1,$2)",
          [conversationId, userId]
        );
      }
      await client.query(
        `INSERT INTO conversation_keys(conversation_id,user_id,wrapped_by_user_id,iv,ciphertext)
         VALUES($1,$2,$3,$4,$5),($1,$3,$3,$6,$7)`,
        [
          conversationId, invite.created_by, req.user.id,
          creatorEnvelope.iv, creatorEnvelope.ciphertext,
          selfEnvelope.iv, selfEnvelope.ciphertext
        ]
      );
    } else {
      if (invite.kind !== "group") {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "invite_invalid" });
      }
      await client.query(
        "INSERT INTO conversation_members(conversation_id,user_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [conversationId, req.user.id]
      );
      await client.query(
        `INSERT INTO conversation_keys(conversation_id,user_id,wrapped_by_user_id,iv,ciphertext)
         VALUES($1,$2,$2,$3,$4) ON CONFLICT (conversation_id,user_id) DO NOTHING`,
        [conversationId, req.user.id, selfEnvelope.iv, selfEnvelope.ciphertext]
      );
    }

    await client.query(
      `UPDATE conversation_invites
       SET conversation_id=$2,use_count=use_count+1
       WHERE id=$1`,
      [invite.id, conversationId]
    );
    await client.query("COMMIT");
    await emitConversation(conversationId, { type: "conversation-created", conversationId });
    res.json({ conversationId });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

app.get("/api/conversations", auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT c.id,c.kind,c.title,c.created_by,c.created_at,
              ck.iv AS key_iv,ck.ciphertext AS key_ciphertext,ck.wrapped_by_user_id,
              COALESCE(json_agg(json_build_object(
                'id',u.id,'displayName',u.display_name,'publicKeyJwk',u.public_key_jwk
              ) ORDER BY u.display_name) FILTER (WHERE u.id IS NOT NULL),'[]') AS members,
              lm.id AS last_message_id,lm.sender_id AS last_sender_id,
              lm.ciphertext AS last_ciphertext,lm.iv AS last_iv,lm.created_at AS last_message_at
       FROM conversations c
       JOIN conversation_members mine ON mine.conversation_id=c.id AND mine.user_id=$1
       JOIN conversation_keys ck ON ck.conversation_id=c.id AND ck.user_id=$1
       JOIN conversation_members cm ON cm.conversation_id=c.id
       JOIN users u ON u.id=cm.user_id
       LEFT JOIN LATERAL (
         SELECT id,sender_id,ciphertext,iv,created_at
         FROM messages
         WHERE conversation_id=c.id
         ORDER BY id DESC LIMIT 1
       ) lm ON true
       GROUP BY c.id,ck.iv,ck.ciphertext,ck.wrapped_by_user_id,
                lm.id,lm.sender_id,lm.ciphertext,lm.iv,lm.created_at
       ORDER BY COALESCE(lm.created_at,c.created_at) DESC`,
      [req.user.id]
    );
    res.json({ conversations: result.rows });
  } catch (err) {
    next(err);
  }
});

app.get("/api/conversations/:id/messages", auth, async (req, res, next) => {
  try {
    if (!(await isMember(req.user.id, req.params.id))) {
      return res.status(403).json({ error: "forbidden" });
    }

    const before = Number(req.query.before || Number.MAX_SAFE_INTEGER);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
    const result = await db.query(
      `SELECT m.id,m.conversation_id,m.sender_id,m.ciphertext,m.iv,m.attachment_id,m.created_at,
              u.display_name AS sender_name
       FROM messages m
       JOIN users u ON u.id=m.sender_id
       WHERE m.conversation_id=$1 AND m.id<$2
       ORDER BY m.id DESC LIMIT $3`,
      [req.params.id, before, limit]
    );
    res.json({ messages: result.rows.reverse() });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations/:id/messages", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    if (!(await isMember(req.user.id, conversationId))) {
      return res.status(403).json({ error: "forbidden" });
    }

    const ciphertext = String(req.body?.ciphertext || "");
    const iv = String(req.body?.iv || "");
    const attachmentId = req.body?.attachmentId || null;

    if (!ciphertext || ciphertext.length > 200_000 || !iv || iv.length > 200) {
      return res.status(400).json({ error: "invalid_message" });
    }

    if (attachmentId) {
      const attachment = await db.query(
        "SELECT 1 FROM attachments WHERE id=$1 AND conversation_id=$2 AND sender_id=$3",
        [attachmentId, conversationId, req.user.id]
      );
      if (!attachment.rowCount) return res.status(400).json({ error: "invalid_attachment" });
    }

    const result = await db.query(
      `INSERT INTO messages(conversation_id,sender_id,ciphertext,iv,attachment_id)
       VALUES($1,$2,$3,$4,$5)
       RETURNING id,conversation_id,sender_id,ciphertext,iv,attachment_id,created_at`,
      [conversationId, req.user.id, ciphertext, iv, attachmentId]
    );

    const message = result.rows[0];
    await emitConversation(conversationId, { type: "message", message });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

app.post(
  "/api/conversations/:id/attachments",
  auth,
  express.raw({ type: "application/octet-stream", limit: MAX_UPLOAD }),
  async (req, res, next) => {
    try {
      const conversationId = req.params.id;
      if (!(await isMember(req.user.id, conversationId))) {
        return res.status(403).json({ error: "forbidden" });
      }
      if (!Buffer.isBuffer(req.body) || req.body.length < 1) {
        return res.status(400).json({ error: "empty_attachment" });
      }

      const id = crypto.randomUUID();
      const storageName = `${id}.bin`;
      const target = path.join(DATA_DIR, "uploads", storageName);
      await fs.promises.writeFile(target, req.body, { flag: "wx", mode: 0o600 });
      await db.query(
        `INSERT INTO attachments(id,conversation_id,sender_id,storage_name,byte_size)
         VALUES($1,$2,$3,$4,$5)`,
        [id, conversationId, req.user.id, storageName, req.body.length]
      );
      res.status(201).json({ id, size: req.body.length });
    } catch (err) {
      next(err);
    }
  }
);

app.get("/api/attachments/:id", auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT a.storage_name,a.byte_size
       FROM attachments a
       JOIN conversation_members cm ON cm.conversation_id=a.conversation_id
       WHERE a.id=$1 AND cm.user_id=$2`,
      [req.params.id, req.user.id]
    );
    const row = result.rows[0];
    if (!row) return res.status(404).json({ error: "not_found" });

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Length", String(row.byte_size));
    res.setHeader("Cache-Control", "private, max-age=86400");
    fs.createReadStream(path.join(DATA_DIR, "uploads", row.storage_name)).pipe(res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/ice", auth, (req, res) => {
  const username = `${Math.floor(Date.now() / 1000) + 3600}:m0d`;
  const credential = crypto.createHmac("sha1", TURN_SECRET).update(username).digest("base64");
  res.setHeader("Cache-Control", "no-store");
  res.json({
    iceServers: [
      { urls: [`stun:${TURN_HOST}:${TURN_PORT}`] },
      {
        urls: [
          `turn:${TURN_HOST}:${TURN_PORT}?transport=udp`,
          `turn:${TURN_HOST}:${TURN_PORT}?transport=tcp`
        ],
        username,
        credential
      }
    ]
  });
});

async function broadcastPresence(userId, online) {
  const result = await db.query(
    `SELECT DISTINCT cm2.user_id
     FROM conversation_members cm1
     JOIN conversation_members cm2 ON cm2.conversation_id=cm1.conversation_id
     WHERE cm1.user_id=$1 AND cm2.user_id<>$1`,
    [userId]
  );
  for (const row of result.rows) emitToUser(row.user_id, { type: "presence", userId, online });
}

const wss = new WebSocketServer({ noServer: true, maxPayload: 256 * 1024 });

server.on("upgrade", async (req, socket, head) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname !== "/ws") return socket.destroy();

    const user = await getSession(req);
    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      return socket.destroy();
    }

    req.user = user;
    wss.handleUpgrade(req, socket, head, ws => wss.emit("connection", ws, req));
  } catch {
    socket.destroy();
  }
});

wss.on("connection", async (ws, req) => {
  const userId = req.user.id;
  let set = socketsByUser.get(userId);
  if (!set) socketsByUser.set(userId, (set = new Set()));
  set.add(ws);
  ws.userId = userId;
  ws.send(JSON.stringify({ type: "ready", userId }));

  const contacts = await db.query(
    `SELECT DISTINCT cm2.user_id
     FROM conversation_members cm1
     JOIN conversation_members cm2 ON cm2.conversation_id=cm1.conversation_id
     WHERE cm1.user_id=$1 AND cm2.user_id<>$1`,
    [userId]
  );

  for (const row of contacts.rows) {
    if ((socketsByUser.get(row.user_id)?.size || 0) > 0) {
      ws.send(JSON.stringify({ type: "presence", userId: row.user_id, online: true }));
    }
  }
  await broadcastPresence(userId, true).catch(() => {});

  ws.on("message", async raw => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (!["call-request", "call-accept", "call-decline", "offer", "answer", "ice", "hangup"].includes(msg.type)) {
      return;
    }

    const to = String(msg.to || "");
    const conversationId = String(msg.conversationId || "");
    if (!to || !conversationId || to === userId) return;

    try {
      const allowed = await db.query(
        `SELECT 1
         FROM conversation_members a
         JOIN conversation_members b ON b.conversation_id=a.conversation_id
         WHERE a.conversation_id=$1 AND a.user_id=$2 AND b.user_id=$3`,
        [conversationId, userId, to]
      );
      if (!allowed.rowCount) return;

      emitToUser(to, {
        type: msg.type,
        from: userId,
        conversationId,
        sdp: msg.sdp,
        candidate: msg.candidate,
        video: Boolean(msg.video)
      });
    } catch {}
  });

  ws.on("close", async () => {
    const current = socketsByUser.get(userId);
    current?.delete(ws);
    if (current && current.size === 0) {
      socketsByUser.delete(userId);
      await broadcastPresence(userId, false).catch(() => {});
    }
  });
});

app.use(express.static(webRoot, { etag: true, maxAge: "1h", extensions: ["html"] }));
app.get("*", (req, res) => res.sendFile(path.join(webRoot, "index.html")));

app.use((err, req, res, next) => {
  console.error(err);
  if (err?.type === "entity.too.large") return res.status(413).json({ error: "too_large" });
  res.status(500).json({ error: "internal_error" });
});

async function start() {
  await db.query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
  await db.query("DELETE FROM sessions WHERE expires_at<=now()");
  server.listen(PORT, "0.0.0.0", () => console.log(`M0D server listening on :${PORT}`));
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
