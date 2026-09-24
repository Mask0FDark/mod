import { applyTranslations, getLanguage, setLanguage, t } from "./i18n.js";
import {
  createIdentity,
  deriveAuthSecret,
  unlockPrivateKey,
  generateRoomKey,
  exportRoomKey,
  importRoomKey,
  wrapRoomKey,
  unwrapRoomKey,
  encryptJson,
  decryptJson,
  encryptBytes,
  decryptBytes
} from "./crypto.js";

const $ = id => document.getElementById(id);
const ui = {
  authView: $("authView"),
  appView: $("appView"),
  loginTab: $("loginTab"),
  registerTab: $("registerTab"),
  authForm: $("authForm"),
  nameLabel: $("nameLabel"),
  nameInput: $("nameInput"),
  emailInput: $("emailInput"),
  passwordInput: $("passwordInput"),
  verificationLabel: $("verificationLabel"),
  verificationCodeInput: $("verificationCodeInput"),
  authSubmit: $("authSubmit"),
  authError: $("authError"),
  sidebar: $("sidebar"),
  menuButton: $("menuButton"),
  newChatButton: $("newChatButton"),
  chatSearch: $("chatSearch"),
  chatList: $("chatList"),
  meAvatar: $("meAvatar"),
  meName: $("meName"),
  meEmail: $("meEmail"),
  logoutButton: $("logoutButton"),
  chatPane: $("chatPane"),
  emptyChat: $("emptyChat"),
  activeChat: $("activeChat"),
  backButton: $("backButton"),
  chatAvatar: $("chatAvatar"),
  chatTitle: $("chatTitle"),
  chatStatus: $("chatStatus"),
  audioCallButton: $("audioCallButton"),
  videoCallButton: $("videoCallButton"),
  chatInfoButton: $("chatInfoButton"),
  messageList: $("messageList"),
  fileInput: $("fileInput"),
  attachButton: $("attachButton"),
  composerContext: $("composerContext"),
  composerContextTitle: $("composerContextTitle"),
  composerContextText: $("composerContextText"),
  cancelComposerContext: $("cancelComposerContext"),
  readOnlyHint: $("readOnlyHint"),
  messageInput: $("messageInput"),
  sendButton: $("sendButton"),
  drawerBackdrop: $("drawerBackdrop"),
  settingsDrawer: $("settingsDrawer"),
  closeDrawerButton: $("closeDrawerButton"),
  enableNotificationsButton: $("enableNotificationsButton"),
  newChatModal: $("newChatModal"),
  closeNewChatButton: $("closeNewChatButton"),
  inviteKindInput: $("inviteKindInput"),
  groupTitleLabel: $("groupTitleLabel"),
  groupTitleInput: $("groupTitleInput"),
  descriptionLabel: $("descriptionLabel"),
  descriptionInput: $("descriptionInput"),
  newChatHelp: $("newChatHelp"),
  inviteResult: $("inviteResult"),
  inviteLinkInput: $("inviteLinkInput"),
  copyInviteButton: $("copyInviteButton"),
  newChatError: $("newChatError"),
  createChatButton: $("createChatButton"),
  chatInfoModal: $("chatInfoModal"),
  closeChatInfoButton: $("closeChatInfoButton"),
  infoTitle: $("infoTitle"),
  infoSubtitle: $("infoSubtitle"),
  infoDescription: $("infoDescription"),
  shareInviteButton: $("shareInviteButton"),
  editConversationButton: $("editConversationButton"),
  muteConversationButton: $("muteConversationButton"),
  toggleCommentsButton: $("toggleCommentsButton"),
  infoInviteResult: $("infoInviteResult"),
  infoInviteLink: $("infoInviteLink"),
  copyInfoInviteButton: $("copyInfoInviteButton"),
  memberCount: $("memberCount"),
  memberList: $("memberList"),
  leaveConversationButton: $("leaveConversationButton"),
  threadModal: $("threadModal"),
  closeThreadButton: $("closeThreadButton"),
  threadSubtitle: $("threadSubtitle"),
  threadMessageList: $("threadMessageList"),
  threadInput: $("threadInput"),
  threadSendButton: $("threadSendButton"),
  callOverlay: $("callOverlay"),
  remoteVideo: $("remoteVideo"),
  callBackdropAvatar: $("callBackdropAvatar"),
  minimizeCallButton: $("minimizeCallButton"),
  callPeerName: $("callPeerName"),
  callStatus: $("callStatus"),
  callRoute: $("callRoute"),
  localVideoFrame: $("localVideoFrame"),
  localVideo: $("localVideo"),
  incomingActions: $("incomingActions"),
  declineCallButton: $("declineCallButton"),
  acceptCallButton: $("acceptCallButton"),
  activeCallControls: $("activeCallControls"),
  speakerButton: $("speakerButton"),
  micButton: $("micButton"),
  cameraButton: $("cameraButton"),
  screenButton: $("screenButton"),
  endCallButton: $("endCallButton"),
  toast: $("toast")
};

const state = {
  authMode: "login",
  verificationId: null,
  pendingInvite: null,
  me: null,
  privateKey: null,
  conversations: [],
  roomKeys: new Map(),
  activeConversation: null,
  online: new Set(),
  ws: null,
  toastTimer: null,
  replyTo: null,
  editingMessage: null,
  messageCache: new Map(),
  threadRoot: null,
  typingTimer: null,
  remoteTypingTimer: null,
  call: {
    state: "idle",
    peerId: null,
    conversationId: null,
    video: false,
    pc: null,
    localStream: null,
    screenStream: null,
    pendingIce: [],
    startedAt: 0,
    timer: null,
    stats: null,
    speaker: true
  }
};

function firstLetter(value) {
  return String(value || "?").trim().charAt(0).toUpperCase() || "?";
}

function showToast(message, timeout = 2800) {
  clearTimeout(state.toastTimer);
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  state.toastTimer = setTimeout(() => ui.toast.classList.add("hidden"), timeout);
}

async function api(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof Blob) && !(options.body instanceof ArrayBuffer)) {
    headers["Content-Type"] ||= "application/json";
  }
  const response = await fetch(url, { ...options, headers });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.arrayBuffer();
  if (!response.ok) {
    const error = new Error(data?.error || "request_failed");
    error.status = response.status;
    error.code = data?.error;
    throw error;
  }
  return data;
}

function dbOpen() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("m0d", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("identity")) db.createObjectStore("identity");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function identityGet(userId) {
  const db = await dbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("identity", "readonly");
    const request = tx.objectStore("identity").get(userId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function identitySet(userId, privateKey) {
  const db = await dbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("identity", "readwrite");
    tx.objectStore("identity").put(privateKey, userId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function identityDelete(userId) {
  if (!userId) return;
  const db = await dbOpen();
  return new Promise(resolve => {
    const tx = db.transaction("identity", "readwrite");
    tx.objectStore("identity").delete(userId);
    tx.oncomplete = resolve;
    tx.onerror = resolve;
  });
}

function setAuthMode(mode) {
  state.authMode = mode;
  const register = mode === "register";
  ui.loginTab.classList.toggle("active", !register);
  ui.registerTab.classList.toggle("active", register);
  ui.nameLabel.classList.toggle("hidden", !register);
  state.verificationId = null;
  ui.verificationLabel.classList.add("hidden");
  ui.verificationCodeInput.value = "";
  ui.authSubmit.dataset.i18n = register ? "register" : "login";
  ui.passwordInput.autocomplete = register ? "new-password" : "current-password";
  applyTranslations();
  ui.authError.textContent = "";
}

function mapAuthError(error) {
  if (error.code === "email_exists") return t("emailExists");
  if (error.code === "invalid_credentials") return t("invalidCredentials");
  if (error.code === "invalid_registration" || error.code === "invalid_email") return t("invalidRegistration");
  if (error.code === "verification_invalid") return t("verificationInvalid");
  if (error.code === "mail_not_configured") return t("mailUnavailable");
  return t("serverError");
}

async function submitAuth(event) {
  event.preventDefault();
  ui.authError.textContent = "";
  ui.authSubmit.disabled = true;
  const email = ui.emailInput.value.trim().toLowerCase();
  const password = ui.passwordInput.value;

  try {
    if (state.authMode === "register" && !state.verificationId) {
      const started = await api("/api/auth/register/start", {
        method: "POST",
        body: JSON.stringify({ email, language: getLanguage() })
      });
      state.verificationId = started.verificationId;
      ui.verificationLabel.classList.remove("hidden");
      ui.authSubmit.dataset.i18n = "verifyAndRegister";
      applyTranslations();
      ui.authError.textContent = t("verificationSent");
      ui.verificationCodeInput.focus();
      return;
    }

    const authSecret = await deriveAuthSecret(email, password);
    if (state.authMode === "register") {
      const displayName = ui.nameInput.value.trim();
      const identity = await createIdentity(password);
      const result = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          authSecret,
          displayName,
          verificationId: state.verificationId,
          code: ui.verificationCodeInput.value.trim(),
          publicKeyJwk: identity.publicKeyJwk,
          encryptedPrivateKey: identity.encryptedPrivateKey
        })
      });
      state.me = result.user;
      state.privateKey = identity.pair.privateKey;
      await identitySet(state.me.id, state.privateKey);
    } else {
      let result;
      try {
        result = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, authSecret })
        });
      } catch (error) {
        if (error.code !== "legacy_auth_required") throw error;
        result = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, authSecret, password })
        });
      }
      state.me = result.user;
      state.privateKey = await unlockPrivateKey(state.me.encrypted_private_key, password);
      await identitySet(state.me.id, state.privateKey);
    }

    ui.passwordInput.value = "";
    await enterMessenger();
  } catch (error) {
    ui.authError.textContent = mapAuthError(error);
  } finally {
    ui.authSubmit.disabled = false;
  }
}

