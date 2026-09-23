const enc = new TextEncoder();
const dec = new TextDecoder();

function bytesToBase64(bytes) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i += 0x8000) {
    binary += String.fromCharCode(...view.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

function randomBytes(size) {
  const out = new Uint8Array(size);
  crypto.getRandomValues(out);
  return out;
}

async function passwordKey(password, salt, iterations = 250000) {
  const base = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function createIdentity(password) {
  const pair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
  const publicKeyJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const encryptedPrivateKey = await protectPrivateKey(privateKeyJwk, password);
  return { pair, publicKeyJwk, encryptedPrivateKey };
}

export async function protectPrivateKey(privateKeyJwk, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await passwordKey(password, salt);
  const plaintext = enc.encode(JSON.stringify(privateKeyJwk));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    version: 1,
    kdf: "PBKDF2-SHA256",
    iterations: 250000,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext)
  };
}

export async function unlockPrivateKey(encryptedPrivateKey, password) {
  const salt = base64ToBytes(encryptedPrivateKey.salt);
  const iv = base64ToBytes(encryptedPrivateKey.iv);
  const key = await passwordKey(password, salt, Number(encryptedPrivateKey.iterations || 250000));
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    base64ToBytes(encryptedPrivateKey.ciphertext)
  );
  const jwk = JSON.parse(dec.decode(plaintext));
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"]
  );
}

export async function importPublicKey(jwk) {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    []
  );
}

async function deriveWrapKey(privateKey, publicKeyJwk, context) {
  const publicKey = await importPublicKey(publicKeyJwk);
  const shared = await crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    privateKey,
    256
  );
  const hkdfBase = await crypto.subtle.importKey("raw", shared, "HKDF", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: enc.encode("M0D-room-key"),
      info: enc.encode(String(context))
    },
    hkdfBase,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function generateRoomKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function wrapRoomKey(roomKey, privateKey, recipientPublicKeyJwk, context) {
  const wrapKey = await deriveWrapKey(privateKey, recipientPublicKeyJwk, context);
  const raw = await crypto.subtle.exportKey("raw", roomKey);
  const iv = randomBytes(12);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, wrapKey, raw);
  return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) };
}

export async function unwrapRoomKey(envelope, privateKey, wrapperPublicKeyJwk, context) {
  const wrapKey = await deriveWrapKey(privateKey, wrapperPublicKeyJwk, context);
  const raw = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
    wrapKey,
    base64ToBytes(envelope.ciphertext)
  );
  return crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptJson(roomKey, value) {
  const iv = randomBytes(12);
  const plaintext = enc.encode(JSON.stringify(value));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, roomKey, plaintext);
  return { iv: bytesToBase64(iv), ciphertext: bytesToBase64(ciphertext) };
}

export async function decryptJson(roomKey, envelope) {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
    roomKey,
    base64ToBytes(envelope.ciphertext)
  );
  return JSON.parse(dec.decode(plaintext));
}

export async function encryptBytes(roomKey, bytes) {
  const iv = randomBytes(12);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    roomKey,
    bytes
  );
  return { iv: bytesToBase64(iv), ciphertext };
}

export async function decryptBytes(roomKey, envelope) {
  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
    roomKey,
    envelope.ciphertext
  );
}

export function base64FromBytes(bytes) {
  return bytesToBase64(bytes);
}

export function bytesFromBase64(value) {
  return base64ToBytes(value);
}
