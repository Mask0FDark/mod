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
  mobileSearchButton: $("mobileSearchButton"),
  mobileChatFilters: $("mobileChatFilters"),
  mobileBottomNav: $("mobileBottomNav"),
  mobileProfileTab: $("mobileProfileTab"),
  mobileCallsTab: $("mobileCallsTab"),
  mobileChatsTab: $("mobileChatsTab"),
  mobileSettingsTab: $("mobileSettingsTab"),
  mobileCallsView: $("mobileCallsView"),
  mobileCallsList: $("mobileCallsList"),
  closeMobileCallsButton: $("closeMobileCallsButton"),
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
  pendingNativeConversation: null,
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
  messageView: { epoch: 0, request: 0, writes: new Map() },
  threadView: { epoch: 0, request: 0, writes: new Map() },
  conversationRequest: 0,
  conversationLoad: null,
  routeRequest: 0,
  userSearchRequest: 0,
  mobileChatFilter: "all",
  readRequests: new Map(),
  sendingText: false,
  sendingThread: false,
  pendingSends: new Map(),
  drafts: new Map(),
  reconnectTimer: null,
  seenMessages: new Set(),
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
  if (conversation.last_system_event) return callText(conversation.last_system_event);
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
  const request = ++state.userSearchRequest;
  const list = state.conversations.filter(c => {
    const matchesQuery = (conversationName(c)+" "+c.members.map(m=>m.username?"@"+m.username:"").join(" ")).toLowerCase().includes(query);
    const filter = ["all", "direct", "group", "channel"].includes(state.mobileChatFilter) ? state.mobileChatFilter : "all";
    const matchesFilter = filter === "all" || c.kind === filter;
    return matchesQuery && matchesFilter;
  });
  const scrollTop = ui.chatList.scrollTop;
  ui.chatList.replaceChildren();

  for (const conversation of list) {
    const row = document.createElement("button");
    row.className = "chat-row" + (state.activeConversation?.id === conversation.id ? " active" : "");
    row.type = "button";
    row.dataset.conversationId = conversation.id;
    row.setAttribute("aria-current", String(state.activeConversation?.id === conversation.id));

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    paintAvatar(avatar,directPeer(conversation),conversationName(conversation));

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
    if (conversation.notifications_enabled === false) {
      const mute = document.createElement("span"); mute.className = "chat-muted"; mute.textContent = "◌"; mute.title = t("mute"); main.querySelector(".chat-row-top").append(mute);
    }
    if (conversation.pinned_count > 0) {
      const pin = document.createElement("span"); pin.className = "chat-pinned"; pin.textContent = "⌖"; pin.title = t("pinnedMessages"); main.querySelector(".chat-row-bottom").append(pin);
    }
    row.append(avatar, main);
    row.addEventListener("click", () => openConversation(conversation.id));
    ui.chatList.appendChild(row);

    previewFor(conversation).then(text => {
      const preview = main.querySelector(".chat-preview");
      if (preview) preview.textContent = text;
    });
  }

  ui.chatList.scrollTop = scrollTop;
  let globalResult = false;
  const usernameMatch = query.match(/^@([a-z][a-z0-9_]{3,31})$/);
  const directAlreadyShown = usernameMatch && list.some(c =>
    c.kind === "direct" && directPeer(c)?.username?.toLowerCase() === usernameMatch[1]
  );
  if (usernameMatch && !directAlreadyShown) {
    try {
      const info = await api(`/api/users/by-username/${encodeURIComponent(usernameMatch[1])}`);
      if (request !== state.userSearchRequest || ui.chatSearch.value.trim().toLowerCase() !== query) return;
      const user = info.user;
      const row = document.createElement("button");
      row.className = "chat-row global-user-result";
      row.type = "button";
      const avatar = document.createElement("div");
      avatar.className = "avatar";
      paintAvatar(avatar,user,user.display_name);
      const main = document.createElement("div");
      main.className = "chat-row-main";
      const top = document.createElement("div");
      top.className = "chat-row-top";
      const name = document.createElement("span");
      name.className = "chat-row-name";
      name.textContent = user.id === state.me.id ? `${user.display_name} · ${t("you")}` : user.display_name;
      const preview = document.createElement("div");
      preview.className = "chat-preview";
      preview.textContent = "@"+user.username;
      top.append(name);
      main.append(top,preview);
      row.append(avatar,main);
      row.addEventListener("click",()=>{ location.hash="@"+user.username; });
      ui.chatList.appendChild(row);
      globalResult = true;
    } catch (error) {
      if (request !== state.userSearchRequest) return;
      if (error?.status !== 404 && error?.status !== 400) throw error;
    }
  }

  if (!list.length && !globalResult && request === state.userSearchRequest) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.innerHTML = `<div><strong>${t("noChats")}</strong><p>${t("noChatsHint")}</p></div>`;
    ui.chatList.appendChild(empty);
  }
}

function loadConversations() {
  const request = ++state.conversationRequest;
  const pending = refreshConversations(request);
  state.conversationLoad = pending;
  return pending;
}

async function refreshConversations(request) {
  const result = await api("/api/conversations");
  if (!state.me) return;
  // A caller that needs the list (e.g. accepting an invite) must wait until
  // the newer refresh is applied, not continue with an out-of-date list.
  if (request !== state.conversationRequest) return state.conversationLoad;
  const previous = new Map(state.conversations.map(c => [c.id, c]));
  if (!Array.isArray(result.conversations)) throw new Error("invalid_conversations_response");
  state.conversations = result.conversations;
  for (const conversation of state.conversations) {
    // A list request may have started before a read acknowledgement arrived.
    const old = previous.get(conversation.id);
    conversation.last_read_message_id = Math.max(Number(conversation.last_read_message_id || 0), Number(old?.last_read_message_id || 0));
    for (const member of conversation.members) {
      const known = old?.members?.find(m => m.id === member.id);
      member.lastReadMessageId = Math.max(Number(member.lastReadMessageId || 0), Number(known?.lastReadMessageId || 0));
    }
  }
  if (state.activeConversation) {
    const refreshed = state.conversations.find(c => c.id === state.activeConversation.id);
    if (refreshed) state.activeConversation = refreshed;
  }
  await renderConversationList();
  updateChatHeader();
  await refreshPinnedMessage();
}

function updateChatHeader() {
  const conversation = state.activeConversation;
  if (!conversation) return;
  const name = conversationName(conversation);
  paintAvatar(ui.chatAvatar,directPeer(state.activeConversation),name);
  ui.chatTitle.textContent = name;
  const peer = directPeer(conversation);
  const status = conversationStatus(conversation);
  ui.chatStatus.textContent = peer?.username ? `@${peer.username} · ${status}` : status;
  ui.chatStatus.classList.toggle("online", Boolean(peer && state.online.has(peer.id)));
  const canCall = conversation.kind === "direct";
  ui.audioCallButton.classList.toggle("hidden", !canCall);
  ui.videoCallButton.classList.toggle("hidden", !canCall);

  const readOnly = conversation.kind === "channel" && !canPostToConversation(conversation);
  ui.readOnlyHint.classList.toggle("hidden", !readOnly);
  ui.messageInput.classList.toggle("hidden", readOnly);
  ui.attachButton.classList.toggle("hidden", readOnly);
  ui.sendButton.classList.toggle("hidden", readOnly);
  $("emojiButton")?.classList.toggle("hidden", readOnly);
  $("voiceMessageButton")?.classList.toggle("hidden", readOnly);
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
  const id = Number(messageId);
  if (!conversation || !Number.isSafeInteger(id) || id < 1 || document.hidden) return;
  if (ui.activeChat.classList.contains("hidden")) return;
  if (matchMedia("(max-width: 760px)").matches && !ui.appView.classList.contains("chat-open")) return;
  const pending = state.readRequests.get(conversation.id) || 0;
  if (id <= Math.max(Number(conversation.last_read_message_id || 0), pending)) return;
  state.readRequests.set(conversation.id, id);
  try {
    await api(`/api/conversations/${conversation.id}/read`, {
      method: "POST", body: JSON.stringify({ messageId: id })
    });
    const current = state.conversations.find(c => c.id === conversation.id) || conversation;
    current.last_read_message_id = Math.max(Number(current.last_read_message_id || 0), id);
    // Do not erase an unread message that arrived during this request.
    if (id >= Number(current.last_message_id || 0)) current.unread_count = 0;
    await renderConversationList();
  } catch {
    // Leave the cursor unchanged so visibility/scroll/reconnect can retry it.
  } finally {
    if (state.readRequests.get(conversation.id) === id) state.readRequests.delete(conversation.id);
  }
}

function resetMessageView(host, view) {
  view.epoch += 1;
  view.request += 1;
  view.writes.clear();
  host.replaceChildren();
}

