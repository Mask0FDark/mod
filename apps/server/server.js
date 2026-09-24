import { installProfiles } from "./profiles.js";
import { installCallHistory } from "./calls.js";
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
const MAX_UPLOAD = 50 * 1024 * 1024 + 16;
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false") === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "";
// Mailpit/MailHog capture messages but never deliver them to the recipient.
const SMTP_TEST_ONLY = /mailpit|mailhog/i.test(SMTP_HOST) || process.env.SMTP_TEST_ONLY === "true";
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
    `SELECT u.id,u.email,u.display_name,u.username,u.avatar_version,u.public_key_jwk,u.encrypted_private_key
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

async function membership(userId, conversationId) {
  const result = await db.query(
    `SELECT cm.role,cm.last_read_message_id,cm.notifications_enabled,
            c.kind,c.created_by,c.comments_enabled,c.title,c.description
     FROM conversation_members cm
     JOIN conversations c ON c.id=cm.conversation_id
     WHERE cm.user_id=$1 AND cm.conversation_id=$2`,
    [userId, conversationId]
  );
  return result.rows[0] || null;
}

function canManage(member) {
  return Boolean(member && ["owner", "admin"].includes(member.role));
}

async function messageDetails(messageId, conversationId) {
  const result = await db.query(
    `SELECT m.*,u.display_name AS sender_name
     FROM messages m
     JOIN users u ON u.id=m.sender_id
     WHERE m.id=$1 AND m.conversation_id=$2`,
    [messageId, conversationId]
  );
  return result.rows[0] || null;
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
    if (!mailer || (SMTP_TEST_ONLY && !email.endsWith("@example.test"))) {
      return res.status(503).json({ error: "mail_not_configured" });
    }

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

installProfiles(app, {db,auth,express,emitToUser});
const callHistory=installCallHistory({db,emitConversation});

app.get("/api/me", auth, (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/calls", auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT ch.id,ch.conversation_id,ch.video,ch.status,ch.created_at,ch.accepted_at,ch.ended_at,
              CASE WHEN ch.caller_id=$1 THEN 'outgoing' ELSE 'incoming' END AS direction,
              peer.id AS peer_id,peer.display_name AS peer_name,peer.username AS peer_username,peer.avatar_version AS peer_avatar_version,
              CASE WHEN ch.accepted_at IS NULL THEN 0
                   ELSE GREATEST(0,EXTRACT(EPOCH FROM (COALESCE(ch.ended_at,now())-ch.accepted_at)))::int END AS duration
         FROM call_history ch
         JOIN users peer ON peer.id=CASE WHEN ch.caller_id=$1 THEN ch.callee_id ELSE ch.caller_id END
        WHERE ch.caller_id=$1 OR ch.callee_id=$1
        ORDER BY ch.created_at DESC
        LIMIT 100`,
      [req.user.id]
    );
    res.json({ calls: result.rows });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations", auth, async (req, res, next) => {
  const client = await db.connect();
  try {
    const kind = req.body?.kind === "channel" ? "channel" : "group";
    const title = cleanName(req.body?.title);
    const description = String(req.body?.description || "").trim().slice(0, 500);
    const commentsEnabled = req.body?.commentsEnabled !== false;
    const selfEnvelope = req.body?.selfEnvelope;

    if (!title) return res.status(400).json({ error: "title_required" });
    if (!selfEnvelope?.iv || !selfEnvelope?.ciphertext) {
      return res.status(400).json({ error: "missing_key_envelope" });
    }

    await client.query("BEGIN");
    const created = await client.query(
      `INSERT INTO conversations(kind,title,description,comments_enabled,created_by)
       VALUES($1,$2,$3,$4,$5)
       RETURNING id,public_id,kind,title,description,comments_enabled,created_by,created_at`,
      [kind, title, description || null, commentsEnabled, req.user.id]
    );
    const conversation = created.rows[0];
    await client.query(
      `INSERT INTO conversation_members(conversation_id,user_id,role)
       VALUES($1,$2,'owner')`,
      [conversation.id, req.user.id]
    );
    await client.query(
      `INSERT INTO conversation_keys(conversation_id,user_id,wrapped_by_user_id,iv,ciphertext)
       VALUES($1,$2,$2,$3,$4)`,
      [conversation.id, req.user.id, selfEnvelope.iv, selfEnvelope.ciphertext]
    );
    await client.query("COMMIT");
    res.status(201).json({ conversation });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
  }
});