function conversationName(conversation) {
  if (conversation.kind === "group") return conversation.title || t("group");
  if (conversation.kind === "channel") return conversation.title || t("channel");
  const other = conversation.members.find(member => member.id !== state.me.id);
  return other?.displayName || other?.display_name || "M0D";
}

function myRole(conversation) {
  return conversation?.my_role || conversation?.members?.find(member => member.id === state.me?.id)?.role || "member";
}

function canManageConversation(conversation) {
  return ["owner", "admin"].includes(myRole(conversation));
}

function canPostToConversation(conversation) {
  if (!conversation) return false;
  return conversation.kind !== "channel" || canManageConversation(conversation);
}

function directPeer(conversation) {
  if (!conversation || conversation.kind !== "direct") return null;
  return conversation.members.find(member => member.id !== state.me.id) || null;
}

function conversationStatus(conversation) {
  if (conversation.kind === "group") {
    return `${conversation.members.length} ${t("members")}`;
  }
  if (conversation.kind === "channel") {
    return `${conversation.members.length} ${t("subscriber")}`;
  }
  const peer = directPeer(conversation);
  return peer && state.online.has(peer.id) ? t("online") : t("offline");
}

function parseStoredKeyEnvelope(conversation) {
  let stored;
  try {
    stored = JSON.parse(conversation.key_ciphertext);
  } catch {
    return { context: conversation.id, ciphertext: conversation.key_ciphertext };
  }
  if (!stored?.context || !stored?.data) {
    return { context: conversation.id, ciphertext: conversation.key_ciphertext };
  }
  return { context: stored.context, ciphertext: stored.data };
}

async function unlockConversationKey(conversation) {
  if (state.roomKeys.has(conversation.id)) return state.roomKeys.get(conversation.id);
  const wrapper = conversation.members.find(member => member.id === conversation.wrapped_by_user_id);
  if (!wrapper) throw new Error("wrapper_missing");
  const stored = parseStoredKeyEnvelope(conversation);
  const roomKey = await unwrapRoomKey(
    { iv: conversation.key_iv, ciphertext: stored.ciphertext },
    state.privateKey,
    wrapper.publicKeyJwk,
    stored.context
  );
  state.roomKeys.set(conversation.id, roomKey);
  return roomKey;
}

