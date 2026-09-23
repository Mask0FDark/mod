# Changelog

All notable changes to M0D are documented here.

## [Unreleased]

### Added

- Initial M0D messenger architecture.
- Email + password accounts.
- One-to-one and group conversations.
- Real-time messaging over WebSocket.
- Client-side encryption for message bodies and attachments.
- Client-side image compression before encrypted upload.
- WebRTC voice/video calls with TURN fallback.
- Android-native speaker / earpiece audio routing bridge.
- Telegram-inspired responsive web interface.
- Russian, English and Ukrainian translations.
- Installable PWA metadata and offline application shell.

### Security

- Session cookies are Secure, HttpOnly and SameSite=Strict.
- Mutation requests enforce the configured application origin.
- TURN credentials are short-lived and generated server-side.
- Uploads are stored as opaque encrypted bytes.
- Public repository configuration excludes runtime secrets.
