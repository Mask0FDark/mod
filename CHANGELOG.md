# Changelog / Журнал изменений

## Русский

### [Unreleased]

#### Добавлено

- Базовая архитектура M0D.
- Регистрация по email с обязательным 6-значным кодом подтверждения.
- Вход по email и паролю.
- Личные чаты и группы через приватные ссылки-приглашения.
- Автоматическое продолжение инвайта после регистрации или входа.
- Realtime-сообщения через WebSocket.
- Клиентское шифрование сообщений и вложений.
- Сжатие изображений на клиенте до шифрования и загрузки.
- Голосовые и видеозвонки WebRTC с TURN fallback.
- Нативное переключение громкой связи / разговорного динамика в Android.
- Адаптивный интерфейс в логике Telegram.
- Русский, английский и украинский интерфейс.
- PWA для установки веб-клиента.
- Конфигурационная смена домена без переписывания веб-клиента.
- Группы создаются сразу, без обязательного предварительного инвайта.
- Каналы с ролями владельца, администратора и подписчика.
- Комментарии к постам канала отдельными тредами.
- Ответы на сообщения, редактирование и удаление.
- Реакции и закреплённые сообщения.
- Счётчики непрочитанного, отметки прочтения в личных чатах и typing-индикатор.
- Управление ролями и удаление участников.
- Per-chat mute и управление комментариями канала.
- Браузерные уведомления для запущенного в фоне web/PWA-клиента.
- Раздельные параметры контейнеров, web/TURN-портов и volumes для одновременных dev/prod окружений.
- Письма с кодом подтверждения на русском, английском и украинском.

#### Изменено

- Полностью удалён поиск пользователей по email.
- Email других участников больше не возвращается клиентам в данных чатов.
- Создание нового диалога теперь начинается с инвайт-ссылки, а не с ввода чужого email.
- Android URL вынесен в build-time параметр `M0D_BASE_URL`.
- nginx переведён на шаблон с `PUBLIC_HOST` / `CERT_NAME`.
- Старые аккаунты мигрируют на отдельный `authSecret` при первом успешном входе; legacy password hash после миграции удаляется.

#### Безопасность

- Новые аккаунты нельзя создать без подтверждения email.
- Session cookie использует Secure, HttpOnly и SameSite=Strict.
- Mutation API проверяет Origin.
- TURN credentials короткоживущие и выдаются сервером.
- Вложения хранятся как зашифрованные байты.
- Runtime-секреты исключены из публичного репозитория.
- Полный секрет инвайта хранится в URL fragment и не отправляется серверу при HTTP-запросе.
- Создание чатов по `memberId` удалено на backend: новые чаты создаются только через инвайт-flow.
- `nodemailer` обновлён до версии без известных npm audit уязвимостей в текущем lockfile.

---

## English

### [Unreleased]

#### Added

- Initial M0D messenger architecture.
- Email registration with a mandatory six-digit verification code.
- Email and password login.
- Direct chats and groups through private invitation links.
- Automatic invite continuation after registration/login.
- Real-time messaging over WebSocket.
- Client-side encryption for messages and attachments.
- Client-side image compression before encryption/upload.
- WebRTC voice/video calls with TURN fallback.
- Native Android speaker / earpiece routing.
- Responsive Telegram-inspired interface.
- Russian, English and Ukrainian UI.
- Installable PWA.
- Configuration-driven domain migration.
- Groups are created immediately without requiring an initial invite.
- Channels with owner, admin and subscriber roles.
- Threaded comments under channel posts.
- Replies, message editing and deletion.
- Reactions and pinned messages.
- Unread counters, direct-chat read receipts and typing indicators.
- Role management and member moderation.
- Per-chat mute and channel comment controls.
- Browser notifications while the web/PWA client is running in the background.
- Separate container, web/TURN port and volume settings for parallel dev/prod deployments.
- Verification emails in Russian, English and Ukrainian.

#### Changed

- Removed user discovery by email completely.
- Other participants' email addresses are no longer returned in conversation data.
- New conversations now start from invitation links instead of entering another person's email.
- Android base URL is configured through `M0D_BASE_URL`.
- nginx deployment uses `PUBLIC_HOST` / `CERT_NAME` placeholders.
- Legacy accounts migrate to the derived `authSecret` on the first successful login; the legacy password hash is cleared afterwards.

#### Security

- New accounts cannot be created without email verification.
- Session cookies are Secure, HttpOnly and SameSite=Strict.
- Mutation API enforces the configured Origin.
- TURN credentials are short-lived and server-generated.
- Attachments are stored as encrypted bytes.
- Runtime secrets are excluded from the public repository.
- The invitation secret is carried in the URL fragment and is not sent to the HTTP server.
- Backend conversation creation by `memberId` was removed; new conversations are invite-only.
- `nodemailer` is pinned to a version with a clean current npm audit.
