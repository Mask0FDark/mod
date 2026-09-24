# M0D — Message Over Distance

M0D — открытый мессенджер для обычного общения на расстоянии. Название одновременно расшифровывается как **Message Over Distance** и отсылает к нику автора — Mask 0F Darkness.

Интерфейс построен по знакомой логике Telegram: список чатов, экран диалога, пузырьки сообщений, вложения и отдельный экран звонка. M0D не связан с Telegram.

> Проект находится в ранней разработке. Формат протокола, базы и криптографической обвязки ещё может меняться.

## Что уже есть

- регистрация по email с обязательным кодом подтверждения;
- вход по email и паролю;
- email является приватной информацией и **не используется для поиска людей**;
- личные чаты через приватные ссылки-приглашения;
- группы создаются сразу, а новых участников можно добавлять инвайт-ссылкой;
- каналы с владельцем, администраторами и подписчиками;
- посты каналов и комментарии отдельным тредом, как в Telegram;
- ответы на сообщения, редактирование и удаление;
- реакции и закреплённые сообщения;
- непрочитанные сообщения, статус прочтения в личных чатах и индикатор набора текста;
- роли владельца/администратора и управление участниками;
- отключение уведомлений для отдельного чата и переключатель комментариев канала;
- фоновые браузерные уведомления, пока веб-клиент/PWA запущен;
- если человек ещё не зарегистрирован, инвайт переживает регистрацию и после входа сразу открывает нужный чат;
- сообщения в реальном времени через WebSocket;
- клиентское шифрование текста и вложений;
- сжатие фотографий на клиенте до шифрования и загрузки;
- голосовые и видеозвонки через WebRTC;
- прямой P2P-медиаканал с автоматическим TURN fallback;
- Android-переключение «громкая связь / разговорный динамик»;
- PWA для установки сайта на телефон и ПК;
- интерфейс на русском, английском и украинском.

Текущий тестовый стенд M0D: `https://m0d-dev.mask-0f-darkness.ru`. Стабильная звонилка на `call.mask-0f-darkness.ru` развёрнута отдельно и не используется для разработки M0D.
## Приватность инвайтов

M0D не просит email другого человека для начала диалога.

Создатель чата получает ссылку вида:

```text
https://example.org/invite/<token>#k=<room-key>
```

Токен приглашения проверяется сервером. Секрет ключа комнаты находится после символа `#`; браузер не отправляет URL fragment серверу при HTTP-запросе.

Для личного диалога инвайт одноразовый. Группа или канал создаются владельцем сразу, после чего владелец/администратор может выпустить многоразовую инвайт-ссылку с ограниченным сроком жизни.

**Важно:** полная инвайт-ссылка является секретом. Человек, получивший её целиком, получает возможность присоединиться к чату в рамках ограничений инвайта.

## Шифрование

Сейчас M0D использует Web Crypto API:

- P-256 ECDH для ключа личности;
- AES-256-GCM для ключей комнат, сообщений и вложений;
- HKDF-SHA256 при оборачивании ключей комнаты;
- приватный ключ аккаунта хранится на сервере только в зашифрованном виде;
- сервер хранит ciphertext сообщений и файлов, а не их открытый текст.

Сервер всё ещё видит служебные метаданные: email владельца аккаунта, состав чатов, время событий, сетевые адреса и размеры зашифрованных объектов.

M0D **не реализует Signal Protocol** и пока не проходил независимый криптографический аудит. Не стоит заявлять, что текущая ранняя версия подходит для сценариев с высоким риском.
## Структура репозитория

```text
apps/
  server/    REST API, PostgreSQL, сессии, инвайты и WebSocket signaling
  web/       браузер/PWA, интерфейс, криптография и звонки
  android/   Android WebView-клиент с нативным управлением аудиовыходом

deploy/
  nginx.conf.template
  render-nginx.sh
```

## Запуск

Нужны Docker и Docker Compose. Для разработки без Docker — Node.js 22 и PostgreSQL 16.

```bash
cp .env.example .env
docker compose up -d --build
```

Перед запуском обязательно замените пароли базы, `TURN_SECRET` и SMTP-учётные данные.

Для регистрации новых пользователей требуется рабочий SMTP. Если SMTP не настроен, сервер намеренно не создаёт аккаунты без подтверждённой почты.

## Смена домена

Переезд специально сделан конфигурационным. В исходниках веб-клиента домен не зашит.

1. В `.env` поменяйте `PUBLIC_HOST`, `APP_ORIGIN`, `TURN_HOST`, `TURN_REALM` и при необходимости `TURN_EXTERNAL_IP`.
2. Если на сервере одновременно живут несколько окружений, задайте отдельные `APP_BIND`, `TURN_PORT`, `TURN_MIN_PORT`, `TURN_MAX_PORT`, имена контейнеров и volumes.
3. Выпустите TLS-сертификат для нового домена.
4. Сгенерируйте nginx-конфиг:

```bash
PUBLIC_HOST=chat.example.org CERT_NAME=chat.example.org ./deploy/render-nginx.sh
```

5. Перезапустите nginx и контейнеры.
6. Android-клиент пересобирается с новым URL:

```bash
M0D_BASE_URL=https://chat.example.org/ gradle -p apps/android assembleDebug
```

### Одновременные dev и prod

Compose поддерживает раздельные имена контейнеров, ports и volumes через `.env`. Например, тестовый стенд может использовать:

```env
PUBLIC_HOST=m0d-dev.example.org
APP_ORIGIN=https://m0d-dev.example.org
APP_BIND=127.0.0.1:8096
APP_CONTAINER_NAME=m0d-dev-app
DB_CONTAINER_NAME=m0d-dev-db
TURN_CONTAINER_NAME=m0d-dev-turn
DB_VOLUME_NAME=m0d-dev-pg
DATA_VOLUME_NAME=m0d-dev-data
TURN_HOST=m0d-dev.example.org
TURN_PORT=3480
TURN_MIN_PORT=49210
TURN_MAX_PORT=49250
```

Так тестовая сборка не занимает web/TURN-порты стабильной версии и не использует её базу.

## Android

Android-клиент использует тот же веб-интерфейс, но добавляет нативный bridge для аудио. Поэтому во время звонка можно переключаться между громкой связью и разговорным динамиком.

Debug APK собирается командой:

```bash
gradle -p apps/android assembleDebug
```

CI также может собирать APK как artifact.

## Разработка

Не коммитьте:

- `.env`;
- SMTP-пароли;
- TURN secret;
- дампы базы;
- TLS-ключи;
- session tokens.

Для крупных изменений используйте feature branch и один осмысленный PR вместо потока микрокоммитов.

---

# English

**M0D — Message Over Distance** is an open-source messenger for everyday long-distance communication. The name also references the creator's nickname, Mask 0F Darkness.

The interface follows a familiar Telegram-like workflow: chat list, conversation view, message bubbles, attachments and a dedicated call screen. M0D is not affiliated with Telegram.

> M0D is early-stage software. The protocol, database schema and cryptographic wrapping may still change.
## Current features

- email registration with mandatory verification code;
- email + password login;
- email is private account data and is **not used for user discovery**;
- direct chats created through private invitation links;
- groups created immediately, with invite links for adding members later;
- channels with owner, admin and subscriber roles;
- channel posts with threaded comments;
- replies, message editing and deletion;
- reactions and pinned messages;
- unread counters, direct-chat read receipts and typing indicators;
- member moderation and admin role management;
- per-chat mute and channel comment controls;
- background browser notifications while the web client/PWA is running;
- an invitation survives registration and opens the target chat after login;
- real-time messaging over WebSocket;
- client-side encrypted message bodies and attachments;
- client-side image compression before encryption/upload;
- WebRTC voice and video calls;
- direct P2P media with TURN relay fallback;
- native speaker / earpiece switching in the Android app;
- installable PWA;
- Russian, English and Ukrainian UI.

Current M0D development deployment: `https://m0d-dev.mask-0f-darkness.ru`. The stable private-call service at `call.mask-0f-darkness.ru` is deployed separately and is not used for M0D development.

## Invitation privacy

M0D does not require another person's email to start a conversation.

Invitation links have the general form:

```text
https://example.org/invite/<token>#k=<room-key>
```

The server validates the invitation token. The room-key secret is stored in the URL fragment after `#`; browsers do not send that fragment to the HTTP server.

A direct-chat invite is single-use. Groups and channels are created immediately by their owner; owners/admins can then issue multi-use invitation links that expire.

The full invitation URL is sensitive: anyone who obtains it may be able to join while the invitation remains valid.

## Encryption model

M0D currently uses the browser Web Crypto API:

- P-256 ECDH identity keys;
- AES-256-GCM for room keys, messages and attachments;
- HKDF-SHA256 for room-key wrapping;
- encrypted private-key backup on the server;
- ciphertext storage for messages and attachments.

The server still sees operational metadata such as the account owner's email, conversation membership, timestamps, network information and encrypted payload sizes.

M0D **does not implement the Signal Protocol** and has not yet received an independent cryptographic audit. Do not describe the current pre-release build as suitable for high-risk communications.
## Repository layout

```text
apps/
  server/    REST API, PostgreSQL, sessions, invitations and WebSocket signaling
  web/       browser/PWA client, UI, crypto and calling
  android/   Android WebView client with native audio routing

deploy/
  nginx.conf.template
  render-nginx.sh
```

## Running

Docker with Compose is recommended. Node.js 22 and PostgreSQL 16 can also be used for development.

```bash
cp .env.example .env
docker compose up -d --build
```

Replace the database password, `TURN_SECRET`, and SMTP credentials before production use.

New registrations require working SMTP. If SMTP is not configured, the server intentionally refuses to create an account with an unverified email.

## Changing the domain

The deployment is designed so a domain move is configuration work rather than a source-code rewrite.

1. Change `PUBLIC_HOST`, `APP_ORIGIN`, `TURN_HOST`, `TURN_REALM`, and if needed `TURN_EXTERNAL_IP` in `.env`.
2. If several environments share one server, give each its own `APP_BIND`, `TURN_PORT`, `TURN_MIN_PORT`, `TURN_MAX_PORT`, container names and volume names.
3. Issue a TLS certificate for the new hostname.
4. Render nginx config:

```bash
PUBLIC_HOST=chat.example.org CERT_NAME=chat.example.org ./deploy/render-nginx.sh
```

5. Reload nginx and the containers.
6. Rebuild Android with the new URL:

```bash
M0D_BASE_URL=https://chat.example.org/ gradle -p apps/android assembleDebug
```

### Running dev and prod side by side

Container names, bind ports and Docker volume names can all be configured through `.env`. Give the development environment its own values so it cannot take over the stable deployment's web port, TURN port or database.

## License

MIT. See [LICENSE](LICENSE).