function nearMessageBottom(host) {
  return host.scrollHeight - host.scrollTop - host.clientHeight < 90;
}

function markVisibleMessagesRead() {
  if (nearMessageBottom(ui.messageList)) {
    const last = ui.messageList.lastElementChild?.dataset.messageId;
    if (last) markConversationRead(last);
  }
}

function updateReadReceipts() {
  const conversation = state.activeConversation;
  if (conversation?.kind !== "direct") return;
  const readThrough = Number(directPeer(conversation)?.lastReadMessageId || 0);
  for (const row of ui.messageList.querySelectorAll(".message-row.out")) {
    const receipt = row.querySelector(".message-receipt");
    if (receipt) receipt.textContent = Number(row.dataset.messageId) <= readThrough ? " ✓✓" : " ✓";
  }
}

async function openConversation(id, { syncUrl = true } = {}) {
  const conversation = state.conversations.find(c => c.id === id);
  if (!conversation) return;
  if (state.activeConversation) {
    state.drafts.set(state.activeConversation.id, { text: ui.messageInput.value, reply: state.replyTo, editing: state.editingMessage });
  }
  cancelVoiceRecording();
  $("pinnedMessageBar")?.classList.add("hidden");
  resetMessageView(ui.messageList, state.messageView);
  resetMessageView(ui.threadMessageList, state.threadView);
  state.messageCache.clear();
  ui.threadModal.classList.add("hidden");
  ui.messageInput.value = "";
  clearTimeout(state.remoteTypingTimer);
  state.activeConversation = conversation;
  closeMobileCalls();
  closeDrawer();
  setMobileNavActive(ui.mobileChatsTab);
  clearComposerContext();
  const draft = state.drafts.get(id);
  ui.messageInput.value = draft?.text || "";
  if (draft?.editing) beginEdit(draft.editing, { text: draft.text });
  else if (draft?.reply) beginReply(draft.reply, state.messageCache.get(Number(draft.reply.id))?.body);
  autosizeComposer();
  state.threadRoot = null;
  ui.emptyChat.classList.add("hidden");
  ui.activeChat.classList.remove("hidden");
  ui.chatPane.classList.remove("empty");
  ui.appView.classList.add("chat-open");
  updateChatHeader();
  if (syncUrl) syncConversationUrl(conversation);
  await renderConversationList();
  await loadMessages();
  await refreshPinnedMessage();
}

async function loadMessages() {
  const conversation = state.activeConversation;
  if (!conversation) return;
  const view = state.messageView;
  const epoch = view.epoch;
  const request = ++view.request;
  const writes = new Map(view.writes);
  const current = () => state.activeConversation?.id === conversation.id && view.epoch === epoch && view.request === request;
  const follow = nearMessageBottom(ui.messageList);
  try {
    const roomKey = await unlockConversationKey(conversation);
    const result = await api(`/api/conversations/${conversation.id}/messages?limit=50`);
    if (!current()) return;
    for (const message of result.messages || []) {
      const valid = () => current() && view.writes.get(String(message.id)) === writes.get(String(message.id));
      await appendMessage(message, roomKey, ui.messageList, false, valid);
    }
    if (!current()) return;
    if (follow) {
      ui.messageList.scrollTop = ui.messageList.scrollHeight;
      markVisibleMessagesRead();
    }
  } catch {
    if (current()) showToast(t("serverError"));
  }
}

async function appendMessage(message, roomKey = null, host = ui.messageList, isThread = false, valid = null) {
  const conversation = state.conversations.find(c => c.id === message.conversation_id);
  if (!conversation) return;
  const view = isThread ? state.threadView : state.messageView;
  const epoch = view.epoch;
  const id = String(message.id);
  const revision = valid ? null : (view.writes.get(id) || 0) + 1;
  if (!valid) view.writes.set(id, revision);
  const current = () => state.me && state.activeConversation?.id === conversation.id && view.epoch === epoch
    && (valid ? valid() : view.writes.get(id) === revision)
    && (isThread ? String(state.threadRoot?.id) === String(message.thread_root_id) : !message.thread_root_id);
  if (!current()) return;
  roomKey ||= await unlockConversationKey(conversation);

  let body = { text: "" };
  if (message.system_event) { body = {text:callText(message.system_event)}; }
  else if (!message.deleted_at) {
    try {
      body = await decryptJson(roomKey, { iv: message.iv, ciphertext: message.ciphertext });
    } catch {
      body = { text: "🔒 " + t("encrypted") };
    }
  }
  if (!current()) return;
  state.messageCache.set(Number(message.id), { message, body });

  const row = document.createElement("div");
  const mine = message.sender_id === state.me.id;
  row.className = "message-row " + (mine ? "out" : "in");
  row.dataset.messageId = message.id;
  row.dataset.createdAt = message.created_at;
  row.classList.toggle("channel-post",conversation.kind==="channel"&&!isThread);
  if(message.system_event)row.classList.add("call-message");

  const bubble = document.createElement("div");
  bubble.tabIndex = 0;
  bubble.addEventListener("click", event => {
    if (!event.target.closest("button,a,img,video,audio") && matchMedia("(max-width:760px)").matches) row.classList.toggle("actions-open");
  });
  bubble.addEventListener("keydown", event => { if (event.key === "Escape") row.classList.remove("actions-open"); });
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

  if (!message.deleted_at && !message.system_event) {
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
  meta.textContent = `${message.pinned ? "📌 " : ""}${message.edited_at ? t("edited") + " · " : ""}${shortTime(message.created_at)}`;
  if (receipt) {
    const status = document.createElement("span");
    status.className = "message-receipt";
    status.textContent = receipt;
    meta.appendChild(status);
  }
  bubble.appendChild(meta);

  row.appendChild(bubble);
  // Check after decryption, then commit synchronously. Concurrent history and
  // WebSocket deliveries therefore share one row, even if decryption finishes out of order.
  const existing = host.querySelector(`[data-message-id="${message.id}"]`);
  if (existing) existing.replaceWith(row);
  else {
    const next = Array.from(host.children).find(item => Number(item.dataset.messageId) > Number(message.id));
    host.insertBefore(row, next || null);
  }
  updateDateLabels(host);
}

async function renderAttachment(host, attachment, roomKey) {
  const card=document.createElement("div");card.className="file-card";
  const meta=document.createElement("div");meta.className="file-meta";
  const name=document.createElement("strong");name.textContent=attachment.name||t("file");
  const size=document.createElement("span");size.textContent=readableSize(attachment.size);
  meta.append(name,size);
  const download=document.createElement("button");download.className="file-download";download.textContent=t("download");
  card.append(meta,download);host.append(card);
  let objectUrl=null,loading=null;
  async function load(){
    if(objectUrl)return objectUrl;
    if(loading)return loading;
    loading=(async()=>{
      const response=await fetch(`/api/attachments/${attachment.id}`);
      if(!response.ok)throw new Error("attachment_download_failed");
      const plaintext=await decryptBytes(roomKey,{iv:attachment.iv,ciphertext:await response.arrayBuffer()});
      objectUrl=URL.createObjectURL(new Blob([plaintext],{type:attachment.mime||"application/octet-stream"}));
      host.dataset.objectUrl=objectUrl;return objectUrl;
    })();
    try{return await loading;}finally{loading=null;}
  }
  download.onclick=async()=>{
    download.disabled=true;
    try{
      const a=document.createElement("a");
      a.href=await load();a.download=attachment.name||"M0D-file";a.style.display="none";
      document.body.append(a);a.click();a.remove();
    }catch{showToast(t("serverError"));}finally{download.disabled=false;}
  };
  if(attachment.kind==="image" && /^image\/(png|jpeg|webp|gif|avif|bmp)$/i.test(attachment.mime||"")){
    const image=document.createElement("img");image.className="message-image";image.alt=attachment.name||t("photo");
    host.prepend(image);image.src=await load();
    image.onclick=()=>{
      const overlay=document.createElement("div");overlay.className="media-viewer";
      const enlarged=document.createElement("img");enlarged.src=objectUrl;enlarged.alt=image.alt;
      const close=document.createElement("button");close.className="round-icon";close.textContent="✕";close.onclick=()=>overlay.remove();
      overlay.append(enlarged,close);overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};document.body.append(overlay);
    };
  }else if(["video","audio"].includes(attachment.kind)){
    const play=document.createElement("button");play.className="media-load";play.textContent="▶ "+(attachment.name||t("file"));
    host.prepend(play);
    play.onclick=async()=>{
      play.disabled=true;
      try{
        const media=document.createElement(attachment.kind);media.controls=true;media.preload="metadata";media.className="message-media";
        if(attachment.kind==="video")media.playsInline=true;
        media.src=await load();play.replaceWith(media);media.play().catch(()=>{});
      }catch{play.disabled=false;showToast(t("serverError"));}
    };
  }
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
  const draft = ui.messageInput.value;
  const text = draft.trim();
  if (state.sendingText || !conversation || !text || !canPostToConversation(conversation)) return;
  const editing = state.editingMessage;
  const reply = state.replyTo;
  state.sendingText = true;
  ui.sendButton.disabled = true;
  try {
    const roomKey = await unlockConversationKey(conversation);
    if (editing) {
      const encrypted = await encryptJson(roomKey, { ...state.messageCache.get(Number(editing.id))?.body, version: 1, text });
      await api(`/api/conversations/${conversation.id}/messages/${editing.id}`, {
        method: "PATCH", body: JSON.stringify(encrypted)
      });
      if (state.activeConversation?.id === conversation.id) await loadMessages();
    } else {
      const result = await postTextMessage(conversation, roomKey, text, reply?.id || null);
      await appendMessage(result.message, roomKey);
    }
    if (state.activeConversation?.id === conversation.id && ui.messageInput.value === draft
        && state.editingMessage === editing && state.replyTo === reply) {
      ui.messageInput.value = "";
      autosizeComposer();
      clearComposerContext();
    }
    const savedDraft = state.drafts.get(conversation.id);
    if (savedDraft?.text === draft && savedDraft.reply === reply && savedDraft.editing === editing) {
      state.drafts.delete(conversation.id);
    }
    if (state.activeConversation?.id === conversation.id) {
      ui.messageList.scrollTop = ui.messageList.scrollHeight;
      markVisibleMessagesRead();
    }
    await loadConversations();
  } finally {
    state.sendingText = false;
    ui.sendButton.disabled = false;
  }
}