function shortTime(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat(getLanguage(), {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function readableSize(bytes) {
  const value = Number(bytes || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

async function previewFor(conversation) {
  if (!conversation.last_ciphertext) return t("encrypted");
  try {
    const roomKey = await unlockConversationKey(conversation);
    const body = await decryptJson(roomKey, {
      iv: conversation.last_iv,
      ciphertext: conversation.last_ciphertext
    });
    if (body.attachment?.kind === "image" && !body.text) return t("photo");
    if (body.attachment && !body.text) return body.attachment.name || t("file");
    return body.text || t("encrypted");
  } catch {
    return "🔒 " + t("encrypted");
  }
}

async function renderConversationList() {
  const query = ui.chatSearch.value.trim().toLowerCase();
  const list = state.conversations.filter(c => conversationName(c).toLowerCase().includes(query));
  ui.chatList.replaceChildren();

  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.innerHTML = `<div><strong>${t("noChats")}</strong><p>${t("noChatsHint")}</p></div>`;
    ui.chatList.appendChild(empty);
    return;
  }

  for (const conversation of list) {
    const row = document.createElement("button");
    row.className = "chat-row" + (state.activeConversation?.id === conversation.id ? " active" : "");
    row.type = "button";

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = firstLetter(conversationName(conversation));

    const main = document.createElement("div");
    main.className = "chat-row-main";
    main.innerHTML = `
      <div class="chat-row-top">
        <span class="chat-row-name"></span>
        <span class="chat-time">${shortTime(conversation.last_message_at || conversation.created_at)}</span>
      </div>
      <div class="chat-row-bottom">
        <div class="chat-preview">🔒 ${t("encrypted")}</div>
        <span class="unread-badge ${Number(conversation.unread_count || 0) > 0 ? "" : "hidden"}">${Number(conversation.unread_count || 0)}</span>
      </div>
    `;
    main.querySelector(".chat-row-name").textContent = conversationName(conversation);
    row.append(avatar, main);
    row.addEventListener("click", () => openConversation(conversation.id));
    ui.chatList.appendChild(row);

    previewFor(conversation).then(text => {
      const preview = main.querySelector(".chat-preview");
      if (preview) preview.textContent = text;
    });
  }
}

async function loadConversations() {
  const result = await api("/api/conversations");
  state.conversations = result.conversations || [];
  for (const conversation of state.conversations) {
    try {
      await unlockConversationKey(conversation);
    } catch {}
  }
  await renderConversationList();

  if (state.activeConversation) {
    const refreshed = state.conversations.find(c => c.id === state.activeConversation.id);
    if (refreshed) state.activeConversation = refreshed;
  }
}

function updateChatHeader() {
  const conversation = state.activeConversation;
  if (!conversation) return;
  const name = conversationName(conversation);
  ui.chatAvatar.textContent = firstLetter(name);
  ui.chatTitle.textContent = name;
  ui.chatStatus.textContent = conversationStatus(conversation);
  const peer = directPeer(conversation);
  ui.chatStatus.classList.toggle("online", Boolean(peer && state.online.has(peer.id)));
  const canCall = conversation.kind === "direct";
  ui.audioCallButton.classList.toggle("hidden", !canCall);
  ui.videoCallButton.classList.toggle("hidden", !canCall);

  const readOnly = conversation.kind === "channel" && !canPostToConversation(conversation);
  ui.readOnlyHint.classList.toggle("hidden", !readOnly);
  ui.messageInput.classList.toggle("hidden", readOnly);
  ui.attachButton.classList.toggle("hidden", readOnly);
  ui.sendButton.classList.toggle("hidden", readOnly);
}

function clearComposerContext() {
  state.replyTo = null;
  state.editingMessage = null;
  ui.composerContext.classList.add("hidden");
  ui.composerContextTitle.textContent = "";
  ui.composerContextText.textContent = "";
}

async function markConversationRead(messageId) {
  const conversation = state.activeConversation;
  if (!conversation || !messageId) return;
  conversation.unread_count = 0;
  conversation.last_read_message_id = Math.max(Number(conversation.last_read_message_id || 0), Number(messageId));
  await renderConversationList();
  api(`/api/conversations/${conversation.id}/read`, {
    method: "POST",
    body: JSON.stringify({ messageId })
  }).catch(() => {});
}

async function openConversation(id) {
  const conversation = state.conversations.find(c => c.id === id);
  if (!conversation) return;
  state.activeConversation = conversation;
  clearComposerContext();
  state.threadRoot = null;
  ui.emptyChat.classList.add("hidden");
  ui.activeChat.classList.remove("hidden");
  ui.chatPane.classList.remove("empty");
  ui.appView.classList.add("chat-open");
  updateChatHeader();
  await renderConversationList();
  await loadMessages();
}

async function loadMessages() {
  const conversation = state.activeConversation;
  if (!conversation) return;
  ui.messageList.replaceChildren();
  state.messageCache.clear();

  try {
    const roomKey = await unlockConversationKey(conversation);
    const result = await api(`/api/conversations/${conversation.id}/messages?limit=50`);
    for (const message of result.messages || []) {
      await appendMessage(message, roomKey);
    }
    const last = result.messages?.[result.messages.length - 1];
    if (last) await markConversationRead(last.id);
    requestAnimationFrame(() => {
      ui.messageList.scrollTop = ui.messageList.scrollHeight;
    });
  } catch {
    showToast(t("cryptoError"));
  }
}

async function appendMessage(message, roomKey = null, host = ui.messageList, isThread = false) {
  const conversation = state.conversations.find(c => c.id === message.conversation_id) || state.activeConversation;
  if (!conversation) return;
  roomKey ||= await unlockConversationKey(conversation);

  let body = { text: "" };
  if (!message.deleted_at) {
    try {
      body = await decryptJson(roomKey, { iv: message.iv, ciphertext: message.ciphertext });
    } catch {
      body = { text: "🔒 " + t("encrypted") };
    }
  }
  state.messageCache.set(Number(message.id), { message, body });

  const row = document.createElement("div");
  const mine = message.sender_id === state.me.id;
  row.className = "message-row " + (mine ? "out" : "in");
  row.dataset.messageId = message.id;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble" + (message.deleted_at ? " deleted" : "");

  if ((conversation.kind === "group" || conversation.kind === "channel" || isThread) && !mine) {
    const member = conversation.members.find(m => m.id === message.sender_id);
    const author = document.createElement("div");
    author.className = "message-author";
    author.textContent = member?.displayName || message.sender_name || "M0D";
    bubble.appendChild(author);
  }

  if (message.reply_to_id) {
    const reply = document.createElement("button");
    reply.className = "reply-preview";
    reply.type = "button";
    const cached = state.messageCache.get(Number(message.reply_to_id));
    reply.textContent = cached?.body?.text
      ? "↩ " + cached.body.text.slice(0, 90)
      : "↩ #" + message.reply_to_id;
    reply.addEventListener("click", () => {
      const target = host.querySelector(`[data-message-id="${message.reply_to_id}"]`);
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      target?.classList.add("message-highlight");
      setTimeout(() => target?.classList.remove("message-highlight"), 1200);
    });
    bubble.appendChild(reply);
  }

  if (message.deleted_at) {
    const deleted = document.createElement("div");
    deleted.className = "message-text deleted-text";
    deleted.textContent = t("messageDeleted");
    bubble.appendChild(deleted);
  } else {
    if (body.attachment) {
      const attachment = document.createElement("div");
      attachment.className = "message-attachment";
      bubble.appendChild(attachment);
      renderAttachment(attachment, body.attachment, roomKey).catch(() => {
        attachment.textContent = "🔒 " + t("file");
      });
    }

    if (body.text) {
      const textNode = document.createElement("div");
      textNode.className = "message-text";
      textNode.textContent = body.text;
      bubble.appendChild(textNode);
    }
  }

  const reactions = Array.isArray(message.reactions) ? message.reactions : [];
  if (reactions.length) {
    const reactionRow = document.createElement("div");
    reactionRow.className = "reaction-row";
    const grouped = new Map();
    for (const reaction of reactions) {
      const item = grouped.get(reaction.emoji) || { count: 0, mine: false };
      item.count += 1;
      if ((reaction.userId || reaction.user_id) === state.me.id) item.mine = true;
      grouped.set(reaction.emoji, item);
    }
    for (const [emoji, info] of grouped) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "reaction-chip" + (info.mine ? " mine" : "");
      chip.textContent = `${emoji} ${info.count}`;
      chip.addEventListener("click", () => toggleReaction(message.id, emoji));
      reactionRow.appendChild(chip);
    }
    bubble.appendChild(reactionRow);
  }

  if (!message.deleted_at) {
    const actions = document.createElement("div");
    actions.className = "message-actions";

    const react = document.createElement("button");
    react.type = "button";
    react.textContent = "👍";
    react.title = "Reaction";
    react.addEventListener("click", () => toggleReaction(message.id, "👍"));
    actions.appendChild(react);

    if (!(conversation.kind === "channel" && !isThread && !message.thread_root_id)) {
      const reply = document.createElement("button");
      reply.type = "button";
      reply.textContent = "↩";
      reply.title = t("reply");
      reply.addEventListener("click", () => beginReply(message, body, isThread));
      actions.appendChild(reply);
    }

    if (mine) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "✎";
      edit.title = t("edit");
      edit.addEventListener("click", () => beginEdit(message, body, isThread));
      actions.appendChild(edit);
    }

    if (mine || canManageConversation(conversation)) {
      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "⌫";
      del.title = t("delete");
      del.addEventListener("click", () => deleteMessage(message.id, isThread));
      actions.appendChild(del);
    }

    if (canManageConversation(conversation) && !isThread) {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.textContent = message.pinned ? "📌" : "⌖";
      pin.title = message.pinned ? t("unpin") : t("pin");
      pin.addEventListener("click", () => togglePin(message.id));
      actions.appendChild(pin);
    }

    bubble.appendChild(actions);
  }

  if (conversation.kind === "channel" && !isThread && !message.thread_root_id && !message.deleted_at) {
    const comments = document.createElement("button");
    comments.type = "button";
    comments.className = "comments-button";
    comments.textContent = `💬 ${Number(message.comment_count || 0)}`;
    comments.disabled = conversation.comments_enabled === false;
    comments.title = conversation.comments_enabled === false ? t("commentsDisabled") : t("comments");
    comments.addEventListener("click", () => openThread(message, body));
    bubble.appendChild(comments);
  }

  const meta = document.createElement("span");
  meta.className = "message-meta";
  let receipt = "";
  if (mine && conversation.kind === "direct" && !message.deleted_at) {
    const peer = directPeer(conversation);
    receipt = Number(peer?.lastReadMessageId || 0) >= Number(message.id) ? " ✓✓" : " ✓";
  }
  meta.textContent = `${message.pinned ? "📌 " : ""}${message.edited_at ? t("edited") + " · " : ""}${shortTime(message.created_at)}${receipt}`;
  bubble.appendChild(meta);

  row.appendChild(bubble);
  host.appendChild(row);
}

async function renderAttachment(host, attachment, roomKey) {
  const response = await fetch(`/api/attachments/${attachment.id}`);
  if (!response.ok) throw new Error("attachment_download_failed");
  const ciphertext = await response.arrayBuffer();
  const plaintext = await decryptBytes(roomKey, { iv: attachment.iv, ciphertext });

  if (attachment.kind === "image") {
    const blob = new Blob([plaintext], { type: attachment.mime || "image/webp" });
    const url = URL.createObjectURL(blob);
    const image = document.createElement("img");
    image.className = "message-image";
    image.alt = attachment.name || t("photo");
    image.src = url;
    image.onload = () => URL.revokeObjectURL(url);
    host.appendChild(image);
    return;
  }

  const card = document.createElement("div");
  card.className = "file-card";
  const icon = document.createElement("div");
  icon.className = "file-icon";
  icon.textContent = "↓";
  const meta = document.createElement("div");
  meta.className = "file-meta";
  const name = document.createElement("strong");
  name.textContent = attachment.name || t("file");
  const size = document.createElement("span");
  size.textContent = readableSize(attachment.size);
  meta.append(name, size);
  const download = document.createElement("button");
  download.className = "file-download";
  download.textContent = t("download");
  download.addEventListener("click", () => {
    const blob = new Blob([plaintext], { type: attachment.mime || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = attachment.name || "M0D-file";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
  card.append(icon, meta, download);
  host.appendChild(card);
}

function autosizeComposer() {
  ui.messageInput.style.height = "auto";
  ui.messageInput.style.height = Math.min(ui.messageInput.scrollHeight, 145) + "px";
}

function beginReply(message, body, isThread = false) {
  if (isThread) {
    state.threadReplyTo = message;
    state.threadEditingMessage = null;
    ui.threadSubtitle.textContent = `↩ ${body?.text?.slice(0, 80) || "#" + message.id}`;
    ui.threadInput.focus();
    return;
  }
  state.replyTo = message;
  state.editingMessage = null;
  ui.composerContextTitle.textContent = t("reply");
  ui.composerContextText.textContent = body?.text?.slice(0, 100) || "#" + message.id;
  ui.composerContext.classList.remove("hidden");
  ui.messageInput.focus();
}

function beginEdit(message, body, isThread = false) {
  if (isThread) {
    state.threadEditingMessage = message;
    state.threadReplyTo = null;
    ui.threadSubtitle.textContent = t("edit");
    ui.threadInput.value = body?.text || "";
    ui.threadInput.focus();
    return;
  }
  state.editingMessage = message;
  state.replyTo = null;
  ui.composerContextTitle.textContent = t("edit");
  ui.composerContextText.textContent = body?.text?.slice(0, 100) || "#" + message.id;
  ui.composerContext.classList.remove("hidden");
  ui.messageInput.value = body?.text || "";
  autosizeComposer();
  ui.messageInput.focus();
}

async function deleteMessage(messageId, isThread = false) {
  const conversation = state.activeConversation;
  if (!conversation) return;
  await api(`/api/conversations/${conversation.id}/messages/${messageId}`, { method: "DELETE" });
  if (isThread) await loadThreadMessages();
  else await loadMessages();
  await loadConversations();
}

async function toggleReaction(messageId, emoji) {
  const conversation = state.activeConversation;
  if (!conversation) return;
  await api(`/api/conversations/${conversation.id}/messages/${messageId}/reaction`, {
    method: "POST",
    body: JSON.stringify({ emoji })
  });
  if (state.threadRoot && !ui.threadModal.classList.contains("hidden")) await loadThreadMessages();
  else await loadMessages();
}

async function togglePin(messageId) {
  const conversation = state.activeConversation;
  if (!conversation) return;
  await api(`/api/conversations/${conversation.id}/messages/${messageId}/pin`, { method: "POST", body: "{}" });
  await loadMessages();
  await loadConversations();
}

async function sendText() {
  const conversation = state.activeConversation;
  const text = ui.messageInput.value.trim();
  if (!conversation || !text || !canPostToConversation(conversation)) return;

  const roomKey = await unlockConversationKey(conversation);
  const encrypted = await encryptJson(roomKey, { version: 1, text });

  if (state.editingMessage) {
    await api(`/api/conversations/${conversation.id}/messages/${state.editingMessage.id}`, {
      method: "PATCH",
      body: JSON.stringify(encrypted)
    });
  } else {
    await api(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        ...encrypted,
        replyToId: state.replyTo?.id || null
      })
    });
  }

  ui.messageInput.value = "";
  autosizeComposer();
  clearComposerContext();
  await loadMessages();
  await loadConversations();
}

async function compressImage(file) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  if (file.size < 400 * 1024) return file;

  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", 0.82));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
}

async function sendFile(file) {
  const conversation = state.activeConversation;
  if (!conversation || !file || !canPostToConversation(conversation)) return;

  let prepared = file;
  try {
    prepared = await compressImage(file);
  } catch {}

  if (prepared.size > 10 * 1024 * 1024) {
    showToast(t("imageTooLarge"));
    return;
  }

  const roomKey = await unlockConversationKey(conversation);
  const plaintext = await prepared.arrayBuffer();
  const encryptedFile = await encryptBytes(roomKey, plaintext);
  const upload = await api(`/api/conversations/${conversation.id}/attachments`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: encryptedFile.ciphertext
  });

  const body = {
    version: 1,
    text: "",
    attachment: {
      id: upload.id,
      iv: encryptedFile.iv,
      name: prepared.name,
      mime: prepared.type || "application/octet-stream",
      size: prepared.size,
      kind: prepared.type.startsWith("image/") ? "image" : "file"
    }
  };
  const encryptedMessage = await encryptJson(roomKey, body);
  await api(`/api/conversations/${conversation.id}/messages`, {
    method: "POST",
    body: JSON.stringify({
      ...encryptedMessage,
      attachmentId: upload.id,
      replyToId: state.replyTo?.id || null
    })
  });
  clearComposerContext();
}

function capturePendingInvite() {
  const match = location.pathname.match(/^\/invite\/([A-Za-z0-9_-]+)\/?$/);
  const fragment = new URLSearchParams(location.hash.replace(/^#/, ""));
  const roomKey = fragment.get("k");
  state.pendingInvite = match && roomKey ? { token: match[1], roomKey } : null;
}

function syncNewChatMode() {
  const kind = ui.inviteKindInput.value;
  const structured = kind === "group" || kind === "channel";
  ui.groupTitleLabel.classList.toggle("hidden", !structured);
  ui.descriptionLabel.classList.toggle("hidden", !structured);
  ui.inviteResult.classList.add("hidden");
  ui.inviteLinkInput.value = "";

  if (kind === "direct") {
    ui.newChatHelp.dataset.i18n = "invitePrivacyHint";
    ui.createChatButton.dataset.i18n = "createInvite";
  } else if (kind === "group") {
    ui.newChatHelp.dataset.i18n = "groupCreateHint";
    ui.createChatButton.dataset.i18n = "createGroup";
  } else {
    ui.newChatHelp.dataset.i18n = "channelCreateHint";
    ui.createChatButton.dataset.i18n = "createChannel";
  }
  applyTranslations();
}

async function createInvite() {
  ui.newChatError.textContent = "";
  ui.inviteResult.classList.add("hidden");
  const kind = ui.inviteKindInput.value;
  const title = ui.groupTitleInput.value.trim();
  const description = ui.descriptionInput.value.trim();

  if ((kind === "group" || kind === "channel") && !title) {
    ui.newChatError.textContent = t("groupNameRequired");
    return;
  }

  ui.createChatButton.disabled = true;
  try {
    const roomKey = await generateRoomKey();

    if (kind === "direct") {
      const exported = await exportRoomKey(roomKey);
      const result = await api("/api/invites", {
        method: "POST",
        body: JSON.stringify({ kind: "direct" })
      });
      const link = `${location.origin}/invite/${result.token}#k=${encodeURIComponent(exported)}`;
      ui.inviteLinkInput.value = link;
      ui.inviteResult.classList.remove("hidden");
      ui.createChatButton.dataset.i18n = "createAnotherInvite";
      applyTranslations();
      return;
    }

    const context = `create:${crypto.randomUUID()}`;
    const wrapped = await wrapRoomKey(roomKey, state.privateKey, state.me.public_key_jwk, context);
    const result = await api("/api/conversations", {
      method: "POST",
      body: JSON.stringify({
        kind,
        title,
        description,
        commentsEnabled: true,
        selfEnvelope: {
          iv: wrapped.iv,
          ciphertext: JSON.stringify({ context, data: wrapped.ciphertext })
        }
      })
    });

    state.roomKeys.set(result.conversation.id, roomKey);
    ui.newChatModal.classList.add("hidden");
    ui.groupTitleInput.value = "";
    ui.descriptionInput.value = "";
    await loadConversations();
    await openConversation(result.conversation.id);
    showToast(kind === "channel" ? t("newChannelCreated") : t("newGroupCreated"));
  } catch {
    ui.newChatError.textContent = kind === "direct" ? t("inviteCreateFailed") : t("chatCreateFailed");
  } finally {
    ui.createChatButton.disabled = false;
  }
}

async function acceptPendingInvite() {
  if (!state.pendingInvite || !state.me || !state.privateKey) return;
  const { token, roomKey: encodedRoomKey } = state.pendingInvite;
  try {
    const info = await api(`/api/invites/${token}`);
    const invite = info.invite;
    if (invite.creator_id === state.me.id) {
      showToast(t("ownInvite"));
      return;
    }

    const roomKey = await importRoomKey(encodedRoomKey);
    const context = `invite:${token}`;
    const selfWrapped = await wrapRoomKey(
      roomKey, state.privateKey, state.me.public_key_jwk, context
    );
    let creatorEnvelope = null;
    if (!invite.conversation_id) {
      const creatorWrapped = await wrapRoomKey(
        roomKey, state.privateKey, invite.creator_public_key, context
      );
      creatorEnvelope = {
        iv: creatorWrapped.iv,
        ciphertext: JSON.stringify({ context, data: creatorWrapped.ciphertext })
      };
    }

    const accepted = await api(`/api/invites/${token}/accept`, {
      method: "POST",
      body: JSON.stringify({
        selfEnvelope: {
          iv: selfWrapped.iv,
          ciphertext: JSON.stringify({ context, data: selfWrapped.ciphertext })
        },
        creatorEnvelope
      })
    });

    state.pendingInvite = null;
    history.replaceState(null, "", "/");
    state.roomKeys.set(accepted.conversationId, roomKey);
    await loadConversations();
    await openConversation(accepted.conversationId);
    showToast(t("inviteAccepted"));
  } catch {
    showToast(t("inviteInvalid"));
  }
}

function roleLabel(role) {
  return t(role || "member");
}

async function createConversationInvite(conversation) {
  if (!conversation || conversation.kind === "direct" || !canManageConversation(conversation)) {
    throw new Error("forbidden");
  }
  const roomKey = await unlockConversationKey(conversation);
  const exported = await exportRoomKey(roomKey);
  const result = await api("/api/invites", {
    method: "POST",
    body: JSON.stringify({ conversationId: conversation.id, maxUses: 50 })
  });
  return `${location.origin}/invite/${result.token}#k=${encodeURIComponent(exported)}`;
}

async function renderChatInfo() {
  const conversation = state.activeConversation;
  if (!conversation) return;

  ui.infoTitle.textContent = conversationName(conversation);
  ui.infoSubtitle.textContent = conversationStatus(conversation);
  ui.infoDescription.textContent = conversation.description || "";
  ui.infoDescription.classList.toggle("hidden", !conversation.description);
  ui.memberCount.textContent = String(conversation.members.length);
  ui.infoInviteResult.classList.add("hidden");

  const manageable = canManageConversation(conversation);
  ui.shareInviteButton.classList.toggle("hidden", conversation.kind === "direct" || !manageable);
  ui.editConversationButton.classList.toggle("hidden", conversation.kind === "direct" || !manageable);
  ui.leaveConversationButton.classList.toggle("hidden", myRole(conversation) === "owner");

  ui.muteConversationButton.dataset.i18n = conversation.notifications_enabled === false ? "unmuteChat" : "muteChat";
  ui.toggleCommentsButton.classList.toggle("hidden", conversation.kind !== "channel" || !manageable);
  ui.toggleCommentsButton.dataset.i18n = conversation.comments_enabled === false ? "enableComments" : "disableComments";
  applyTranslations();

  ui.memberList.replaceChildren();
  for (const member of conversation.members) {
    const row = document.createElement("div");
    row.className = "member-row";

    const avatar = document.createElement("div");
    avatar.className = "avatar small";
    avatar.textContent = firstLetter(member.displayName || member.display_name);

    const meta = document.createElement("div");
    meta.className = "member-meta";
    const name = document.createElement("strong");
    name.textContent = member.id === state.me.id
      ? `${member.displayName || member.display_name} · ${t("you")}`
      : (member.displayName || member.display_name);
    const role = document.createElement("span");
    role.textContent = roleLabel(member.role);
    meta.append(name, role);
    row.append(avatar, meta);

    if (myRole(conversation) === "owner" && member.id !== state.me.id && member.role !== "owner") {
      const roleButton = document.createElement("button");
      roleButton.className = "mini-action";
      roleButton.type = "button";
      const admin = member.role === "admin";
      roleButton.textContent = admin ? "−A" : "+A";
      roleButton.title = admin ? t("removeAdmin") : t("makeAdmin");
      roleButton.addEventListener("click", async () => {
        const nextRole = admin
          ? (conversation.kind === "channel" ? "subscriber" : "member")
          : "admin";
        await api(`/api/conversations/${conversation.id}/members/${member.id}`, {
          method: "PATCH",
          body: JSON.stringify({ role: nextRole })
        });
        await loadConversations();
        await renderChatInfo();
      });
      row.appendChild(roleButton);
    }

    if (manageable && member.id !== state.me.id && member.role !== "owner") {
      const remove = document.createElement("button");
      remove.className = "mini-action danger";
      remove.type = "button";
      remove.textContent = "✕";
      remove.title = t("removeMember");
      remove.addEventListener("click", async () => {
        await api(`/api/conversations/${conversation.id}/members/${member.id}`, { method: "DELETE" });
        await loadConversations();
        await renderChatInfo();
      });
      row.appendChild(remove);
    }

    ui.memberList.appendChild(row);
  }
}

async function openChatInfo() {
  if (!state.activeConversation) return;
  await renderChatInfo();
  ui.chatInfoModal.classList.remove("hidden");
}

async function shareCurrentConversation() {
  const link = await createConversationInvite(state.activeConversation);
  ui.infoInviteLink.value = link;
  ui.infoInviteResult.classList.remove("hidden");
}

async function editCurrentConversation() {
  const conversation = state.activeConversation;
  if (!conversation || !canManageConversation(conversation)) return;

  const title = window.prompt(t("groupName"), conversation.title || "");
  if (title === null) return;
  const description = window.prompt(t("description"), conversation.description || "");
  if (description === null) return;

  await api(`/api/conversations/${conversation.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      description,
      commentsEnabled: conversation.comments_enabled !== false
    })
  });
  await loadConversations();
  updateChatHeader();
  await renderChatInfo();
}

async function toggleConversationNotifications() {
  const conversation = state.activeConversation;
  if (!conversation) return;
  const enabled = conversation.notifications_enabled === false;
  await api(`/api/conversations/${conversation.id}/settings`, {
    method: "PATCH",
    body: JSON.stringify({ notificationsEnabled: enabled })
  });
  conversation.notifications_enabled = enabled;
  await renderChatInfo();
}

async function toggleChannelComments() {
  const conversation = state.activeConversation;
  if (!conversation || conversation.kind !== "channel" || !canManageConversation(conversation)) return;
  const enabled = conversation.comments_enabled === false;
  await api(`/api/conversations/${conversation.id}`, {
    method: "PATCH",
    body: JSON.stringify({ commentsEnabled: enabled })
  });
  await loadConversations();
  updateChatHeader();
  await renderChatInfo();
  await loadMessages();
}

async function requestBrowserNotifications() {
  if (!("Notification" in window)) return;
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
    applyTranslations();
  }
}

function maybeNotifyIncoming(conversation, message) {
  if (!conversation || message.sender_id === state.me.id || conversation.notifications_enabled === false) return;
  if (!document.hidden || !("Notification" in window) || Notification.permission !== "granted") return;
  const notification = new Notification(conversationName(conversation), {
    body: t("newMessageNotification"),
    icon: "/icon.svg",
    tag: `m0d-${conversation.id}`
  });
  notification.onclick = () => {
    window.focus();
    openConversation(conversation.id).catch(() => {});
    notification.close();
  };
}

async function leaveCurrentConversation() {
  const conversation = state.activeConversation;
  if (!conversation || myRole(conversation) === "owner") return;
  await api(`/api/conversations/${conversation.id}/members/me`, { method: "DELETE" });
  ui.chatInfoModal.classList.add("hidden");
  state.activeConversation = null;
  ui.activeChat.classList.add("hidden");
  ui.emptyChat.classList.remove("hidden");
  ui.chatPane.classList.add("empty");
  ui.appView.classList.remove("chat-open");
  await loadConversations();
}

async function openThread(message, body) {
  const conversation = state.activeConversation;
  if (!conversation || conversation.kind !== "channel" || conversation.comments_enabled === false) return;
  state.threadRoot = message;
  state.threadReplyTo = null;
  state.threadEditingMessage = null;
  ui.threadSubtitle.textContent = body?.text?.slice(0, 100) || `#${message.id}`;
  ui.threadInput.value = "";
  ui.threadModal.classList.remove("hidden");
  await loadThreadMessages();
}

async function loadThreadMessages() {
  const conversation = state.activeConversation;
  const root = state.threadRoot;
  if (!conversation || !root) return;
  const roomKey = await unlockConversationKey(conversation);
  const result = await api(`/api/conversations/${conversation.id}/messages?threadRootId=${root.id}&limit=100`);
  ui.threadMessageList.replaceChildren();
  for (const message of result.messages || []) {
    await appendMessage(message, roomKey, ui.threadMessageList, true);
  }
  const last = result.messages?.[result.messages.length - 1];
  if (last) await markConversationRead(last.id);
  ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
}

async function sendThreadComment() {
  const conversation = state.activeConversation;
  const root = state.threadRoot;
  const text = ui.threadInput.value.trim();
  if (!conversation || !root || !text) return;

  const roomKey = await unlockConversationKey(conversation);
  const encrypted = await encryptJson(roomKey, { version: 1, text });
  if (state.threadEditingMessage) {
    await api(`/api/conversations/${conversation.id}/messages/${state.threadEditingMessage.id}`, {
      method: "PATCH",
      body: JSON.stringify(encrypted)
    });
  } else {
    await api(`/api/conversations/${conversation.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        ...encrypted,
        threadRootId: root.id,
        replyToId: state.threadReplyTo?.id || null
      })
    });
  }

  state.threadEditingMessage = null;
  state.threadReplyTo = null;
  ui.threadInput.value = "";
  ui.threadSubtitle.textContent = state.messageCache.get(Number(root.id))?.body?.text?.slice(0, 100) || `#${root.id}`;
  await loadThreadMessages();
  await loadMessages();
  await loadConversations();
}

function connectSocket() {
  if (state.ws && state.ws.readyState <= 1) return;
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${protocol}//${location.host}/ws`);
  state.ws = ws;

  ws.addEventListener("message", async event => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch {
      return;
    }

    if (message.type === "presence") {
      if (message.online) state.online.add(message.userId);
      else state.online.delete(message.userId);
      updateChatHeader();
      renderConversationList();
      return;
    }

    if (message.type === "message") {
      const incoming = message.message;
      const sourceConversation = state.conversations.find(c => c.id === incoming.conversation_id);
      maybeNotifyIncoming(sourceConversation, incoming);
      if (state.activeConversation?.id === incoming.conversation_id) {
        const roomKey = await unlockConversationKey(state.activeConversation);
        if (incoming.thread_root_id) {
          if (state.threadRoot?.id === incoming.thread_root_id && !ui.threadModal.classList.contains("hidden")) {
            await appendMessage(incoming, roomKey, ui.threadMessageList, true);
            ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
          }
          await loadMessages();
        } else {
          await appendMessage(incoming, roomKey);
          ui.messageList.scrollTop = ui.messageList.scrollHeight;
          await markConversationRead(incoming.id);
        }
      }
      await loadConversations();
      return;
    }

    if (message.type === "typing") {
      if (state.activeConversation?.id === message.conversationId && message.userId !== state.me.id) {
        clearTimeout(state.remoteTypingTimer);
        ui.chatStatus.textContent = message.typing ? t("typing") : conversationStatus(state.activeConversation);
        if (message.typing) {
          state.remoteTypingTimer = setTimeout(() => updateChatHeader(), 2600);
        }
      }
      return;
    }

    if (message.type === "read") {
      const conversation = state.conversations.find(c => c.id === message.conversationId);
      const member = conversation?.members?.find(item => item.id === message.userId);
      if (member) member.lastReadMessageId = Math.max(Number(member.lastReadMessageId || 0), Number(message.messageId || 0));
      if (state.activeConversation?.id === message.conversationId && state.activeConversation.kind === "direct") {
        await loadMessages();
      }
      return;
    }

    if (["message-updated", "message-deleted", "message-reactions", "message-pinned"].includes(message.type)) {
      if (state.activeConversation?.id === message.conversationId || state.activeConversation?.id === message.message?.conversation_id) {
        await loadMessages();
        if (state.threadRoot && !ui.threadModal.classList.contains("hidden")) await loadThreadMessages();
      }
      await loadConversations();
      return;
    }

    if (["conversation-created", "conversation-updated", "member-role", "member-removed"].includes(message.type)) {
      await loadConversations();
      updateChatHeader();
      if (!ui.chatInfoModal.classList.contains("hidden")) await renderChatInfo();
      return;
    }

    if (message.type === "conversation-removed") {
      if (state.activeConversation?.id === message.conversationId) {
        state.activeConversation = null;
        ui.activeChat.classList.add("hidden");
        ui.emptyChat.classList.remove("hidden");
        ui.chatPane.classList.add("empty");
        ui.appView.classList.remove("chat-open");
      }
      await loadConversations();
      return;
    }

    await handleCallSignal(message);
  });

  ws.addEventListener("close", () => {
    if (state.me) setTimeout(connectSocket, 1600);
  });
}

function sendSignal(payload) {
  if (state.ws?.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify(payload));
  }
}

function sendTyping(typing, threadRootId = null) {
  const conversation = state.activeConversation;
  if (!conversation || state.ws?.readyState !== WebSocket.OPEN) return;
  state.ws.send(JSON.stringify({
    type: "typing",
    conversationId: conversation.id,
    typing: Boolean(typing),
    threadRootId
  }));
}

function pulseTyping(threadRootId = null) {
  sendTyping(true, threadRootId);
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(() => sendTyping(false, threadRootId), 1500);
}

function showCallOverlay(name) {
  ui.callPeerName.textContent = name;
  ui.callBackdropAvatar.textContent = firstLetter(name);
  ui.callOverlay.classList.remove("hidden");
}

async function acquireCallMedia(video) {
  try {
    state.call.localStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: video ? { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } : false
    });
  } catch {
    if (video) {
      state.call.localStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      showToast(t("noCamera"));
      state.call.video = false;
    } else {
      showToast(t("allowMicrophone"));
      throw new Error("media_denied");
    }
  }

  ui.localVideo.srcObject = state.call.localStream;
  ui.localVideoFrame.classList.toggle("hidden", !state.call.localStream.getVideoTracks().length);
  refreshCallButtons();
}

async function startCall(video) {
  const conversation = state.activeConversation;
  const peer = directPeer(conversation);
  if (!peer || state.call.state !== "idle") return;

  state.call.state = "calling";
  state.call.peerId = peer.id;
  state.call.conversationId = conversation.id;
  state.call.video = Boolean(video);
  state.call.speaker = Boolean(video);
  showCallOverlay(conversationName(conversation));
  ui.callStatus.textContent = t("calling");
  ui.incomingActions.classList.add("hidden");
  ui.activeCallControls.classList.remove("hidden");

  try {
    await acquireCallMedia(video);
    await applyAudioRoute();
    sendSignal({
      type: "call-request",
      to: peer.id,
      conversationId: conversation.id,
      video: Boolean(video)
    });
  } catch {
    finishCall(false);
  }
}

async function handleCallSignal(message) {
  if (!["call-request","call-accept","call-decline","offer","answer","ice","hangup"].includes(message.type)) return;

  if (message.type === "call-request") {
    if (state.call.state !== "idle") {
      sendSignal({
        type: "call-decline",
        to: message.from,
        conversationId: message.conversationId
      });
      return;
    }

    const conversation = state.conversations.find(c => c.id === message.conversationId);
    if (!conversation) return;
    state.call.state = "ringing";
    state.call.peerId = message.from;
    state.call.conversationId = message.conversationId;
    state.call.video = Boolean(message.video);
    state.call.speaker = Boolean(message.video);
    showCallOverlay(conversationName(conversation));
    ui.callStatus.textContent = t("incomingCall");
    ui.incomingActions.classList.remove("hidden");
    ui.activeCallControls.classList.add("hidden");
    return;
  }

  if (message.type === "call-decline") {
    if (state.call.state !== "idle") {
      showToast(t("callDeclined"));
      finishCall(false);
    }
    return;
  }

  if (message.type === "call-accept") {
    if (state.call.state === "calling") await buildPeer(true);
    return;
  }

  if (message.type === "offer") {
    await buildPeer(false, message.sdp);
    return;
  }

  if (message.type === "answer" && state.call.pc) {
    await state.call.pc.setRemoteDescription(message.sdp);
    await flushPendingIce();
    return;
  }

  if (message.type === "ice" && message.candidate) {
    if (state.call.pc?.remoteDescription) {
      try {
        await state.call.pc.addIceCandidate(message.candidate);
      } catch {}
    } else {
      state.call.pendingIce.push(message.candidate);
    }
    return;
  }

  if (message.type === "hangup") {
    showToast(t("callEnded"));
    finishCall(false);
  }
}

async function acceptIncomingCall() {
  if (state.call.state !== "ringing") return;
  const conversation = state.conversations.find(c => c.id === state.call.conversationId);
  if (!conversation) return finishCall(false);

  ui.incomingActions.classList.add("hidden");
  ui.activeCallControls.classList.remove("hidden");
  ui.callStatus.textContent = t("connecting");
  state.call.state = "connecting";

  try {
    await acquireCallMedia(state.call.video);
    await applyAudioRoute();
    sendSignal({
      type: "call-accept",
      to: state.call.peerId,
      conversationId: state.call.conversationId
    });
  } catch {
    declineIncomingCall();
  }
}

function declineIncomingCall() {
  if (state.call.peerId) {
    sendSignal({
      type: "call-decline",
      to: state.call.peerId,
      conversationId: state.call.conversationId
    });
  }
  finishCall(false);
}

async function buildPeer(offerer, remoteOffer = null) {
  if (!state.call.localStream) await acquireCallMedia(state.call.video);
  closePeerOnly();

  const config = await api("/api/ice");
  const pc = new RTCPeerConnection({
    iceServers: config.iceServers,
    iceCandidatePoolSize: 4,
    bundlePolicy: "max-bundle"
  });
  state.call.pc = pc;

  for (const track of state.call.localStream.getTracks()) {
    pc.addTrack(track, state.call.localStream);
  }

  pc.ontrack = event => {
    ui.remoteVideo.srcObject = event.streams[0];
    ui.remoteVideo.style.visibility = "visible";
    applyAudioRoute();
  };

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendSignal({
        type: "ice",
        to: state.call.peerId,
        conversationId: state.call.conversationId,
        candidate: event.candidate
      });
    }
  };

  pc.onconnectionstatechange = () => {
    if (!state.call.pc) return;
    if (pc.connectionState === "connected") {
      state.call.state = "active";
      state.call.startedAt = Date.now();
      ui.callStatus.textContent = t("inCall");
      startCallTimers();
    } else if (pc.connectionState === "failed") {
      finishCall(true);
    }
  };

  state.call.state = "connecting";
  ui.callStatus.textContent = t("connecting");

  if (offerer) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    sendSignal({
      type: "offer",
      to: state.call.peerId,
      conversationId: state.call.conversationId,
      sdp: pc.localDescription
    });
  } else {
    await pc.setRemoteDescription(remoteOffer);
    await flushPendingIce();
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    sendSignal({
      type: "answer",
      to: state.call.peerId,
      conversationId: state.call.conversationId,
      sdp: pc.localDescription
    });
  }
}

