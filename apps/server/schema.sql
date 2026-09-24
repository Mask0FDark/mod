CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 40),
  auth_secret_salt text,
  auth_secret_hash text,
  email_verified_at timestamptz,
  password_salt text,
  password_hash text,
  public_key_jwk jsonb NOT NULL,
  encrypted_private_key jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_secret_salt text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_secret_hash text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_salt text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='users' AND column_name='password_salt'
  ) THEN
    ALTER TABLE users ALTER COLUMN password_salt DROP NOT NULL;
    ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email
  ON email_verifications(email, created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('direct','group')),
  title text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;
ALTER TABLE conversations
  ADD CONSTRAINT conversations_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS conversation_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('direct','group')),
  title text,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  max_uses integer NOT NULL DEFAULT 1 CHECK (max_uses BETWEEN 1 AND 50),
  use_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_invites_creator
  ON conversation_invites(created_by, created_at DESC);

CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS conversation_keys (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wrapped_by_user_id uuid NOT NULL REFERENCES users(id),
  iv text NOT NULL,
  ciphertext text NOT NULL,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  storage_name text NOT NULL UNIQUE,
  byte_size bigint NOT NULL CHECK (byte_size >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ciphertext text NOT NULL,
  iv text NOT NULL,
  attachment_id uuid REFERENCES attachments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id_id
  ON messages(conversation_id, id DESC);

CREATE INDEX IF NOT EXISTS idx_members_user
  ON conversation_members(user_id, conversation_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expiry
  ON sessions(expires_at);


-- Core messenger features: channels, roles, threads, reactions, pins and read state.
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_kind_check;
ALTER TABLE conversations
  ADD CONSTRAINT conversations_kind_check CHECK (kind IN ('direct','group','channel'));
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS comments_enabled boolean NOT NULL DEFAULT true;

ALTER TABLE conversation_invites DROP CONSTRAINT IF EXISTS conversation_invites_kind_check;
ALTER TABLE conversation_invites
  ADD CONSTRAINT conversation_invites_kind_check CHECK (kind IN ('direct','group','channel'));

ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member';
ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS last_read_message_id bigint NOT NULL DEFAULT 0;
ALTER TABLE conversation_members ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true;
ALTER TABLE conversation_members DROP CONSTRAINT IF EXISTS conversation_members_role_check;
ALTER TABLE conversation_members
  ADD CONSTRAINT conversation_members_role_check CHECK (role IN ('owner','admin','member','subscriber'));

UPDATE conversation_members cm
SET role='owner'
FROM conversations c
WHERE cm.conversation_id=c.id
  AND cm.user_id=c.created_by
  AND cm.role<>'owner';

UPDATE conversation_members cm
SET role='subscriber'
FROM conversations c
WHERE cm.conversation_id=c.id
  AND c.kind='channel'
  AND cm.role='member';

ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id bigint;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS thread_root_id bigint;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS client_message_id uuid;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS request_hash text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_messages_client_request
  ON messages(conversation_id, sender_id, client_message_id)
  WHERE client_message_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='messages_reply_to_id_fkey'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT messages_reply_to_id_fkey
      FOREIGN KEY (reply_to_id) REFERENCES messages(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname='messages_thread_root_id_fkey'
  ) THEN
    ALTER TABLE messages
      ADD CONSTRAINT messages_thread_root_id_fkey
      FOREIGN KEY (thread_root_id) REFERENCES messages(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS message_reactions (
  message_id bigint NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK (char_length(emoji) BETWEEN 1 AND 16),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (message_id, user_id)
);

CREATE TABLE IF NOT EXISTS conversation_pins (
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  message_id bigint NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  pinned_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pinned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, message_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_root
  ON messages(conversation_id, thread_root_id, id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to
  ON messages(reply_to_id);
CREATE INDEX IF NOT EXISTS idx_reactions_message
  ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_pins_conversation
  ON conversation_pins(conversation_id, pinned_at DESC);

-- Public numeric IDs are used only in browser deep-links. Internal relations stay UUID-based.
CREATE SEQUENCE IF NOT EXISTS conversation_public_id_seq AS bigint START WITH 100000001;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS public_id bigint;
UPDATE conversations SET public_id=nextval('conversation_public_id_seq') WHERE public_id IS NULL;
ALTER TABLE conversations ALTER COLUMN public_id SET DEFAULT nextval('conversation_public_id_seq');
ALTER TABLE conversations ALTER COLUMN public_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS conversations_public_id_unique ON conversations(public_id);

ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;
CREATE UNIQUE INDEX IF NOT EXISTS users_username_unique ON users(username) WHERE username IS NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_data bytea;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_version uuid;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS system_event jsonb;
CREATE TABLE IF NOT EXISTS call_history(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
 caller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 callee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 message_id bigint NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
 video boolean NOT NULL DEFAULT false,
 status text NOT NULL DEFAULT 'ringing',
 created_at timestamptz NOT NULL DEFAULT now(),
 accepted_at timestamptz, ended_at timestamptz
);
CREATE UNIQUE INDEX IF NOT EXISTS calls_one_active ON call_history(conversation_id) WHERE ended_at IS NULL;
