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
  messageList: $("messageList"),
  fileInput: $("fileInput"),
  attachButton: $("attachButton"),
  messageInput: $("messageInput"),
  sendButton: $("sendButton"),
  drawerBackdrop: $("drawerBackdrop"),
  settingsDrawer: $("settingsDrawer"),
  closeDrawerButton: $("closeDrawerButton"),
  newChatModal: $("newChatModal"),
  closeNewChatButton: $("closeNewChatButton"),
  inviteKindInput: $("inviteKindInput"),
  groupTitleLabel: $("groupTitleLabel"),
  groupTitleInput: $("groupTitleInput"),
  inviteResult: $("inviteResult"),
  inviteLinkInput: $("inviteLinkInput"),
  copyInviteButton: $("copyInviteButton"),
  newChatError: $("newChatError"),
  createChatButton: $("createChatButton"),
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
  const other = conversation.members.find(member => member.id !== state.me.id);
  return other?.displayName || other?.display_name || "M0D";
}

function directPeer(conversation) {
  if (!conversation || conversation.kind !== "direct") return null;
  return conversation.members.find(member => member.id !== state.me.id) || null;
}

function conversationStatus(conversation) {
  if (conversation.kind === "group") {
    return `${conversation.members.length} ${t("members")}`;
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
      <div class="chat-preview">🔒 ${t("encrypted")}</div>
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
}

async function openConversation(id) {
  const conversation = state.conversations.find(c => c.id === id);
  if (!conversation) return;
  state.activeConversation = conversation;
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

  try {
    const roomKey = await unlockConversationKey(conversation);
    const result = await api(`/api/conversations/${conversation.id}/messages?limit=50`);
    for (const message of result.messages || []) {
      await appendMessage(message, roomKey);
    }
    requestAnimationFrame(() => {
      ui.messageList.scrollTop = ui.messageList.scrollHeight;
    });
  } catch {
    showToast(t("cryptoError"));
  }
}

async function appendMessage(message, roomKey = null) {
  const conversation = state.conversations.find(c => c.id === message.conversation_id) || state.activeConversation;
  if (!conversation) return;
  roomKey ||= await unlockConversationKey(conversation);

  let body;
  try {
    body = await decryptJson(roomKey, { iv: message.iv, ciphertext: message.ciphertext });
  } catch {
    body = { text: "🔒 " + t("encrypted") };
  }

  const row = document.createElement("div");
  const mine = message.sender_id === state.me.id;
  row.className = "message-row " + (mine ? "out" : "in");

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  if (conversation.kind === "group" && !mine) {
    const member = conversation.members.find(m => m.id === message.sender_id);
    const author = document.createElement("div");
    author.className = "message-author";
    author.textContent = member?.displayName || message.sender_name || "M0D";
    bubble.appendChild(author);
  }

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

  const meta = document.createElement("span");
  meta.className = "message-meta";
  meta.textContent = shortTime(message.created_at);
  bubble.appendChild(meta);

  row.appendChild(bubble);
  ui.messageList.appendChild(row);
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

async function sendText() {
  const conversation = state.activeConversation;
  const text = ui.messageInput.value.trim();
  if (!conversation || !text) return;

  ui.messageInput.value = "";
  autosizeComposer();
  const roomKey = await unlockConversationKey(conversation);
  const encrypted = await encryptJson(roomKey, { version: 1, text });
  await api(`/api/conversations/${conversation.id}/messages`, {
    method: "POST",
    body: JSON.stringify(encrypted)
  });
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
  if (!conversation || !file) return;

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
      attachmentId: upload.id
    })
  });
}

function capturePendingInvite() {
  const match = location.pathname.match(/^\/invite\/([A-Za-z0-9_-]+)\/?$/);
  const fragment = new URLSearchParams(location.hash.replace(/^#/, ""));
  const roomKey = fragment.get("k");
  state.pendingInvite = match && roomKey ? { token: match[1], roomKey } : null;
}

async function createInvite() {
  ui.newChatError.textContent = "";
  ui.inviteResult.classList.add("hidden");
  const kind = ui.inviteKindInput.value === "group" ? "group" : "direct";
  const title = ui.groupTitleInput.value.trim();
  if (kind === "group" && !title) {
    ui.newChatError.textContent = t("groupNameRequired");
    return;
  }

  ui.createChatButton.disabled = true;
  try {
    const roomKey = await generateRoomKey();
    const exported = await exportRoomKey(roomKey);
    const result = await api("/api/invites", {
      method: "POST",
      body: JSON.stringify({ kind, title: kind === "group" ? title : null })
    });
    const link = `${location.origin}/invite/${result.token}#k=${encodeURIComponent(exported)}`;
    ui.inviteLinkInput.value = link;
    ui.inviteResult.classList.remove("hidden");
    ui.createChatButton.dataset.i18n = "createAnotherInvite";
    applyTranslations();
  } catch {
    ui.newChatError.textContent = t("inviteCreateFailed");
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
      if (state.activeConversation?.id === incoming.conversation_id) {
        const roomKey = await unlockConversationKey(state.activeConversation);
        await appendMessage(incoming, roomKey);
        ui.messageList.scrollTop = ui.messageList.scrollHeight;
      }
      await loadConversations();
      return;
    }

    if (message.type === "conversation-created") {
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
  ui.createChatButton.dataset.i18n = "createInvite";
  applyTranslations();
  ui.newChatModal.classList.remove("hidden");
  setTimeout(() => ui.inviteKindInput.focus(), 50);
});
ui.closeNewChatButton.addEventListener("click", () => ui.newChatModal.classList.add("hidden"));
ui.inviteKindInput.addEventListener("change", () => {
  const group = ui.inviteKindInput.value === "group";
  ui.groupTitleLabel.classList.toggle("hidden", !group);
});
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
ui.logoutButton.addEventListener("click", logout);

ui.chatSearch.addEventListener("input", renderConversationList);
ui.backButton.addEventListener("click", () => ui.appView.classList.remove("chat-open"));

ui.messageInput.addEventListener("input", autosizeComposer);
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