app.post("/api/invites", auth, async (req, res, next) => {
  try {
    if (!rateLimit(`invite:${req.user.id}`, 30, 60 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }

    let kind = "direct";
    let title = null;
    let conversationId = null;
    const requestedConversationId = req.body?.conversationId ? String(req.body.conversationId) : null;

    if (requestedConversationId) {
      const member = await membership(req.user.id, requestedConversationId);
      if (!member || !canManage(member) || !["group", "channel"].includes(member.kind)) {
        return res.status(403).json({ error: "forbidden" });
      }
      conversationId = requestedConversationId;
      kind = member.kind;
      title = member.title;
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const maxUses = kind === "direct"
      ? 1
      : Math.min(Math.max(Number(req.body?.maxUses || 50), 1), 50);
    const result = await db.query(
      `INSERT INTO conversation_invites(token_hash,kind,title,created_by,conversation_id,max_uses,expires_at)
       VALUES($1,$2,$3,$4,$5,$6,now()+($7 || ' hours')::interval)
       RETURNING id,kind,title,conversation_id,max_uses,use_count,expires_at`,
      [tokenHash(token), kind, title, req.user.id, conversationId, maxUses, String(INVITE_TTL_HOURS)]
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
      if (invite.kind !== "direct" || !creatorEnvelope?.iv || !creatorEnvelope?.ciphertext) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "invite_invalid" });
      }
      const created = await client.query(
        "INSERT INTO conversations(kind,title,created_by) VALUES('direct',NULL,$1) RETURNING id",
        [invite.created_by]
      );
      conversationId = created.rows[0].id;
      for (const userId of [invite.created_by, req.user.id]) {
        await client.query(
          "INSERT INTO conversation_members(conversation_id,user_id,role) VALUES($1,$2,'member')",
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
      if (!["group", "channel"].includes(invite.kind)) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "invite_invalid" });
      }
      const joinedRole = invite.kind === "channel" ? "subscriber" : "member";
      await client.query(
        `INSERT INTO conversation_members(conversation_id,user_id,role)
         VALUES($1,$2,$3) ON CONFLICT DO NOTHING`,
        [conversationId, req.user.id, joinedRole]
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
      `SELECT c.id,c.public_id,c.kind,c.title,c.description,c.comments_enabled,c.created_by,c.created_at,
              mine.role AS my_role,mine.last_read_message_id,mine.notifications_enabled,
              ck.iv AS key_iv,ck.ciphertext AS key_ciphertext,ck.wrapped_by_user_id,
              COALESCE(json_agg(json_build_object(
                'id',u.id,'displayName',u.display_name,'username',u.username,'avatarVersion',u.avatar_version,'publicKeyJwk',u.public_key_jwk,
                'role',cm.role,'lastReadMessageId',cm.last_read_message_id
              ) ORDER BY
                CASE cm.role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END,
                u.display_name
              ) FILTER (WHERE u.id IS NOT NULL),'[]') AS members,
              lm.id AS last_message_id,lm.sender_id AS last_sender_id,
              lm.system_event AS last_system_event,lm.ciphertext AS last_ciphertext,lm.iv AS last_iv,lm.created_at AS last_message_at,
              COALESCE(unread.unread_count,0)::int AS unread_count,
              COALESCE(pins.pinned_count,0)::int AS pinned_count
       FROM conversations c
       JOIN conversation_members mine ON mine.conversation_id=c.id AND mine.user_id=$1
       JOIN conversation_keys ck ON ck.conversation_id=c.id AND ck.user_id=$1
       JOIN conversation_members cm ON cm.conversation_id=c.id
       JOIN users u ON u.id=cm.user_id
       LEFT JOIN LATERAL (
         SELECT id,sender_id,ciphertext,iv,created_at,system_event
         FROM messages
         WHERE conversation_id=c.id AND thread_root_id IS NULL
         ORDER BY id DESC LIMIT 1
       ) lm ON true
       LEFT JOIN LATERAL (
         SELECT count(*) AS unread_count
         FROM messages um
         WHERE um.conversation_id=c.id
           AND um.id>mine.last_read_message_id
           AND um.sender_id<>$1
           AND um.deleted_at IS NULL AND um.thread_root_id IS NULL
       ) unread ON true
       LEFT JOIN LATERAL (
         SELECT count(*) AS pinned_count
         FROM conversation_pins p
         WHERE p.conversation_id=c.id
       ) pins ON true
       GROUP BY c.id,mine.role,mine.last_read_message_id,mine.notifications_enabled,
                ck.iv,ck.ciphertext,ck.wrapped_by_user_id,
                lm.id,lm.sender_id,lm.ciphertext,lm.iv,lm.created_at,lm.system_event,
                unread.unread_count,pins.pinned_count
       ORDER BY COALESCE(lm.created_at,c.created_at) DESC`,
      [req.user.id]
    );
    res.json({ conversations: result.rows });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/conversations/:id", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const member = await membership(req.user.id, conversationId);
    if (!canManage(member)) return res.status(403).json({ error: "forbidden" });

    const title = req.body?.title !== undefined ? cleanName(req.body.title) : undefined;
    const description = req.body?.description !== undefined
      ? String(req.body.description || "").trim().slice(0, 500)
      : undefined;
    const commentsEnabled = req.body?.commentsEnabled;

    if (title !== undefined && !title && member.kind !== "direct") {
      return res.status(400).json({ error: "title_required" });
    }

    const result = await db.query(
      `UPDATE conversations
       SET title=COALESCE($2,title),
           description=CASE WHEN $3::boolean THEN $4 ELSE description END,
           comments_enabled=COALESCE($5,comments_enabled)
       WHERE id=$1
       RETURNING id,public_id,kind,title,description,comments_enabled,created_by,created_at`,
      [
        conversationId,
        title === undefined ? null : title,
        description !== undefined,
        description === undefined ? null : description || null,
        commentsEnabled === undefined ? null : Boolean(commentsEnabled)
      ]
    );
    await emitConversation(conversationId, { type: "conversation-updated", conversation: result.rows[0] });
    res.json({ conversation: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/conversations/:id/settings", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    if (!(await isMember(req.user.id, conversationId))) {
      return res.status(403).json({ error: "forbidden" });
    }
    if (req.body?.notificationsEnabled === undefined) {
      return res.status(400).json({ error: "invalid_settings" });
    }
    const result = await db.query(
      `UPDATE conversation_members
       SET notifications_enabled=$3
       WHERE conversation_id=$1 AND user_id=$2
       RETURNING notifications_enabled`,
      [conversationId, req.user.id, Boolean(req.body.notificationsEnabled)]
    );
    res.json({ settings: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/conversations/:id/members/:userId", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const targetUserId = req.params.userId;
    const member = await membership(req.user.id, conversationId);
    if (!member || member.role !== "owner") return res.status(403).json({ error: "owner_required" });
    if (targetUserId === req.user.id) return res.status(400).json({ error: "cannot_change_owner" });

    const role = String(req.body?.role || "");
    const allowed = member.kind === "channel" ? ["admin", "subscriber"] : ["admin", "member"];
    if (!allowed.includes(role)) return res.status(400).json({ error: "invalid_role" });

    const result = await db.query(
      `UPDATE conversation_members SET role=$3
       WHERE conversation_id=$1 AND user_id=$2 AND role<>'owner'
       RETURNING user_id,role`,
      [conversationId, targetUserId, role]
    );
    if (!result.rowCount) return res.status(404).json({ error: "not_found" });
    await emitConversation(conversationId, { type: "member-role", conversationId, userId: targetUserId, role });
    res.json({ member: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/conversations/:id/members/:userId", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const targetUserId = req.params.userId;
    const member = await membership(req.user.id, conversationId);

    if (targetUserId === "me") {
      if (!member) return res.status(404).json({ error: "not_found" });
      if (member.role === "owner") return res.status(409).json({ error: "owner_cannot_leave" });
      await db.query("DELETE FROM conversation_keys WHERE conversation_id=$1 AND user_id=$2", [conversationId, req.user.id]);
      await db.query("DELETE FROM conversation_members WHERE conversation_id=$1 AND user_id=$2", [conversationId, req.user.id]);
      return res.json({ ok: true });
    }

    if (!canManage(member)) return res.status(403).json({ error: "forbidden" });

    const target = await membership(targetUserId, conversationId);
    if (!target) return res.status(404).json({ error: "not_found" });
    if (target.role === "owner") return res.status(400).json({ error: "cannot_remove_owner" });
    if (member.role === "admin" && target.role === "admin") {
      return res.status(403).json({ error: "owner_required" });
    }

    await db.query("DELETE FROM conversation_keys WHERE conversation_id=$1 AND user_id=$2", [conversationId, targetUserId]);
    await db.query("DELETE FROM conversation_members WHERE conversation_id=$1 AND user_id=$2", [conversationId, targetUserId]);
    emitToUser(targetUserId, { type: "conversation-removed", conversationId });
    await emitConversation(conversationId, { type: "member-removed", conversationId, userId: targetUserId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/conversations/:id/members/me", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const member = await membership(req.user.id, conversationId);
    if (!member) return res.status(404).json({ error: "not_found" });
    if (member.role === "owner") return res.status(409).json({ error: "owner_cannot_leave" });

    await db.query("DELETE FROM conversation_keys WHERE conversation_id=$1 AND user_id=$2", [conversationId, req.user.id]);
    await db.query("DELETE FROM conversation_members WHERE conversation_id=$1 AND user_id=$2", [conversationId, req.user.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.get("/api/conversations/:id/pins", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    if (!(await isMember(req.user.id, conversationId))) {
      return res.status(403).json({ error: "forbidden" });
    }
    const result = await db.query(
      `SELECT m.id,m.conversation_id,m.sender_id,m.ciphertext,m.iv,m.attachment_id,
              m.reply_to_id,m.thread_root_id,m.edited_at,m.deleted_at,m.created_at,m.system_event,
              u.display_name AS sender_name,p.pinned_at
       FROM conversation_pins p
       JOIN messages m ON m.id=p.message_id
       JOIN users u ON u.id=m.sender_id
       WHERE p.conversation_id=$1
       ORDER BY p.pinned_at DESC LIMIT 50`,
      [conversationId]
    );
    res.json({ messages: result.rows });
  } catch (err) {
    next(err);
  }
});

app.get("/api/conversations/:id/messages", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const member = await membership(req.user.id, conversationId);
    if (!member) return res.status(403).json({ error: "forbidden" });

    const before = Number(req.query.before || Number.MAX_SAFE_INTEGER);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
    const requestedThread = req.query.threadRootId ? Number(req.query.threadRootId) : null;
    if (!Number.isSafeInteger(before) || before < 1 || !Number.isInteger(limit) ||
        (requestedThread !== null && (!Number.isSafeInteger(requestedThread) || requestedThread < 1))) {
      return res.status(400).json({ error: "invalid_pagination" });
    }
    if (requestedThread && member.kind !== "channel") return res.status(400).json({ error: "threads_channel_only" });
    const threadClause = member.kind === "channel"
      ? (requestedThread ? "AND m.thread_root_id=$4" : "AND m.thread_root_id IS NULL")
      : "AND m.thread_root_id IS NULL";
    const params = requestedThread
      ? [conversationId, before, limit, requestedThread]
      : [conversationId, before, limit];

    const result = await db.query(
      `SELECT m.id,m.conversation_id,m.sender_id,m.ciphertext,m.iv,m.attachment_id,
              m.reply_to_id,m.thread_root_id,m.edited_at,m.deleted_at,m.created_at,m.system_event,
              u.display_name AS sender_name,
              COALESCE(rr.reactions,'[]'::json) AS reactions,
              EXISTS(
                SELECT 1 FROM conversation_pins cp
                WHERE cp.conversation_id=m.conversation_id AND cp.message_id=m.id
              ) AS pinned,
              (
                SELECT count(*)::int FROM messages cm
                WHERE cm.thread_root_id=m.id AND cm.deleted_at IS NULL
              ) AS comment_count
       FROM messages m
       JOIN users u ON u.id=m.sender_id
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object('emoji',mr.emoji,'userId',mr.user_id) ORDER BY mr.created_at) AS reactions
         FROM message_reactions mr
         WHERE mr.message_id=m.id
       ) rr ON true
       WHERE m.conversation_id=$1 AND m.id<$2
       ${threadClause}
       ORDER BY m.id DESC LIMIT $3`,
      params
    );
    res.json({ messages: result.rows.reverse() });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations/:id/messages", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const member = await membership(req.user.id, conversationId);
    if (!member) return res.status(403).json({ error: "forbidden" });

    const ciphertext = String(req.body?.ciphertext || "");
    const iv = String(req.body?.iv || "");
    const attachmentId = req.body?.attachmentId || null;
    const replyToId = req.body?.replyToId ? Number(req.body.replyToId) : null;
    const threadRootId = req.body?.threadRootId ? Number(req.body.threadRootId) : null;
    const clientMessageId = req.body?.clientMessageId || null;

    if (!ciphertext || ciphertext.length > 200_000 || !iv || iv.length > 200) {
      return res.status(400).json({ error: "invalid_message" });
    }
    if (clientMessageId !== null && (typeof clientMessageId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clientMessageId))) {
      return res.status(400).json({ error: "invalid_client_message_id" });
    }
    const requestHash = clientMessageId ? tokenHash(JSON.stringify([ciphertext, iv, attachmentId, replyToId, threadRootId])) : null;
    const existingRequest = async () => {
      const existing = await db.query(
        `SELECT * FROM messages WHERE conversation_id=$1 AND sender_id=$2 AND client_message_id=$3`,
        [conversationId, req.user.id, clientMessageId]
      );
      return existing.rows[0];
    };
    const replay = message => {
      if (message.request_hash !== requestHash) return res.status(409).json({ error: "client_message_id_conflict" });
      return res.json({ message, replayed: true });
    };
    if (clientMessageId) {
      const existing = await existingRequest();
      if (existing) return replay(existing);
    }

    if (member.kind === "channel") {
      if (threadRootId) {
        if (!member.comments_enabled) return res.status(403).json({ error: "comments_disabled" });
        const root = await db.query(
          `SELECT 1 FROM messages
           WHERE id=$1 AND conversation_id=$2 AND thread_root_id IS NULL AND deleted_at IS NULL`,
          [threadRootId, conversationId]
        );
        if (!root.rowCount) return res.status(400).json({ error: "invalid_thread" });
      } else if (!canManage(member)) {
        return res.status(403).json({ error: "channel_read_only" });
      }
    } else if (threadRootId) {
      return res.status(400).json({ error: "threads_channel_only" });
    }

    if (replyToId) {
      const reply = await db.query(
        "SELECT 1 FROM messages WHERE id=$1 AND conversation_id=$2",
        [replyToId, conversationId]
      );
      if (!reply.rowCount) return res.status(400).json({ error: "invalid_reply" });
    }

    if (attachmentId) {
      const attachment = await db.query(
        "SELECT 1 FROM attachments WHERE id=$1 AND conversation_id=$2 AND sender_id=$3",
        [attachmentId, conversationId, req.user.id]
      );
      if (!attachment.rowCount) return res.status(400).json({ error: "invalid_attachment" });
    }

    const result = await db.query(
      `INSERT INTO messages(conversation_id,sender_id,ciphertext,iv,attachment_id,reply_to_id,thread_root_id,client_message_id,request_hash)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (conversation_id,sender_id,client_message_id) WHERE client_message_id IS NOT NULL
       DO NOTHING
       RETURNING id,conversation_id,sender_id,ciphertext,iv,attachment_id,reply_to_id,thread_root_id,
                 edited_at,deleted_at,created_at,client_message_id`,
      [conversationId, req.user.id, ciphertext, iv, attachmentId, replyToId, threadRootId, clientMessageId, requestHash]
    );
    if (!result.rowCount) return replay(await existingRequest());

    const message = { ...result.rows[0], reactions: [], pinned: false, comment_count: 0 };
    await emitConversation(conversationId, { type: "message", message });
    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/conversations/:id/messages/:messageId", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const messageId = Number(req.params.messageId);
    const member = await membership(req.user.id, conversationId);
    if (!member) return res.status(403).json({ error: "forbidden" });

    const current = await messageDetails(messageId, conversationId);
    if (!current || current.deleted_at) return res.status(404).json({ error: "not_found" });
    if (current.system_event) return res.status(400).json({error:"system_message"});
    if (current.sender_id !== req.user.id) return res.status(403).json({ error: "forbidden" });

    const ciphertext = String(req.body?.ciphertext || "");
    const iv = String(req.body?.iv || "");
    if (!ciphertext || ciphertext.length > 200_000 || !iv || iv.length > 200) {
      return res.status(400).json({ error: "invalid_message" });
    }

    const result = await db.query(
      `UPDATE messages SET ciphertext=$3,iv=$4,edited_at=now()
       WHERE id=$1 AND conversation_id=$2
       RETURNING id,conversation_id,sender_id,ciphertext,iv,attachment_id,reply_to_id,thread_root_id,
                 edited_at,deleted_at,created_at`,
      [messageId, conversationId, ciphertext, iv]
    );
    await emitConversation(conversationId, { type: "message-updated", message: result.rows[0] });
    res.json({ message: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/conversations/:id/messages/:messageId", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const messageId = Number(req.params.messageId);
    const member = await membership(req.user.id, conversationId);
    if (!member) return res.status(403).json({ error: "forbidden" });

    const current = await messageDetails(messageId, conversationId);
    if (!current) return res.status(404).json({ error: "not_found" });
    if (current.sender_id !== req.user.id && !canManage(member)) {
      return res.status(403).json({ error: "forbidden" });
    }

    if (current.attachment_id) {
      const attachment = await db.query(
        "SELECT storage_name FROM attachments WHERE id=$1",
        [current.attachment_id]
      );
      const storageName = attachment.rows[0]?.storage_name;
      await db.query("DELETE FROM attachments WHERE id=$1", [current.attachment_id]);
      if (storageName) await fs.promises.unlink(path.join(DATA_DIR, "uploads", storageName)).catch(() => {});
    }

    await db.query(
      `UPDATE messages
       SET ciphertext='',iv='',attachment_id=NULL,deleted_at=now()
       WHERE id=$1 AND conversation_id=$2`,
      [messageId, conversationId]
    );
    await emitConversation(conversationId, { type: "message-deleted", conversationId, messageId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations/:id/messages/:messageId/reaction", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const messageId = Number(req.params.messageId);
    if (!(await isMember(req.user.id, conversationId))) {
      return res.status(403).json({ error: "forbidden" });
    }
    if (!(await messageDetails(messageId, conversationId))) {
      return res.status(404).json({ error: "not_found" });
    }
    const emoji = String(req.body?.emoji || "").trim().slice(0, 16);
    if (!emoji) return res.status(400).json({ error: "invalid_reaction" });
    const exists = await db.query(
      `SELECT emoji FROM message_reactions WHERE message_id=$1 AND user_id=$2`,
      [messageId, req.user.id]
    );
    if (exists.rows[0]?.emoji === emoji) {
      await db.query("DELETE FROM message_reactions WHERE message_id=$1 AND user_id=$2", [messageId, req.user.id]);
    } else {
      await db.query(
        `INSERT INTO message_reactions(message_id,user_id,emoji)
         VALUES($1,$2,$3)
         ON CONFLICT (message_id,user_id) DO UPDATE SET emoji=excluded.emoji,created_at=now()`,
        [messageId, req.user.id, emoji]
      );
    }
    const reactions = await db.query(
      `SELECT emoji,user_id AS "userId" FROM message_reactions WHERE message_id=$1 ORDER BY created_at`,
      [messageId]
    );
    await emitConversation(conversationId, {
      type: "message-reactions",
      conversationId,
      messageId,
      reactions: reactions.rows
    });
    res.json({ reactions: reactions.rows });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations/:id/messages/:messageId/pin", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const messageId = Number(req.params.messageId);
    const member = await membership(req.user.id, conversationId);
    if (!canManage(member)) return res.status(403).json({ error: "forbidden" });

    const message = await messageDetails(messageId, conversationId);
    if (!message) return res.status(404).json({ error: "not_found" });
    const existing = await db.query(
      "SELECT 1 FROM conversation_pins WHERE conversation_id=$1 AND message_id=$2",
      [conversationId, messageId]
    );
    const pinned = !existing.rowCount;
    if (pinned) {
      await db.query(
        `INSERT INTO conversation_pins(conversation_id,message_id,pinned_by)
         VALUES($1,$2,$3)`,
        [conversationId, messageId, req.user.id]
      );
    } else {
      await db.query(
        "DELETE FROM conversation_pins WHERE conversation_id=$1 AND message_id=$2",
        [conversationId, messageId]
      );
    }
    await emitConversation(conversationId, { type: "message-pinned", conversationId, messageId, pinned });
    res.json({ pinned });
  } catch (err) {
    next(err);
  }
});

app.post("/api/conversations/:id/read", auth, async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const messageId = Number(req.body?.messageId || 0);
    if (!Number.isSafeInteger(messageId) || messageId < 1) return res.status(400).json({ error: "invalid_message_id" });
    if (!(await isMember(req.user.id, conversationId))) {
      return res.status(403).json({ error: "forbidden" });
    }
    const target = await db.query("SELECT 1 FROM messages WHERE conversation_id=$1 AND id=$2", [conversationId, messageId]);
    if (!target.rowCount) return res.status(400).json({ error: "invalid_message_id" });
    const result = await db.query(
      `UPDATE conversation_members
       SET last_read_message_id=GREATEST(last_read_message_id,$3)
       WHERE conversation_id=$1 AND user_id=$2 AND last_read_message_id<$3
       RETURNING last_read_message_id`,
      [conversationId, req.user.id, messageId]
    );
    if (result.rowCount) await emitConversation(conversationId, {
      type: "read",
      conversationId,
      userId: req.user.id,
      messageId
    });
    res.json({ ok: true });
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

    if (msg.type === "typing") {
      const conversationId = String(msg.conversationId || "");
      if (!conversationId || !(await isMember(userId, conversationId))) return;
      for (const peerId of await memberIds(conversationId)) {
        if (peerId !== userId) {
          emitToUser(peerId, {
            type: "typing",
            conversationId,
            userId,
            typing: Boolean(msg.typing),
            threadRootId: msg.threadRootId ? Number(msg.threadRootId) : null
          });
        }
      }
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

      await callHistory.signal(msg,userId,to,conversationId);
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
      await callHistory.disconnected(userId).catch(() => {});
      await broadcastPresence(userId, false).catch(() => {});
    }
  });
});

app.use(express.static(webRoot, { etag: true, maxAge: 0, extensions: ["html"] }));
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
