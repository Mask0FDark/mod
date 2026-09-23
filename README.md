# M0D

**M0D — Message Over Distance** is a small open-source messenger focused on private everyday communication across long distances.

The name has two meanings:

- **Message Over Distance**
- **M0D** — a reference to the creator's nickname, Mask 0F Darkness

M0D is currently in early development. The first public version is designed around a familiar Telegram-like workflow: chats on the left, conversation on the right, responsive mobile navigation, file sharing, and voice/video calls.

## What is being built

- Email + password accounts
- One-to-one chats
- Group chats
- Real-time messaging over WebSocket
- Client-side encrypted message content
- Client-side encrypted attachments
- Image compression before upload
- Voice and video calls with WebRTC
- TURN relay fallback when direct P2P is unavailable
- Speaker / earpiece switching in the Android app
- Installable PWA for phones and desktop
- Russian, English and Ukrainian interface
- Responsive Telegram-inspired UI

## Security model

M0D is being built so that message text and attachment contents are encrypted on the client before they are sent to the server. The server still necessarily sees some metadata such as account identifiers, conversation membership, timestamps and encrypted payload sizes.

WebRTC calls use DTLS-SRTP. When TURN relay is required, the TURN server relays encrypted media packets and does not terminate the WebRTC media encryption.

This project does **not** claim to implement the Signal Protocol, and the custom cryptographic layer should be independently reviewed before M0D is treated as a high-risk secure messenger.

## Repository layout

```text
apps/
  server/    M0D API, WebSocket signaling and realtime backend
  web/       Browser/PWA client
  android/   Android wrapper and native audio-route integration
deploy/      Deployment configuration
```

## Development status

M0D is pre-release software. APIs and storage formats may change while the first usable version is being completed.

The temporary deployment is hosted at:

```text
https://call.mask-0f-darkness.ru
```

A dedicated domain is planned later.

## Languages

The UI ships with:

- Русский
- English
- Українська

## License

A license will be selected before the first stable release. Until then, please treat the repository as source-available for review and development rather than assuming redistribution rights.
