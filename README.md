# M0D

**M0D — Message Over Distance** is an open-source messenger for private everyday communication across long distances.

The name has two meanings:

- **Message Over Distance**
- **M0D** — a reference to the creator's nickname, Mask 0F Darkness

The interface intentionally follows a familiar Telegram-like workflow: chat list, conversation view, message bubbles, attachments and a dedicated call screen. It is not affiliated with Telegram.

> M0D is pre-release software. The protocol, database schema and key-management format may still change.

## Current features

- Email + password accounts
- One-to-one chats
- Group chats
- Real-time messaging over WebSocket
- Client-side encrypted message bodies
- Client-side encrypted attachments
- Image compression before encrypted upload
- Voice and video calls using WebRTC
- Direct P2P media with TURN relay fallback
- Native speaker / earpiece switching in the Android app
- Installable PWA for phones and desktop
- Russian, English and Ukrainian UI
- Responsive Telegram-inspired layout

Temporary public deployment:

```text
https://call.mask-0f-darkness.ru
```

A dedicated M0D domain is planned later.

## Repository layout

```text
apps/
  server/    REST API, sessions, PostgreSQL access and WebSocket signaling
  web/       Browser/PWA client, encryption and call UI
  android/   Android WebView shell with native audio-route bridge

deploy/
  nginx.conf

docker-compose.yml
Dockerfile
```

## Running locally

Requirements:

- Docker with Compose
- or Node.js 22 + PostgreSQL 16

For the Docker setup:

```bash
cp .env.example .env
```

Generate a long random value for `TURN_SECRET`, replace the sample database password, then run:

```bash
docker compose up -d --build
```

The application container listens on `127.0.0.1:8095`. Put nginx, Caddy or another TLS reverse proxy in front of it.

TURN uses:

- `3478/udp`
- `3478/tcp`
- `49160-49200/udp` for relay traffic

The included Compose file currently contains the temporary deployment IP/domain and should be adjusted before deploying elsewhere.

## Android

The Android project lives in `apps/android`.

It loads the same hosted M0D web client in a hardened HTTPS-only WebView and adds a small native bridge for call audio routing. This is what allows the in-call button to switch between the phone's speaker and earpiece.

Build with:

```bash
gradle -p apps/android assembleDebug
```

CI also builds a debug APK and uploads it as a workflow artifact.

## Encryption model

M0D currently uses a deliberately small cryptographic design built on the browser Web Crypto API:

- each account gets a P-256 ECDH identity key pair;
- the private identity key is encrypted with a password-derived AES-GCM key before the backup copy is stored on the server;
- each conversation gets a random AES-256-GCM room key;
- the room key is separately wrapped for every conversation member using ECDH + HKDF + AES-GCM;
- message JSON is AES-GCM encrypted before upload;
- attachment bytes are encrypted before upload;
- the server stores ciphertext and routing metadata, not message plaintext.

The server still sees metadata required to operate the service, including account email addresses, conversation membership, timestamps, IP-level network information and encrypted payload sizes.

Calls use WebRTC DTLS-SRTP. A TURN server may relay the encrypted media packets when direct P2P is not possible.

### Important security note

M0D **does not implement the Signal Protocol** and has not received an independent cryptographic audit. Do not treat the current pre-release build as a high-risk secure messenger. The security model and implementation should be reviewed before making stronger claims.

## Languages

The interface currently includes:

- Русский
- English
- Українська

## Contributing

Keep commits focused and reviewable. Never commit runtime `.env` files, database dumps, certificates, session tokens or TURN secrets.

For substantial changes, prefer a feature branch and pull request instead of a stream of tiny commits.

## License

MIT. See [LICENSE](LICENSE).