async function postTextMessage(conversation, roomKey, text, replyToId, threadRootId = null) {
  const key = `${conversation.id}:${threadRootId || "main"}`;
  const signature = JSON.stringify([text, replyToId]);
  let pending = state.pendingSends.get(key);
  if (pending?.signature !== signature) {
    pending = {
      signature,
      payload: { ...await encryptJson(roomKey, { version: 1, text }),
        clientMessageId: crypto.randomUUID(), replyToId, threadRootId }
    };
    state.pendingSends.set(key, pending);
  }
  // Keep the same encrypted payload and id if the response is lost and the user retries.
  const result = await api(`/api/conversations/${conversation.id}/messages`, {
    method: "POST", body: JSON.stringify(pending.payload)
  });
  if (state.pendingSends.get(key) === pending) state.pendingSends.delete(key);
  return result;
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

const pendingFiles = new WeakMap();
async function sendFile(file) {
  let pending=pendingFiles.get(file);
  const conversation=pending?.conversation||state.activeConversation;
  if(!conversation||!file||!canPostToConversation(conversation))return;
  if(file.size>50*1024*1024){showToast(bt("tooLarge"));return;}
  ui.attachButton.disabled=true;
  showToast(bt("upload"),6000);
  try{
    if(!pending){
      let prepared=file;try{prepared=await compressImage(file);}catch{}
      const roomKey=await unlockConversationKey(conversation);
      const encrypted=await encryptBytes(roomKey,await prepared.arrayBuffer());
      pending={conversation,roomKey,prepared,encrypted,replyToId:state.replyTo?.id||null,clientMessageId:crypto.randomUUID()};
      pendingFiles.set(file,pending);
    }
    if(!pending.upload){
      pending.upload=await api(`/api/conversations/${conversation.id}/attachments`,{method:"POST",headers:{"Content-Type":"application/octet-stream"},body:pending.encrypted.ciphertext});
    }
    if(!pending.payload){
      const f=pending.prepared;
      const body={version:1,text:"",attachment:{id:pending.upload.id,iv:pending.encrypted.iv,name:f.name,mime:f.type||"application/octet-stream",size:f.size,kind:f.type.startsWith("image/")?"image":f.type.startsWith("video/")?"video":f.type.startsWith("audio/")?"audio":"file"}};
      pending.payload={...await encryptJson(pending.roomKey,body),clientMessageId:pending.clientMessageId,attachmentId:pending.upload.id,replyToId:pending.replyToId};
      pending.encrypted=null;
    }
    const result=await api(`/api/conversations/${conversation.id}/messages`,{method:"POST",body:JSON.stringify(pending.payload)});
    await appendMessage(result.message,pending.roomKey);
    pendingFiles.delete(file);
    await loadConversations();
    if(state.activeConversation?.id===conversation.id){ui.messageList.scrollTop=ui.messageList.scrollHeight;if(state.replyTo?.id===pending.replyToId)clearComposerContext();}
  }finally{ui.attachButton.disabled=!canPostToConversation(state.activeConversation);}
}
function showFileRetry(file,error){
  const toast=document.createElement("div");toast.className="upload-retry";
  const text=document.createElement("span");text.textContent=file.name+" — "+(error.status===413?bt("tooLarge"):t("serverError"));
  const retry=document.createElement("button");retry.textContent=bt("retry");
  retry.onclick=async()=>{retry.disabled=true;try{await sendFile(file);toast.remove();}catch(e){retry.disabled=false;}};
  const close=document.createElement("button");close.textContent="✕";close.onclick=()=>{pendingFiles.delete(file);toast.remove();};
  toast.append(text,retry,close);document.body.append(toast);
}


function parseChatRoute() {
  if (location.pathname.startsWith("/invite/")) return null;
  let raw = "";
  try { raw = decodeURIComponent(location.hash.replace(/^#/, "").trim()); }
  catch { raw = location.hash.replace(/^#/, "").trim(); }
  const username = raw.match(/^@([A-Za-z][A-Za-z0-9_]{3,31})$/);
  if (username) return { type: "username", username: username[1].toLowerCase() };
  const numeric = raw.match(/^-?(\d{1,20})$/);
  if (numeric) return { type: "chat", publicId: numeric[1].replace(/^0+(?=\d)/, "") };
  return null;
}

function conversationHash(conversation) {
  const peer = directPeer(conversation);
  if (conversation.kind === "direct" && peer?.username) return `#@${peer.username}`;
  if (conversation.public_id != null) return `#${conversation.public_id}`;
  return "";
}

function syncConversationUrl(conversation) {
  const hash = conversationHash(conversation);
  if (!hash || location.hash.toLowerCase() === hash.toLowerCase()) return;
  history.pushState({ conversation: String(conversation.public_id || conversation.id) }, "", `/${hash}`);
}

async function openUsernameChat(username, { syncUrl = false } = {}) {
  const normalized = String(username || "").replace(/^@/, "").toLowerCase();
  const known = state.conversations.find(c => c.kind === "direct" && directPeer(c)?.username?.toLowerCase() === normalized);
  if (known) return openConversation(known.id, { syncUrl });
  const info = await api(`/api/users/by-username/${encodeURIComponent(normalized)}`);
  const peer = info.user;
  if (peer.id === state.me.id) { openProfile(); return; }

  const roomKey = await generateRoomKey();
  const context = `direct:${crypto.randomUUID()}`;
  const selfWrapped = await wrapRoomKey(roomKey, state.privateKey, state.me.public_key_jwk, context);
  const peerWrapped = await wrapRoomKey(roomKey, state.privateKey, peer.public_key_jwk, context);
  const created = await api(`/api/direct/by-username/${encodeURIComponent(normalized)}`, {
    method: "POST",
    body: JSON.stringify({
      selfEnvelope: { iv: selfWrapped.iv, ciphertext: JSON.stringify({ context, data: selfWrapped.ciphertext }) },
      peerEnvelope: { iv: peerWrapped.iv, ciphertext: JSON.stringify({ context, data: peerWrapped.ciphertext }) }
    })
  });
  if (!created.existing) state.roomKeys.set(created.conversationId, roomKey);
  await loadConversations();
  return openConversation(created.conversationId, { syncUrl });
}

function closeActiveConversationFromRoute() {
  if (state.activeConversation) {
    state.drafts.set(state.activeConversation.id, { text: ui.messageInput.value, reply: state.replyTo, editing: state.editingMessage });
  }
  state.activeConversation = null;
  cancelVoiceRecording();
  $("pinnedMessageBar")?.classList.add("hidden");
  resetMessageView(ui.messageList, state.messageView);
  resetMessageView(ui.threadMessageList, state.threadView);
  state.messageCache.clear();
  ui.activeChat.classList.add("hidden");
  ui.emptyChat.classList.remove("hidden");
  ui.chatPane.classList.add("empty");
  ui.appView.classList.remove("chat-open");
  renderConversationList();
}

async function handleChatRoute() {
  if (!state.me || state.pendingInvite) return;
  const request = ++state.routeRequest;
  const route = parseChatRoute();
  if (!route) {
    closeActiveConversationFromRoute();
    return;
  }
  try {
    if (route.type === "username") {
      await openUsernameChat(route.username, { syncUrl: false });
      return;
    }
    const conversation = state.conversations.find(c => String(c.public_id) === route.publicId);
    if (request !== state.routeRequest) return;
    if (!conversation) return showToast(bt("chatNotFound"));
    await openConversation(conversation.id, { syncUrl: false });
  } catch (error) {
    if (request !== state.routeRequest) return;
    showToast(error?.status === 404 ? bt("userNotFound") : t("serverError"));
  }
}

let routeScheduled = false;
function scheduleChatRoute() {
  if (routeScheduled) return;
  routeScheduled = true;
  queueMicrotask(() => {
    routeScheduled = false;
    handleChatRoute().catch(() => showToast(t("serverError")));
  });
}

function applyNativeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    let hash = url.hash || "";
    if (url.protocol === "m0d:") {
      const target = decodeURIComponent(url.pathname.replace(/^\//, ""));
      if (url.hostname === "user" && target) hash = "#@" + target.replace(/^@/, "");
      if (url.hostname === "chat" && /^\d+$/.test(target)) hash = "#" + target;
    }
    if (hash && location.hash !== hash) location.hash = hash;
  } catch {}
}

async function initNativeShell() {
  const cap = window.Capacitor;
  if (!cap?.isNativePlatform?.()) return;
  document.documentElement.classList.add("native-app");
  const App = cap.Plugins?.App;
  const StatusBar = cap.Plugins?.StatusBar;
  const LocalNotifications = cap.Plugins?.LocalNotifications;
  const syncViewport = () => {
    const height = Math.round(window.visualViewport?.height || window.innerHeight);
    document.documentElement.style.setProperty("--native-app-height", `${height}px`);
  };
  syncViewport();
  window.visualViewport?.addEventListener("resize", syncViewport);
  window.addEventListener("orientationchange", syncViewport);
  try {
    await StatusBar?.setOverlaysWebView?.({ overlay: false });
    await StatusBar?.setStyle?.({ style: "DARK" });
    await StatusBar?.setBackgroundColor?.({ color: "#0e1621" });
  } catch {}
  if (!App) return;

  await App.addListener?.("appUrlOpen", event => applyNativeUrl(event?.url || ""));
  await LocalNotifications?.addListener?.("localNotificationActionPerformed", event => {
    const conversationId = event?.notification?.extra?.conversationId;
    if (!conversationId) return;
    if (state.me) openConversation(conversationId).catch(() => {});
    else state.pendingNativeConversation = conversationId;
  });
  await App.addListener?.("backButton", () => {
    const viewer = document.querySelector(".media-viewer");
    if (viewer) return viewer.remove();
    const crop = document.querySelector(".avatar-crop-modal");
    if (crop) return crop.querySelector(".crop-cancel")?.click();
    const profile = document.querySelector(".profile-modal");
    if (profile) return profile.querySelector(".profile-close")?.click();
    if (!ui.mobileCallsView?.classList.contains("hidden")) return openMobileChats();
    if (!ui.settingsDrawer.classList.contains("hidden")) return openMobileChats();
    if (ui.sidebar.classList.contains("search-open")) {
      ui.sidebar.classList.remove("search-open");
      ui.chatSearch.blur();
      return;
    }
    if (!ui.chatInfoModal.classList.contains("hidden")) return ui.closeChatInfoButton.click();
    if (!ui.threadModal.classList.contains("hidden")) return ui.closeThreadButton.click();
    if (!ui.newChatModal.classList.contains("hidden")) return ui.closeNewChatButton.click();
    if (!ui.callOverlay.classList.contains("hidden")) return ui.minimizeCallButton.click();
    if (state.activeConversation || ui.appView.classList.contains("chat-open")) return ui.backButton.click();
    App.minimizeApp?.();
  });

  try {
    const launch = await App.getLaunchUrl?.();
    if (launch?.url) applyNativeUrl(launch.url);
  } catch {}
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
  ui.infoSubtitle.textContent = conversation.public_id
    ? `${conversationStatus(conversation)} · ID ${conversation.public_id}`
    : conversationStatus(conversation);
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
    paintAvatar(avatar,member);

    const meta = document.createElement("div");
    meta.className = "member-meta";
    const name = document.createElement("strong");
    name.textContent = member.id === state.me.id
      ? `${member.displayName || member.display_name} · ${t("you")}`
      : (member.displayName || member.display_name);
    const role = document.createElement("span");
    role.textContent = `${member.username ? "@" + member.username + " · " : ""}${roleLabel(member.role)}`;
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
  const local = window.Capacitor?.Plugins?.LocalNotifications;
  if (local) {
    let permission = await local.checkPermissions();
    if (permission.display !== "granted") permission = await local.requestPermissions();
    if (permission.display === "granted") {
      await local.createChannel?.({
        id: "messages",
        name: "Сообщения",
        description: "Сообщения и звонки M0D",
        importance: 5,
        visibility: 1,
        vibration: true
      }).catch(() => {});
      ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
      applyTranslations();
    }
    return;
  }
  if (!("Notification" in window)) return;
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
    applyTranslations();
  }
}

async function showNativeNotification(title, body, conversationId, idSeed = Date.now()) {
  const local = window.Capacitor?.Plugins?.LocalNotifications;
  if (!local || !document.hidden) return false;
  const permission = await local.checkPermissions().catch(() => ({ display: "denied" }));
  if (permission.display !== "granted") return false;
  const id = Math.max(1, Math.abs(Number(idSeed) || Date.now()) % 2147483000);
  await local.schedule({
    notifications: [{
      id,
      title,
      body,
      channelId: "messages",
      smallIcon: "ic_stat_m0d",
      extra: { conversationId }
    }]
  }).catch(() => {});
  return true;
}

function maybeNotifyIncoming(conversation, message) {
  if (!conversation || message.sender_id === state.me.id || conversation.notifications_enabled === false) return;
  if (!document.hidden) return;
  if (window.Capacitor?.Plugins?.LocalNotifications) {
    showNativeNotification(conversationName(conversation), t("newMessageNotification"), conversation.id, message.id).catch(() => {});
    return;
  }
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const notification = new Notification(conversationName(conversation), {
    body: t("newMessageNotification"),
    icon: "/brand-app-icon.svg",
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
  resetMessageView(ui.threadMessageList, state.threadView);
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
  const view = state.threadView;
  const epoch = view.epoch;
  const request = ++view.request;
  const writes = new Map(view.writes);
  const current = () => state.activeConversation?.id === conversation.id && state.threadRoot === root
    && view.epoch === epoch && view.request === request;
  const follow = nearMessageBottom(ui.threadMessageList);
  const roomKey = await unlockConversationKey(conversation);
  const result = await api(`/api/conversations/${conversation.id}/messages?threadRootId=${root.id}&limit=100`);
  if (!current()) return;
  for (const message of result.messages || []) {
    const valid = () => current() && view.writes.get(String(message.id)) === writes.get(String(message.id));
    await appendMessage(message, roomKey, ui.threadMessageList, true, valid);
  }
  // Thread ids must not advance the channel's top-level read cursor.
  if (current() && follow) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
}

async function sendThreadComment() {
  const conversation = state.activeConversation;
  const root = state.threadRoot;
  const draft = ui.threadInput.value;
  const text = draft.trim();
  if (state.sendingThread || !conversation || !root || !text) return;
  const editing = state.threadEditingMessage;
  const reply = state.threadReplyTo;
  state.sendingThread = true;
  ui.threadSendButton.disabled = true;
  try {
    const roomKey = await unlockConversationKey(conversation);
    if (editing) {
      const encrypted = await encryptJson(roomKey, { version: 1, text });
      await api(`/api/conversations/${conversation.id}/messages/${editing.id}`, {
        method: "PATCH", body: JSON.stringify(encrypted)
      });
      if (state.threadRoot === root) await loadThreadMessages();
    } else {
      const result = await postTextMessage(conversation, roomKey, text, reply?.id || null, root.id);
      await appendMessage(result.message, roomKey, ui.threadMessageList, true);
    }
    if (state.threadRoot === root && ui.threadInput.value === draft
        && state.threadEditingMessage === editing && state.threadReplyTo === reply) {
      state.threadEditingMessage = null;
      state.threadReplyTo = null;
      ui.threadInput.value = "";
      ui.threadSubtitle.textContent = state.messageCache.get(Number(root.id))?.body?.text?.slice(0, 100) || `#${root.id}`;
    }
    if (state.threadRoot === root) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
    if (state.activeConversation?.id === conversation.id) await loadMessages();
    await loadConversations();
  } finally {
    state.sendingThread = false;
    ui.threadSendButton.disabled = false;
  }
}

function connectSocket() {
  clearTimeout(state.reconnectTimer);
  if (!state.me) return;
  if (state.ws && state.ws.readyState <= 1) return;
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${protocol}//${location.host}/ws`);
  state.ws = ws;

  ws.addEventListener("open", () => {
    if (state.ws !== ws) return;
    // HTTP acknowledgements cover sends; this covers messages missed while disconnected.
    state.online.clear();
    loadConversations().then(async () => {
      if (state.ws !== ws) return;
      await loadMessages();
      if (state.threadRoot) await loadThreadMessages();
    }).catch(() => showToast(t("serverError")));
  });

  ws.addEventListener("message", async event => {
    if (state.ws !== ws || !state.me) return;
    try {
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
        if (!incoming?.id || state.seenMessages.has(String(incoming.id))) return;
        state.seenMessages.add(String(incoming.id));
        if (state.seenMessages.size > 2000) state.seenMessages.delete(state.seenMessages.values().next().value);
        const sourceConversation = state.conversations.find(c => c.id === incoming.conversation_id);
        maybeNotifyIncoming(sourceConversation, incoming);
        if (state.activeConversation?.id === incoming.conversation_id) {
          const roomKey = await unlockConversationKey(state.activeConversation);
          if (state.activeConversation?.id !== incoming.conversation_id) return;
          if (incoming.thread_root_id) {
            if (String(state.threadRoot?.id) === String(incoming.thread_root_id) && !ui.threadModal.classList.contains("hidden")) {
              const follow = nearMessageBottom(ui.threadMessageList);
              await appendMessage(incoming, roomKey, ui.threadMessageList, true);
              if (follow) ui.threadMessageList.scrollTop = ui.threadMessageList.scrollHeight;
            }
            await loadMessages();
          } else {
            const follow = nearMessageBottom(ui.messageList);
            await appendMessage(incoming, roomKey);
            if (follow) {
              ui.messageList.scrollTop = ui.messageList.scrollHeight;
              markVisibleMessagesRead();
            }
          }
        }
        await loadConversations();
        return;
      }

      if(message.type==="profile-updated"){
        if(message.userId===state.me.id){const me=await api("/api/me");Object.assign(state.me,me.user);syncMe();}
        await loadConversations();updateChatHeader();return;
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
        if (conversation && message.userId === state.me.id) {
          conversation.last_read_message_id = Math.max(Number(conversation.last_read_message_id || 0), Number(message.messageId || 0));
          if (Number(message.messageId) >= Number(conversation.last_message_id || 0)) conversation.unread_count = 0;
          renderConversationList();
        }
        if (state.activeConversation?.id === message.conversationId) updateReadReceipts();
        return;
      }

      if (["message-updated", "message-deleted", "message-reactions", "message-pinned"].includes(message.type)) {
        if (message.type === "message-pinned" || message.type === "message-deleted") refreshPinnedMessage().catch(() => {});
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
    } catch (error) {
      console.error("M0D socket event failed", error);
    }
  });

  ws.addEventListener("close", () => {
    if (state.ws === ws && state.me) state.reconnectTimer = setTimeout(connectSocket, 1600);
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
  if (!["call-request","call-accept","call-decline","call-unavailable","offer","answer","ice","hangup"].includes(message.type)) return;

  if (message.type === "call-unavailable") {
    if (state.call.state !== "idle") {
      showToast(t("offline"));
      finishCall(false);
    }
    return;
  }

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
    showNativeNotification(
      conversationName(conversation),
      message.video ? "Входящий видеозвонок" : "Входящий звонок",
      conversation.id,
      Date.now()
    ).catch(() => {});
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
    if (state.call.pc && state.call.pc.signalingState !== "closed") {
      await state.call.pc.setRemoteDescription(message.sdp);
      await flushPendingIce();
      const answer = await state.call.pc.createAnswer();
      await state.call.pc.setLocalDescription(answer);
      sendSignal({
        type: "answer",
        to: state.call.peerId,
        conversationId: state.call.conversationId,
        sdp: state.call.pc.localDescription
      });
    } else {
      await buildPeer(false, message.sdp);
    }
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
  window.Capacitor?.Plugins?.AudioRoute?.reset?.().catch(() => {});

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
  const muted = Boolean(audio && !audio.enabled);
  ui.micButton.classList.toggle("off", muted);
  ui.micButton.textContent = muted ? "🔇" : "🎙";
  ui.micButton.setAttribute("aria-pressed", String(muted));
  ui.cameraButton.classList.toggle("off", !video || !video.enabled);
  ui.speakerButton.textContent = state.call.speaker ? "🔊" : "◖";
  ui.speakerButton.title = state.call.speaker ? t("speaker") : t("earpiece");
  ui.speakerButton.setAttribute("aria-pressed", String(state.call.speaker));
}

async function toggleMic() {
  const track = state.call.localStream?.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  const native = window.Capacitor?.Plugins?.AudioRoute;
  await native?.setMicrophoneMuted?.({ muted: !track.enabled }).catch(() => {});
  window.Capacitor?.Plugins?.Haptics?.impact?.({ style: "LIGHT" }).catch(() => {});
  refreshCallButtons();
}

async function renegotiateCall() {
  const pc = state.call.pc;
  if (!pc || pc.signalingState === "closed") return;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  sendSignal({
    type: "offer",
    to: state.call.peerId,
    conversationId: state.call.conversationId,
    sdp: pc.localDescription
  });
}

async function toggleCamera() {
  let track = state.call.localStream?.getVideoTracks()[0] || null;

  if (track) {
    track.enabled = !track.enabled;
    state.call.video = track.enabled;
    ui.localVideo.srcObject = state.call.localStream;
    ui.localVideoFrame.classList.toggle("hidden", !track.enabled);
    refreshCallButtons();
    return;
  }

  try {
    const cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
    });
    track = cameraStream.getVideoTracks()[0];
    if (!track) throw new Error("no_camera_track");

    if (!state.call.localStream) state.call.localStream = new MediaStream();
    state.call.localStream.addTrack(track);
    state.call.video = true;

    const pc = state.call.pc;
    if (pc) {
      const sender = pc.getSenders().find(item => item.track?.kind === "video");
      if (sender) await sender.replaceTrack(track);
      else pc.addTrack(track, state.call.localStream);
      await renegotiateCall();
    }

    track.onended = () => {
      if (state.call.localStream?.getVideoTracks().includes(track)) {
        track.enabled = false;
        state.call.video = false;
        ui.localVideoFrame.classList.add("hidden");
        refreshCallButtons();
      }
    };

    ui.localVideo.srcObject = state.call.localStream;
    ui.localVideoFrame.classList.remove("hidden");
    refreshCallButtons();
  } catch {
    showToast(t("noCamera"));
  }
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
  const native = window.Capacitor?.Plugins?.AudioRoute;
  if (native?.setSpeakerphone) {
    await native.setSpeakerphone({ enabled: Boolean(state.call.speaker) }).catch(() => {});
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
  const hasNative = Boolean(window.Capacitor?.Plugins?.AudioRoute?.setSpeakerphone);
  const hasSink = typeof ui.remoteVideo.setSinkId === "function";
  if (!hasNative && !hasSink) {
    state.call.speaker = !state.call.speaker;
    showToast(t("outputUnsupported"));
    return;
  }
  await applyAudioRoute();
}

async function logout() {
  clearTimeout(state.reconnectTimer);
  const socket = state.ws;
  state.ws = null;
  socket?.close();
  try {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {}
  if (state.me) await identityDelete(state.me.id);
  location.reload();
}

function setMobileNavActive(button) {
  [ui.mobileProfileTab,ui.mobileCallsTab,ui.mobileChatsTab,ui.mobileSettingsTab].forEach(item => item?.classList.toggle("active", item === button));
}

function closeMobileCalls() {
  ui.mobileCallsView?.classList.add("hidden");
}

function openMobileChats() {
  closeDrawer();
  closeMobileCalls();
  document.querySelectorAll(".profile-modal").forEach(node => node.remove());
  setMobileNavActive(ui.mobileChatsTab);
  if (ui.appView.classList.contains("chat-open")) ui.backButton.click();
}

async function openMobileCalls() {
  closeDrawer();
  document.querySelectorAll(".profile-modal").forEach(node => node.remove());
  setMobileNavActive(ui.mobileCallsTab);
  ui.mobileCallsView.classList.remove("hidden");
  ui.mobileCallsList.innerHTML = '<div class="mobile-call-empty">Загрузка…</div>';
  try {
    const result = await api("/api/calls");
    ui.mobileCallsList.replaceChildren();
    if (!result.calls?.length) {
      const empty = document.createElement("div");
      empty.className = "mobile-call-empty";
      empty.textContent = "Звонков пока нет";
      ui.mobileCallsList.append(empty);
      return;
    }
    for (const call of result.calls) {
      const row = document.createElement("button");
      row.className = "mobile-call-row";
      row.type = "button";
      const avatar = document.createElement("div");
      avatar.className = "avatar";
      paintAvatar(avatar,{id:call.peer_id,display_name:call.peer_name,avatar_version:call.peer_avatar_version},call.peer_name);
      const main = document.createElement("div");
      main.className = "mobile-call-main";
      const title = document.createElement("strong");
      title.textContent = call.peer_name || call.peer_username || "Пользователь";
      const detail = document.createElement("span");
      const direction = call.direction === "outgoing" ? "Исходящий" : "Входящий";
      const type = call.video ? "видеозвонок" : "звонок";
      const duration = Number(call.duration || 0);
      detail.textContent = `${direction} ${type}${duration ? " · " + Math.floor(duration/60) + ":" + String(duration%60).padStart(2,"0") : ""}`;
      main.append(title,detail);
      const meta = document.createElement("span");
      meta.className = "mobile-call-meta";
      meta.textContent = shortTime(call.created_at);
      row.append(avatar,main,meta);
      row.onclick = () => {
        closeMobileCalls();
        setMobileNavActive(ui.mobileChatsTab);
        openConversation(call.conversation_id).catch(() => {});
      };
      ui.mobileCallsList.append(row);
    }
  } catch {
    ui.mobileCallsList.innerHTML = '<div class="mobile-call-empty">Не удалось загрузить историю звонков</div>';
  }
}

function openMobileSettings() {
  closeMobileCalls();
  document.querySelectorAll(".profile-modal").forEach(node => node.remove());
  setMobileNavActive(ui.mobileSettingsTab);
  openDrawer();
}

function openMobileProfile() {
  closeMobileCalls();
  closeDrawer();
  setMobileNavActive(ui.mobileProfileTab);
  openProfile();
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
  syncMe();
  if ("Notification" in window && Notification.permission === "granted") {
    ui.enableNotificationsButton.dataset.i18n = "notificationsEnabled";
    applyTranslations();
  }
  state.roomKeys.clear();
  await loadConversations();
  connectSocket();
  if (document.documentElement.classList.contains("native-app")) {
    requestBrowserNotifications().catch(() => {});
  }
  if (state.pendingNativeConversation) {
    const conversationId = state.pendingNativeConversation;
    state.pendingNativeConversation = null;
    await openConversation(conversationId).catch(() => {});
  } else if (state.pendingInvite) await acceptPendingInvite();
  else await handleChatRoute();
}

async function boot() {
  applyTranslations();
  capturePendingInvite();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {});
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
    updateShellLabels();
    updateDateLabels(ui.messageList);
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
ui.mobileProfileTab?.addEventListener("click", openMobileProfile);
ui.mobileCallsTab?.addEventListener("click", () => openMobileCalls().catch(() => {}));
ui.mobileChatsTab?.addEventListener("click", openMobileChats);
ui.mobileSettingsTab?.addEventListener("click", openMobileSettings);
ui.closeMobileCallsButton?.addEventListener("click", openMobileChats);
ui.mobileSearchButton?.addEventListener("click", () => {
  ui.sidebar.classList.toggle("search-open");
  if (ui.sidebar.classList.contains("search-open")) setTimeout(() => ui.chatSearch.focus(), 30);
});
ui.closeDrawerButton.addEventListener("click", () => {
  closeDrawer();
  if (document.documentElement.classList.contains("native-app")) setMobileNavActive(ui.mobileChatsTab);
});
ui.drawerBackdrop.addEventListener("click", closeDrawer);
ui.enableNotificationsButton.addEventListener("click", () => requestBrowserNotifications().catch(() => {}));
ui.logoutButton.addEventListener("click", logout);

ui.muteConversationButton.addEventListener("click", () => toggleConversationNotifications().catch(() => showToast(t("serverError"))));
ui.toggleCommentsButton.addEventListener("click", () => toggleChannelComments().catch(() => showToast(t("serverError"))));

ui.mobileChatFilters?.addEventListener("click", event => {
  const button = event.target.closest(".mobile-chat-filter");
  if (!button) return;
  state.mobileChatFilter = button.dataset.filter || "all";
  ui.mobileChatFilters.querySelectorAll(".mobile-chat-filter").forEach(item => item.classList.toggle("active", item === button));
  renderConversationList().catch(() => {});
});
ui.chatSearch.addEventListener("input", renderConversationList);
ui.chatSearch.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const value = ui.chatSearch.value.trim();
  if (/^@[A-Za-z][A-Za-z0-9_]{3,31}$/.test(value)) {
    event.preventDefault();
    location.hash = value;
  } else if (/^-?\d{1,20}$/.test(value)) {
    event.preventDefault();
    location.hash = value;
  }
});
ui.backButton.addEventListener("click", () => {
  if (location.hash && history.state?.conversation) history.back();
  else {
    history.replaceState(null, "", "/");
    scheduleChatRoute();
  }
});
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
  resetMessageView(ui.threadMessageList, state.threadView);
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
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !event.repeat) {
    event.preventDefault();
    sendThreadComment().catch(() => showToast(t("serverError")));
  }
});

ui.messageInput.addEventListener("input", () => {
  autosizeComposer();
  pulseTyping();
});
ui.messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && !event.repeat) {
    event.preventDefault();
    sendText().catch(() => showToast(t("serverError")));
  }
});
ui.sendButton.addEventListener("click", () => sendText().catch(() => showToast(t("serverError"))));
ui.messageList.addEventListener("scroll", markVisibleMessagesRead, { passive: true });
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && state.me) {
    connectSocket();
    markVisibleMessagesRead();
  }
});
window.addEventListener("online", connectSocket);
window.addEventListener("hashchange", scheduleChatRoute);
window.addEventListener("popstate", scheduleChatRoute);
ui.attachButton.addEventListener("click", () => ui.fileInput.click());
ui.fileInput.addEventListener("change", async () => {
  const files = [...(ui.fileInput.files || [])];
  ui.fileInput.value = "";
  for(const file of files){try{await sendFile(file);}catch(e){showFileRetry(file,e);}}
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

const basicsCopy={
 ru:{profile:"Мой профиль",name:"Имя",username:"Юзернейм",hint:"4–32 символа: латинские буквы, цифры и _. Начните с буквы.",photo:"Изменить фото",remove:"Удалить фото",save:"Сохранить",saved:"Профиль сохранён",invalid_profile:"Проверьте имя и юзернейм",username_taken:"Этот юзернейм уже занят",invalid_avatar:"Не удалось прочитать изображение",upload:"Отправка файла…",tooLarge:"Файл больше 50 МБ",retry:"Повторить отправку",audio:"Аудиозвонок",video:"Видеозвонок",ringing:"Вызов",missed:"Без ответа",declined:"Отклонён",ended:"Завершён",connected:"Соединение",open:"Открыть фото",chatNotFound:"Чат с таким ID не найден",userNotFound:"Пользователь не найден"},
 en:{profile:"My profile",name:"Name",username:"Username",hint:"4–32 letters, digits or _. Start with a letter.",photo:"Change photo",remove:"Remove photo",save:"Save",saved:"Profile saved",invalid_profile:"Check name and username",username_taken:"Username is taken",invalid_avatar:"Cannot read image",upload:"Sending file…",tooLarge:"File exceeds 50 MB",retry:"Retry upload",audio:"Voice call",video:"Video call",ringing:"Calling",missed:"No answer",declined:"Declined",ended:"Ended",connected:"Connected",open:"Open photo",chatNotFound:"Chat with this ID was not found",userNotFound:"User not found"},
 uk:{profile:"Мій профіль",name:"Ім’я",username:"Юзернейм",hint:"4–32 символи: латинські літери, цифри та _. Почніть з літери.",photo:"Змінити фото",remove:"Видалити фото",save:"Зберегти",saved:"Профіль збережено",invalid_profile:"Перевірте ім’я та юзернейм",username_taken:"Цей юзернейм вже зайнятий",invalid_avatar:"Не вдалося прочитати зображення",upload:"Надсилання файлу…",tooLarge:"Файл більший за 50 МБ",retry:"Повторити надсилання",audio:"Аудіодзвінок",video:"Відеодзвінок",ringing:"Виклик",missed:"Без відповіді",declined:"Відхилено",ended:"Завершено",connected:"З’єднання",open:"Відкрити фото",chatNotFound:"Чат із таким ID не знайдено",userNotFound:"Користувача не знайдено"}
};
function bt(key){return basicsCopy[getLanguage()]?.[key]||basicsCopy.en[key]||t("serverError");}
function paintAvatar(host,user,label){
  host.replaceChildren(); host.textContent=firstLetter(label||user?.displayName||user?.display_name||"M");
  const version=user?.avatarVersion||user?.avatar_version;
  if(version && user?.id){
    const img=document.createElement("img");img.alt="";img.src=`/api/users/${user.id}/avatar?v=${encodeURIComponent(version)}`;
    img.addEventListener("error",()=>img.remove());host.append(img);
  }
}
function syncMe(){
  ui.meName.textContent=state.me.display_name;
  ui.meEmail.textContent=state.me.username?"@"+state.me.username:bt("profile");
  paintAvatar(ui.meAvatar,state.me);
}
function callText(event){
  const duration=event.duration? ` · ${Math.floor(event.duration/60)}:${String(event.duration%60).padStart(2,"0")}`:"";
  return (event.video?"◉ ":"☎ ")+bt(event.video?"video":"audio")+" · "+bt(event.status)+duration;
}
async function chooseAvatarCrop(file) {
  if (!file || !file.type.startsWith("image/")) throw new Error("invalid_avatar");
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();

    return await new Promise(resolve => {
      const modal = document.createElement("div");
      modal.className = "modal avatar-crop-modal";
      modal.innerHTML = `<div class="avatar-crop-card">
        <header><div><h2>Фото профиля</h2><p>Перетащи фото и выбери масштаб</p></div><button type="button" class="round-icon crop-cancel">✕</button></header>
        <div class="avatar-crop-stage"><img alt=""></div>
        <label class="avatar-zoom"><span>Масштаб</span><input type="range" min="1" max="3" step="0.01" value="1"></label>
        <div class="avatar-crop-actions"><button type="button" class="secondary-button crop-cancel">Отмена</button><button type="button" class="primary-button crop-save">Выбрать</button></div>
      </div>`;
      document.body.append(modal);
      const stage = modal.querySelector(".avatar-crop-stage");
      const preview = stage.querySelector("img");
      const slider = modal.querySelector("input[type=range]");
      preview.src = sourceUrl;
      let zoom = 1, offsetX = 0, offsetY = 0, dragging = false, lastX = 0, lastY = 0;

      const metrics = () => {
        const size = stage.clientWidth;
        const base = Math.max(size / image.naturalWidth, size / image.naturalHeight);
        const scale = base * zoom;
        return { size, scale, width: image.naturalWidth * scale, height: image.naturalHeight * scale };
      };
      const clamp = () => {
        const m = metrics();
        const maxX = Math.max(0, (m.width - m.size) / 2);
        const maxY = Math.max(0, (m.height - m.size) / 2);
        offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
        offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
      };
      const paint = () => {
        clamp();
        const m = metrics();
        preview.style.width = m.width + "px";
        preview.style.height = m.height + "px";
        preview.style.left = (m.size / 2 - m.width / 2 + offsetX) + "px";
        preview.style.top = (m.size / 2 - m.height / 2 + offsetY) + "px";
      };
      const close = value => { modal.remove(); resolve(value); };
      modal.querySelectorAll(".crop-cancel").forEach(button => button.onclick = () => close(null));
      slider.oninput = () => { zoom = Number(slider.value); paint(); };
      stage.onpointerdown = event => {
        dragging = true; lastX = event.clientX; lastY = event.clientY;
        stage.setPointerCapture(event.pointerId);
      };
      stage.onpointermove = event => {
        if (!dragging) return;
        offsetX += event.clientX - lastX; offsetY += event.clientY - lastY;
        lastX = event.clientX; lastY = event.clientY; paint();
      };
      stage.onpointerup = stage.onpointercancel = () => { dragging = false; };
      modal.querySelector(".crop-save").onclick = async () => {
        const m = metrics();
        const left = m.size / 2 - m.width / 2 + offsetX;
        const top = m.size / 2 - m.height / 2 + offsetY;
        const sx = Math.max(0, -left / m.scale);
        const sy = Math.max(0, -top / m.scale);
        const sourceSize = Math.min(image.naturalWidth - sx, image.naturalHeight - sy, m.size / m.scale);
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 512;
        canvas.getContext("2d").drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, 512, 512);
        const blob = await new Promise(done => canvas.toBlob(done, "image/png"));
        close(blob);
      };
      requestAnimationFrame(paint);
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

function openProfile(){
  closeDrawer();
  document.querySelectorAll(".profile-modal").forEach(node=>node.remove());
  const modal=document.createElement("div");modal.className="modal profile-modal";
  const form=document.createElement("form");form.className="modal-card profile-card";
  form.innerHTML=`<header><h2>${bt("profile")}</h2><button type="button" class="round-icon profile-close">✕</button></header><div class="profile-photo-row"><div class="avatar large profile-preview"></div><button type="button" class="secondary-button choose-avatar">${bt("photo")}</button><button type="button" class="round-icon remove-avatar" title="${bt("remove")}">⌫</button></div><input class="avatar-input" type="file" accept="image/*" hidden><label class="field"><span>${bt("name")}</span><input class="profile-name" maxlength="40" required></label><label class="field"><span>${bt("username")}</span><input class="profile-username" maxlength="32" pattern="[a-zA-Z][a-zA-Z0-9_]{3,31}" placeholder="@username" autocomplete="off"></label><p class="profile-hint">${bt("hint")}</p><p class="profile-error" role="status"></p><button class="primary-button profile-save" type="submit">${bt("save")}</button>`;
  modal.append(form);document.body.append(modal);
  form.querySelector(".profile-name").value=state.me.display_name;
  form.querySelector(".profile-username").value=state.me.username||"";
  paintAvatar(form.querySelector(".profile-preview"),state.me);
  let avatar=null,remove=false,previewUrl=null,busy=false;
  const close=()=>{if(busy)return;if(previewUrl)URL.revokeObjectURL(previewUrl);modal.remove();if(document.documentElement.classList.contains("native-app"))setMobileNavActive(ui.mobileChatsTab);};
  form.querySelector(".profile-close").onclick=close;
  modal.onclick=e=>{if(e.target===modal)close();};
  const input=form.querySelector(".avatar-input");
  form.querySelector(".choose-avatar").onclick=()=>input.click();
  form.querySelector(".remove-avatar").onclick=()=>{remove=true;avatar=null;paintAvatar(form.querySelector(".profile-preview"),null,state.me.display_name);};
  input.onchange=async()=>{
    try{
      const file=input.files[0];if(!file)return;
      if(file.size>20*1024*1024)throw new Error("invalid_avatar");
      const cropped=await chooseAvatarCrop(file);
      input.value="";
      if(!cropped)return;
      avatar=cropped;
      remove=false;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(avatar);
      const img=document.createElement("img");img.src=previewUrl;img.alt="";form.querySelector(".profile-preview").replaceChildren(img);
    }catch(e){form.querySelector(".profile-error").textContent=bt("invalid_avatar");}
  };
  form.onsubmit=async e=>{
    e.preventDefault();if(busy)return;busy=true;
    const controls=[...form.querySelectorAll("button,input")];controls.forEach(x=>x.disabled=true);
    try{
      const r=await api("/api/me/profile",{method:"PATCH",body:JSON.stringify({displayName:form.querySelector(".profile-name").value,username:form.querySelector(".profile-username").value})});
      Object.assign(state.me,r.user);
      if(avatar){const a=await api("/api/me/avatar",{method:"PUT",headers:{"Content-Type":"image/png"},body:avatar});state.me.avatar_version=a.avatar_version;}
      else if(remove){await api("/api/me/avatar",{method:"DELETE"});state.me.avatar_version=null;}
      syncMe();await loadConversations();busy=false;close();showToast(bt("saved"));
    }catch(e){form.querySelector(".profile-error").textContent=bt(e.code);}
    finally{busy=false;controls.forEach(x=>x.disabled=false);}
  };
}
ui.meAvatar.setAttribute("role","button");ui.meAvatar.tabIndex=0;ui.meAvatar.title=bt("profile");
ui.meAvatar.addEventListener("click",openProfile);
ui.meAvatar.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")openProfile();});
const profileButton=document.createElement("button");profileButton.className="settings-action";profileButton.textContent=bt("profile");profileButton.onclick=openProfile;
ui.settingsDrawer.querySelector(".drawer-section").prepend(profileButton);

const clearCacheButton=document.createElement("button");
clearCacheButton.className="settings-action";
clearCacheButton.type="button";
clearCacheButton.textContent="Очистить кэш";
clearCacheButton.onclick=async()=>{
  if("caches" in window){
    const keys=await caches.keys();
    await Promise.all(keys.map(key=>caches.delete(key)));
  }
  showToast("Кэш очищен");
};
ui.settingsDrawer.querySelector(".drawer-section").append(clearCacheButton);

const settingsLogoutButton=document.createElement("button");
settingsLogoutButton.className="settings-action settings-danger";
settingsLogoutButton.type="button";
settingsLogoutButton.textContent="Выйти из аккаунта";
settingsLogoutButton.onclick=logout;
ui.settingsDrawer.querySelector(".drawer-section").append(settingsLogoutButton);

const versionNote=document.createElement("div");
versionNote.className="settings-version";
versionNote.textContent="M0D Android · 0.2.0 dev";
ui.settingsDrawer.append(versionNote);

function updateDateLabels(host) {
  let previous = null;
  for (const row of host.querySelectorAll('.message-row')) {
    const date = new Date(row.dataset.createdAt);
    if (!Number.isFinite(date.getTime())) continue;
    const key = date.toDateString();
    if (key !== previous) row.dataset.dateLabel = new Intl.DateTimeFormat(getLanguage(), {day:'numeric',month:'long'}).format(date);
    else delete row.dataset.dateLabel;
    previous = key;
  }
}
let pinnedRequest = 0;
async function refreshPinnedMessage() {
  const bar = $('pinnedMessageBar');
  if (!bar) return;
  const request = ++pinnedRequest;
  const conversation = state.activeConversation;
  bar.classList.add('hidden');
  if (!conversation || !conversation.pinned_count) return;
  try {
    const result = await api(`/api/conversations/${conversation.id}/pins`);
    const pin = result.messages?.[0];
    if (!pin) return;
    const key = await unlockConversationKey(conversation);
    const body = pin.system_event ? {text:callText(pin.system_event)} : await decryptJson(key,pin);
    if (request !== pinnedRequest || conversation.id !== state.activeConversation?.id) return;
    bar.textContent = '⌖ ' + (body.text || body.attachment?.name || t('file'));
    bar.classList.remove('hidden');
    bar.onclick = async () => {
      let row = ui.messageList.querySelector(`[data-message-id="${pin.id}"]`);
      if (!row) { await appendMessage(pin,key); row = ui.messageList.querySelector(`[data-message-id="${pin.id}"]`); }
      row?.scrollIntoView({block:'center',behavior:'smooth'});
    };
  } catch { /* Keep chat usable if pin was concurrently removed. */ }
}
let voiceRecording = null;
function cancelVoiceRecording() {
  const active = voiceRecording; voiceRecording = null;
  if (!active) return;
  active.cancelled = true;
  if (active.recorder.state !== 'inactive') active.recorder.stop();
  active.stream.getTracks().forEach(track => track.stop());
  $('voiceMessageButton')?.classList.remove('recording');
}
async function toggleVoiceMessage() {
  if (voiceRecording) { voiceRecording.recorder.stop(); return; }
  if (!state.activeConversation || !canPostToConversation(state.activeConversation)) return;
  const conversationId = state.activeConversation.id;
  const button = $('voiceMessageButton'); button.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    if (state.activeConversation?.id !== conversationId) { stream.getTracks().forEach(t=>t.stop()); return; }
    const recorder = new MediaRecorder(stream);
    const active = {stream,recorder,conversationId,chunks:[],cancelled:false}; voiceRecording=active;
    recorder.ondataavailable = event => { if(event.data.size) active.chunks.push(event.data); };
    recorder.onstop = async () => {
      clearTimeout(active.timeout); stream.getTracks().forEach(track=>track.stop());
      if (voiceRecording === active) voiceRecording=null;
      button.classList.remove('recording');
      if (active.cancelled || state.activeConversation?.id !== conversationId) return;
      const extension = recorder.mimeType.includes('mp4') ? 'm4a' : 'webm';
      const file=new File(active.chunks,`Voice-${Date.now()}.${extension}`,{type:recorder.mimeType});
      if(file.size) await sendFile(file).catch(error=>showFileRetry(file,error));
    };
    recorder.start();button.classList.add('recording');
    active.timeout=setTimeout(()=>{if(recorder.state==='recording')recorder.stop();},120000);
  } catch { showToast(t('mediaError')); }
  finally {button.disabled=false;}
}
function shellText(key) {
  const copy = {ru:{account:'Аккаунт',storage:'Данные и память',cache:'Очистить кэш приложения',cacheHint:'Переписка и ключи шифрования сохранятся.',logout:'Выйти из аккаунта',all:'Все',direct:'Личные',group:'Группы',channel:'Каналы',chats:'Чаты',calls:'Звонки'},en:{account:'Account',storage:'Data and storage',cache:'Clear app cache',cacheHint:'Messages and encryption keys are kept.',logout:'Log out',all:'All',direct:'Direct',group:'Groups',channel:'Channels',chats:'Chats',calls:'Calls'},uk:{account:'Обліковий запис',storage:'Дані та пам’ять',cache:'Очистити кеш застосунку',cacheHint:'Листування та ключі шифрування збережуться.',logout:'Вийти',all:'Усі',direct:'Особисті',group:'Групи',channel:'Канали',chats:'Чати',calls:'Дзвінки'}};
  return (copy[getLanguage()]||copy.en)[key];
}
function updateShellLabels() {
  for(const node of document.querySelectorAll('[data-shell-text]')) node.textContent=shellText(node.dataset.shellText);
  for(const node of document.querySelectorAll('[data-filter]')) node.textContent=shellText(node.dataset.filter);
  profileButton.textContent=bt('profile');
  clearCacheButton.textContent=shellText('cache');settingsLogoutButton.textContent=shellText('logout');
  const labels=[[ui.mobileProfileTab,bt('profile')],[ui.mobileCallsTab,shellText('calls')],[ui.mobileChatsTab,shellText('chats')],[ui.mobileSettingsTab,t('settings')]];
  for(const [button,label] of labels)if(button?.lastElementChild)button.lastElementChild.textContent=label;
}
function setupMessengerUI() {
  const language=ui.settingsDrawer.querySelector('.drawer-section');
  const section=(key)=>{const node=document.createElement('section');node.className='drawer-section';const title=document.createElement('span');title.dataset.shellText=key;node.append(title);return node;};
  const account=section('account');account.append(profileButton);language.before(account);
  const storage=section('storage');storage.append(clearCacheButton);const hint=document.createElement('p');hint.className='settings-help';hint.dataset.shellText='cacheHint';storage.append(hint);
  ui.settingsDrawer.querySelector('.drawer-note').before(storage);
  versionNote.before(settingsLogoutButton);
  updateShellLabels();
  const icons = {
    menuButton:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    attachButton:'<path d="m8 13 7-7a3 3 0 0 1 4 4l-9 9a5 5 0 0 1-7-7l9-9m-5 13 8-8"/>',
    emojiButton:'<circle cx="12" cy="12" r="9"/><path d="M8 14q4 5 8 0M8 9h.1M16 9h.1"/>',
    voiceMessageButton:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M6 10v2a6 6 0 0 0 12 0v-2M12 18v4M9 22h6"/>',
    sendButton:'<path d="m4 3 17 9-17 9 4-9-4-9ZM8 12h13"/>',
    audioCallButton:'<path d="M5 3h4l2 5-3 2q2 4 6 6l2-3 5 2v4q0 2-3 2C10 20 4 14 3 6q0-3 2-3Z"/>',
    videoCallButton:'<rect x="3" y="6" width="12" height="12" rx="3"/><path d="m15 10 6-4v12l-6-4"/>',
    chatInfoButton:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'
  };
  for(const [id,path] of Object.entries(icons)){const node=$(id);if(node)node.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;}
  $('emojiButton')?.addEventListener('click',()=>{
    const existing=document.querySelector('.emoji-picker');if(existing){existing.remove();return;}
    const picker=document.createElement('div');picker.className='emoji-picker';
    for(const emoji of ['😀','😂','❤️','👍','🔥','😊','🥰','😎','🎉','😢','🤔','🙏']){
      const button=document.createElement('button');button.type='button';button.textContent=emoji;
      button.onclick=()=>{const input=ui.messageInput;input.setRangeText(emoji,input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();picker.remove();};picker.append(button);
    }ui.activeChat.append(picker);
  });
  $('voiceMessageButton')?.addEventListener('click',toggleVoiceMessage);
  window.addEventListener('pagehide',cancelVoiceRecording);
  const sync=()=>{document.documentElement.style.setProperty('--app-height',`${Math.round(window.visualViewport?.height||innerHeight)}px`);};
  sync();window.visualViewport?.addEventListener('resize',sync);window.addEventListener('resize',sync);
}
setupMessengerUI();

initNativeShell().catch(() => {});
boot().catch(() => {
  ui.authView.classList.remove("hidden");
  ui.authError.textContent = t("serverError");
});