async function flushPendingIce() {
  if (!state.call.pc?.remoteDescription) return;
  const pending = state.call.pendingIce;
  state.call.pendingIce = [];
  for (const candidate of pending) {
    try {
      await state.call.pc.addIceCandidate(candidate);
    } catch {}
  }
}

function startCallTimers() {
  clearInterval(state.call.timer);
  clearInterval(state.call.stats);
  const updateTimer = () => {
    if (!state.call.startedAt) return;
    const seconds = Math.floor((Date.now() - state.call.startedAt) / 1000);
    ui.callStatus.textContent =
      `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };
  updateTimer();
  updateCallStats();
  state.call.timer = setInterval(updateTimer, 1000);
  state.call.stats = setInterval(updateCallStats, 2500);
}

async function updateCallStats() {
  const pc = state.call.pc;
  if (!pc) return;
  try {
    const stats = await pc.getStats();
    let pair = null;
    let local = null;

    for (const report of stats.values()) {
      if (report.type === "transport" && report.selectedCandidatePairId) {
        pair = stats.get(report.selectedCandidatePairId);
      }
    }
    if (!pair) {
      for (const report of stats.values()) {
        if (report.type === "candidate-pair" && report.nominated && report.state === "succeeded") {
          pair = report;
          break;
        }
      }
    }
    if (pair?.localCandidateId) local = stats.get(pair.localCandidateId);

    const relay = local?.candidateType === "relay";
    const rtt = pair?.currentRoundTripTime
      ? Math.round(pair.currentRoundTripTime * 1000)
      : null;
    ui.callRoute.textContent = rtt
      ? `${relay ? "TURN" : "P2P"} · ${rtt} ms`
      : relay ? "TURN" : "P2P";
  } catch {}
}

function closePeerOnly() {
  if (!state.call.pc) return;
  state.call.pc.ontrack = null;
  state.call.pc.onicecandidate = null;
  state.call.pc.onconnectionstatechange = null;
  state.call.pc.close();
  state.call.pc = null;
}

function finishCall(notify = true) {
  if (notify && state.call.peerId) {
    sendSignal({
      type: "hangup",
      to: state.call.peerId,
      conversationId: state.call.conversationId
    });
  }

  closePeerOnly();
  clearInterval(state.call.timer);
  clearInterval(state.call.stats);

  if (state.call.localStream) {
    for (const track of state.call.localStream.getTracks()) track.stop();
  }
  if (state.call.screenStream) {
    for (const track of state.call.screenStream.getTracks()) track.stop();
  }

  state.call = {
    state: "idle",
    peerId: null,
    conversationId: null,
    video: false,
    pc: null,
    localStream: null,
    screenStream: null,
    pendingIce: [],
    startedAt: 0,
    timer: null,
    stats: null,
    speaker: true
  };

  ui.remoteVideo.srcObject = null;
  ui.remoteVideo.style.visibility = "hidden";
  ui.localVideo.srcObject = null;
  ui.callOverlay.classList.add("hidden");
  ui.incomingActions.classList.add("hidden");
  ui.activeCallControls.classList.add("hidden");
}

function refreshCallButtons() {
  const audio = state.call.localStream?.getAudioTracks()[0];
  const video = state.call.localStream?.getVideoTracks()[0];
  ui.micButton.classList.toggle("off", Boolean(audio && !audio.enabled));
  ui.cameraButton.classList.toggle("off", !video || !video.enabled);
  ui.speakerButton.textContent = state.call.speaker ? "🔊" : "◉";
  ui.speakerButton.title = state.call.speaker ? t("speaker") : t("earpiece");
}

function toggleMic() {
  const track = state.call.localStream?.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  refreshCallButtons();
}

function toggleCamera() {
  const track = state.call.localStream?.getVideoTracks()[0];
  if (!track) return showToast(t("noCamera"));
  track.enabled = !track.enabled;
  ui.localVideoFrame.classList.toggle("hidden", !track.enabled);
  refreshCallButtons();
}

async function toggleScreen() {
  if (!navigator.mediaDevices?.getDisplayMedia) return showToast(t("shareUnsupported"));

  if (state.call.screenStream) {
    await stopScreenShare(true);
    return;
  }

  try {
    state.call.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const track = state.call.screenStream.getVideoTracks()[0];
    const sender = state.call.pc?.getSenders().find(item => item.track?.kind === "video");
    if (sender) await sender.replaceTrack(track);
    ui.localVideo.srcObject = state.call.screenStream;
    ui.screenButton.classList.add("off");
    track.onended = () => stopScreenShare(true);
  } catch {}
}

async function stopScreenShare(restore = false) {
  if (!state.call.screenStream) return;
  for (const track of state.call.screenStream.getTracks()) track.stop();
  state.call.screenStream = null;
  ui.screenButton.classList.remove("off");

  if (restore) {
    const camera = state.call.localStream?.getVideoTracks()[0] || null;
    const sender = state.call.pc?.getSenders().find(item => item.track?.kind === "video");
    if (sender && camera) await sender.replaceTrack(camera);
    ui.localVideo.srcObject = state.call.localStream;
  }
}

async function applyAudioRoute() {
  refreshCallButtons();
  if (window.M0DNative?.setSpeakerphone) {
    window.M0DNative.setSpeakerphone(Boolean(state.call.speaker));
    return;
  }

  if (typeof ui.remoteVideo.setSinkId === "function") {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputs = devices.filter(device => device.kind === "audiooutput");
      if (!outputs.length) return;
      let target = outputs.find(device =>
        state.call.speaker
          ? /speaker|громк|динамік/i.test(device.label)
          : /earpiece|receiver|communications|разговор|розмов/i.test(device.label)
      );
      target ||= outputs.find(device => device.deviceId === (state.call.speaker ? "default" : "communications"));
      target ||= outputs[0];
      await ui.remoteVideo.setSinkId(target.deviceId);
      return;
    } catch {}
  }
}

async function toggleSpeaker() {
  state.call.speaker = !state.call.speaker;
  const hasNative = Boolean(window.M0DNative?.setSpeakerphone);
  const hasSink = typeof ui.remoteVideo.setSinkId === "function";
  if (!hasNative && !hasSink) {
    state.call.speaker = !state.call.speaker;
    showToast(t("outputUnsupported"));
    return;
  }
  await applyAudioRoute();
}

async function logout() {
  try {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {}
  if (state.me) await identityDelete(state.me.id);
  location.reload();
}

function openDrawer() {
  ui.settingsDrawer.classList.remove("hidden");
  ui.drawerBackdrop.classList.remove("hidden");
}

function closeDrawer() {
  ui.settingsDrawer.classList.add("hidden");
  ui.drawerBackdrop.classList.add("hidden");
}

async function enterMessenger() {
  ui.authView.classList.add("hidden");
  ui.appView.classList.remove("hidden");
  ui.meName.textContent = state.me.display_name;
  ui.meEmail.textContent = state.me.email;
  ui.meAvatar.textContent = firstLetter(state.me.display_name);
  if ("Notification" in window && Notification.permission === "granted") {
    ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
    applyTranslations();
  }
  state.roomKeys.clear();
  await loadConversations();
  connectSocket();
  if (state.pendingInvite) await acceptPendingInvite();
}

async function boot() {
  applyTranslations();
  capturePendingInvite();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  let result;
  try {
    result = await api("/api/me");
  } catch (error) {
    ui.authView.classList.remove("hidden");
    if (state.pendingInvite) ui.authError.textContent = t("inviteAfterAuth");
    return;
  }

  state.me = result.user;
  state.privateKey = await identityGet(state.me.id).catch(() => null);

  if (!state.privateKey) {
    await api("/api/auth/logout", { method: "POST", body: "{}" }).catch(() => {});
    state.me = null;
    ui.authView.classList.remove("hidden");
    ui.authError.textContent = t("cryptoError");
    return;
  }

  await enterMessenger();
}

ui.loginTab.addEventListener("click", () => setAuthMode("login"));
ui.registerTab.addEventListener("click", () => setAuthMode("register"));
ui.authForm.addEventListener("submit", submitAuth);

document.querySelectorAll(".language-button").forEach(button => {
  button.addEventListener("click", async () => {
    setLanguage(button.dataset.lang);
    updateChatHeader();
    await renderConversationList();
  });
});

ui.newChatButton.addEventListener("click", () => {
  ui.newChatError.textContent = "";
  ui.inviteResult.classList.add("hidden");
  ui.inviteLinkInput.value = "";
  ui.groupTitleInput.value = "";
  ui.descriptionInput.value = "";
  syncNewChatMode();
  ui.newChatModal.classList.remove("hidden");
  setTimeout(() => ui.inviteKindInput.focus(), 50);
});
ui.closeNewChatButton.addEventListener("click", () => ui.newChatModal.classList.add("hidden"));
ui.inviteKindInput.addEventListener("change", syncNewChatMode);
ui.copyInviteButton.addEventListener("click", async () => {
  if (!ui.inviteLinkInput.value) return;
  await navigator.clipboard.writeText(ui.inviteLinkInput.value);
  showToast(t("linkCopied"));
});
ui.createChatButton.addEventListener("click", createInvite);
ui.newChatModal.addEventListener("click", event => {
  if (event.target === ui.newChatModal) ui.newChatModal.classList.add("hidden");
});

ui.menuButton.addEventListener("click", openDrawer);
ui.closeDrawerButton.addEventListener("click", closeDrawer);
ui.drawerBackdrop.addEventListener("click", closeDrawer);
ui.enableNotificationsButton.addEventListener("click", () => requestBrowserNotifications().catch(() => {}));
ui.logoutButton.addEventListener("click", logout);

ui.muteConversationButton.addEventListener("click", () => toggleConversationNotifications().catch(() => showToast(t("serverError"))));
ui.toggleCommentsButton.addEventListener("click", () => toggleChannelComments().catch(() => showToast(t("serverError"))));

ui.chatSearch.addEventListener("input", renderConversationList);
ui.backButton.addEventListener("click", () => ui.appView.classList.remove("chat-open"));
ui.chatInfoButton.addEventListener("click", () => openChatInfo().catch(() => showToast(t("serverError"))));
ui.closeChatInfoButton.addEventListener("click", () => ui.chatInfoModal.classList.add("hidden"));
ui.chatInfoModal.addEventListener("click", event => {
  if (event.target === ui.chatInfoModal) ui.chatInfoModal.classList.add("hidden");
});
ui.shareInviteButton.addEventListener("click", () => shareCurrentConversation().catch(() => showToast(t("serverError"))));
ui.copyInfoInviteButton.addEventListener("click", async () => {
  if (!ui.infoInviteLink.value) return;
  await navigator.clipboard.writeText(ui.infoInviteLink.value);
  showToast(t("linkCopied"));
});
ui.editConversationButton.addEventListener("click", () => editCurrentConversation().catch(() => showToast(t("serverError"))));
ui.leaveConversationButton.addEventListener("click", () => leaveCurrentConversation().catch(() => showToast(t("serverError"))));

ui.cancelComposerContext.addEventListener("click", () => {
  clearComposerContext();
  ui.messageInput.value = "";
  autosizeComposer();
});

ui.closeThreadButton.addEventListener("click", () => {
  ui.threadModal.classList.add("hidden");
  state.threadRoot = null;
  state.threadReplyTo = null;
  state.threadEditingMessage = null;
});
ui.threadModal.addEventListener("click", event => {
  if (event.target === ui.threadModal) ui.closeThreadButton.click();
});
ui.threadSendButton.addEventListener("click", () => sendThreadComment().catch(() => showToast(t("serverError"))));
ui.threadInput.addEventListener("input", () => pulseTyping(state.threadRoot?.id || null));
ui.threadInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendThreadComment().catch(() => showToast(t("serverError")));
  }
});

ui.messageInput.addEventListener("input", () => {
  autosizeComposer();
  pulseTyping();
});
ui.messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendText().catch(() => showToast(t("serverError")));
  }
});
ui.sendButton.addEventListener("click", () => sendText().catch(() => showToast(t("serverError"))));
ui.attachButton.addEventListener("click", () => ui.fileInput.click());
ui.fileInput.addEventListener("change", async () => {
  const file = ui.fileInput.files?.[0];
  ui.fileInput.value = "";
  if (file) await sendFile(file).catch(() => showToast(t("serverError")));
});

ui.audioCallButton.addEventListener("click", () => startCall(false));
ui.videoCallButton.addEventListener("click", () => startCall(true));
ui.acceptCallButton.addEventListener("click", acceptIncomingCall);
ui.declineCallButton.addEventListener("click", declineIncomingCall);
ui.endCallButton.addEventListener("click", () => finishCall(true));
ui.micButton.addEventListener("click", toggleMic);
ui.cameraButton.addEventListener("click", toggleCamera);
ui.screenButton.addEventListener("click", toggleScreen);
ui.speakerButton.addEventListener("click", toggleSpeaker);
ui.minimizeCallButton.addEventListener("click", () => ui.callOverlay.classList.add("hidden"));

window.addEventListener("beforeunload", () => {
  if (state.call.state !== "idle" && state.call.peerId) {
    sendSignal({
      type: "hangup",
      to: state.call.peerId,
      conversationId: state.call.conversationId
    });
  }
});

setAuthMode("login");
boot().catch(() => {
  ui.authView.classList.remove("hidden");
  ui.authError.textContent = t("serverError");
});
