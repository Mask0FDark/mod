import crypto from "crypto";
import fs from "fs";
import http from "http";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";
import express from "express";
import pg from "pg";
import { WebSocketServer, WebSocket } from "ws";

const scrypt = promisify(crypto.scrypt);
const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "../web");

const PORT = Number(process.env.PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL || "";
const APP_ORIGIN = process.env.APP_ORIGIN || "https://call.mask-0f-darkness.ru";
const TURN_HOST = process.env.TURN_HOST || "call.mask-0f-darkness.ru";
const TURN_SECRET = process.env.TURN_SECRET || "";
const DATA_DIR = process.env.DATA_DIR || "/data";
const SESSION_DAYS = 30;
const MAX_UPLOAD = 12 * 1024 * 1024;

if (!DATABASE_URL || !TURN_SECRET) {
  throw new Error("DATABASE_URL and TURN_SECRET are required");
}

fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
const db = new Pool({ connectionString: DATABASE_URL, max: 10 });
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

async function hashPassword(password, salt = crypto.randomBytes(16).toString("base64url")) {
  const key = await scrypt(password, salt, 32);
  return { salt, hash: Buffer.from(key).toString("base64url") };
}

async function verifyPassword(password, salt, expected) {
  const got = await hashPassword(password, salt);
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

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const displayName = cleanName(req.body?.displayName);
    const password = String(req.body?.password || "");
    const publicKey = req.body?.publicKeyJwk;
    const encryptedPrivateKey = req.body?.encryptedPrivateKey;

    if (!rateLimit(`reg:${req.ip}`, 8, 10 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }
    if (!validEmail(email) || !displayName || password.length < 8 || password.length > 128) {
      return res.status(400).json({ error: "invalid_registration" });
    }
    if (!publicKey || typeof publicKey !== "object" || !encryptedPrivateKey || typeof encryptedPrivateKey !== "object") {
      return res.status(400).json({ error: "missing_crypto_identity" });
    }

    const { salt, hash } = await hashPassword(password);
    const result = await db.query(
      `INSERT INTO users(email,display_name,password_salt,password_hash,public_key_jwk,encrypted_private_key)
       VALUES($1,$2,$3,$4,$5,$6)
       RETURNING id,email,display_name,public_key_jwk,encrypted_private_key,created_at`,
      [email, displayName, salt, hash, publicKey, encryptedPrivateKey]
    );
    await createSession(res, result.rows[0].id);
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err?.code === "23505") return res.status(409).json({ error: "email_exists" });
    next(err);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    if (!rateLimit(`login:${req.ip}`, 20, 10 * 60_000)) {
      return res.status(429).json({ error: "too_many_attempts" });
    }

    const result = await db.query(
      `SELECT id,email,display_name,password_salt,password_hash,public_key_jwk,encrypted_private_key
       FROM users WHERE email=$1`,
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    await createSession(res, user.id);
    delete user.password_salt;
    delete user.password_hash;
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

app.post("/api/users/resolve", auth, async (req, res, next) => {
  try {
    const emails = [...new Set((req.body?.emails || []).map(normalizeEmail))]
      .filter(validEmail)
      .slice(0, 20);
    if (!emails.length) return res.json({ users: [] });

    const result = await db.query(
      `SELECT id,email,display_name,public_key_jwk
       FROM users
       WHERE email = ANY($1::text[]) AND id<>$2`,
      [emails, req.user.id]
    );
    res.json({ users: result.rows });
  } catch (err) {
    next(err);
  }
});

app.get("/api/conversations", auth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT c.id,c.kind,c.title,c.created_by,c.created_at,
              ck.iv AS key_iv,ck.ciphertext AS key_ciphertext,ck.wrapped_by_user_id,
              COALESCE(json_agg(json_build_object(
                'id',u.id,'email',u.email,'displayName',u.display_name,'publicKeyJwk',u.public_key_jwk
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

app.post("/api/conversations", auth, async (req, res, next) => {
  const client = await db.connect();
  try {
    const kind = req.body?.kind === "group" ? "group" : "direct";
    const title = kind === "group" ? cleanName(req.body?.title) : null;
    const memberIds = [...new Set((req.body?.memberIds || []).map(String))]
      .filter(id => id !== req.user.id);
    const envelopes = req.body?.keyEnvelopes || {};

    if (
      (kind === "direct" && memberIds.length !== 1) ||
      (kind === "group" && (memberIds.length < 1 || memberIds.length > 19))
    ) {
      return res.status(400).json({ error: "invalid_members" });
    }
    if (kind === "group" && !title) return res.status(400).json({ error: "title_required" });

    const allIds = [req.user.id, ...memberIds];
    const known = await client.query(
      "SELECT id FROM users WHERE id = ANY($1::uuid[])",
      [allIds]
    );
    if (known.rowCount !== allIds.length) return res.status(400).json({ error: "unknown_member" });

    for (const id of allIds) {
      const envelope = envelopes[id];
      if (!envelope?.iv || !envelope?.ciphertext) {
        return res.status(400).json({ error: "missing_key_envelope" });
      }
    }

    await client.query("BEGIN");
    const created = await client.query(
      "INSERT INTO conversations(kind,title,created_by) VALUES($1,$2,$3) RETURNING *",
      [kind, title, req.user.id]
    );
    const conversation = created.rows[0];

    for (const userId of allIds) {
      await client.query(
        "INSERT INTO conversation_members(conversation_id,user_id) VALUES($1,$2)",
        [conversation.id, userId]
      );
      await client.query(
        `INSERT INTO conversation_keys(conversation_id,user_id,wrapped_by_user_id,iv,ciphertext)
         VALUES($1,$2,$3,$4,$5)`,
        [
          conversation.id,
          userId,
          req.user.id,
          envelopes[userId].iv,
          envelopes[userId].ciphertext
        ]
      );
    }

    await client.query("COMMIT");
    await emitConversation(conversation.id, { type: "conversation-created", conversationId: conversation.id });
    res.status(201).json({ conversation });
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    next(err);
  } finally {
    client.release();
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
      { urls: [`stun:${TURN_HOST}:3478`] },
      {
        urls: [
          `turn:${TURN_HOST}:3478?transport=udp`,
          `turn:${TURN_HOST}:3478?transport=tcp`
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
