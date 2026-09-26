"""Browser regression tests for delivery races. No real accounts or network writes.

Run: python tests/delivery_browser.py [project-root] [--baseline]
Requires Python Playwright and Microsoft Edge (or PLAYWRIGHT_CHANNEL).
"""
import json
import os
from pathlib import Path
import re
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
HTML = re.sub(r'<script\b[^>]*>.*?</script>', '', (ROOT / 'apps/web/index.html').read_text(encoding='utf-8-sig'), flags=re.S)
SOURCE = (ROOT / 'apps/web/app.js').read_text(encoding='utf-8-sig')
SOURCE = re.sub(r'^import .*?;\s*', '', SOURCE, flags=re.M | re.S)
SOURCE = SOURCE[:SOURCE.rfind('boot().catch(')]
PRELUDE = r'''
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const t = key => key, applyTranslations = () => {}, getLanguage = () => "en", setLanguage = () => {};
async function decryptJson(key, data) { await delay(data.iv === "slow" ? 90 : 8); return {text:data.ciphertext}; }
async function encryptJson(key, data) { await delay(20); return {ciphertext:data.text,iv:"test-iv"}; }
class TestSocket extends EventTarget {
  static OPEN = 1;
  readyState = 1;
  send() {}
  close() { this.readyState = 3; this.dispatchEvent(new Event("close")); }
}
window.WebSocket = TestSocket;
'''
HARNESS = r'''
let history = [];
const calls = [];
const conversation = id => ({id,kind:"direct",members:[{id:"me",displayName:"Me"},{id:"peer",displayName:"Peer"}],last_read_message_id:0});
const message = (id, room="room-a", more={}) => ({id:String(id),conversation_id:room,sender_id:"peer",iv:"iv",ciphertext:"Message "+id,created_at:"2026-09-24T08:00:00Z",...more});
state.me = {id:"me"};
state.conversations = [conversation("room-a"),conversation("room-b")];
state.activeConversation = state.conversations[0];
state.roomKeys.set("room-a",{}); state.roomKeys.set("room-b",{});
ui.appView.classList.remove("hidden"); ui.appView.classList.add("chat-open"); ui.activeChat.classList.remove("hidden");
api = async (url, options={}) => {
  calls.push({url,method:options.method || "GET",body:options.body ? JSON.parse(options.body) : null});
  await delay(5);
  if (url === "/api/conversations") return {conversations:state.conversations};
  if (options.method === "POST" && url.endsWith("/messages")) {
    const body=JSON.parse(options.body);
    return {message:message(100,"room-a",{...body,sender_id:"me",thread_root_id:body.threadRootId || null})};
  }
  if (url.endsWith("/read")) return {ok:true};
  return {messages:history};
};
globalThis.h = {state,ui,calls,message,delay,loadMessages,loadConversations,appendMessage,sendText,openConversation,connectSocket,loadThreadMessages,sendThreadComment,markConversationRead,
  history: value => history=value, setApi: value => api=value,
  rows: () => [...ui.messageList.children].map(row => row.dataset.messageId),
  emit: payload => state.ws.dispatchEvent(new MessageEvent("message",{data:JSON.stringify(payload)}))};
'''

TESTS = [
    ('invite waits for superseding conversation refresh', r'''async () => {
      let n=0;h.setApi(async ()=>{const first=++n===1;await h.delay(first?15:80);
        return {conversations:first?[]:[{id:"room-c",kind:"group",title:"New room",members:[]}]};});
      const first=h.loadConversations();await h.delay(1);const second=h.loadConversations();
      await first;const ids=h.state.conversations.map(c=>c.id);await second;return ids;
    }''', ['room-c']),
    ('concurrent history loads produce one row', r'''async () => {
      h.history([h.message(1)]); await Promise.all([h.loadMessages(),h.loadMessages()]);
      return h.rows(); }''', ['1']),
    ('history and websocket overlap produce one row', r'''async () => {
      h.history([h.message(1)]); await Promise.all([h.loadMessages(),h.appendMessage(h.message(1),{})]);
      return h.rows(); }''', ['1']),
    ('double send produces one POST', r'''async () => {
      h.ui.messageInput.value="hello"; await Promise.all([h.sendText(),h.sendText()]);
      return h.calls.filter(c=>c.method==="POST"&&c.url.endsWith("/messages")).length; }''', 1),
    ('out of order decryption preserves message order', r'''async () => {
      await Promise.all([h.appendMessage(h.message(1,"room-a",{iv:"slow"}),{}),h.appendMessage(h.message(2),{})]);
      return h.rows(); }''', ['1','2']),
    ('late history cannot leak into another chat', r'''async () => {
      h.history([h.message(1,"room-a",{iv:"slow"})]); const old=h.loadMessages();
      await h.delay(20); h.history([h.message(2,"room-b")]); await h.openConversation("room-b"); await old;
      return h.rows(); }''', ['2']),
    ('read receipt does not refetch or reacknowledge history', r'''async () => {
      h.history([h.message(1)]); h.connectSocket();
      h.emit({type:"read",conversationId:"room-a",userId:"peer",messageId:"1"});
      await h.delay(160); return h.calls.length; }''', 0),
    ('typing during send preserves new draft', r'''async () => {
      h.ui.messageInput.value="first"; const pending=h.sendText(); await h.delay(5);
      h.ui.messageInput.value="next draft"; await pending; return h.ui.messageInput.value; }''', 'next draft'),
    ('duplicate socket events produce one row', r'''async () => {
      h.connectSocket(); const event={type:"message",message:h.message(1)}; h.emit(event); h.emit(event);
      await h.delay(150); return h.rows(); }''', ['1']),
    ('hidden document does not acknowledge reads', r'''async () => {
      Object.defineProperty(document,"hidden",{configurable:true,get:()=>true});
      await h.markConversationRead(1); await h.delay(20); return h.calls.length; }''', 0),
    ('thread concurrent loads produce one comment', r'''async () => {
      h.state.activeConversation.kind="channel"; h.state.threadRoot=h.message(10);
      h.history([h.message(11,"room-a",{thread_root_id:"10"})]);
      await Promise.all([h.loadThreadMessages(),h.loadThreadMessages()]);
      return [...h.ui.threadMessageList.children].map(row=>row.dataset.messageId); }''', ['11']),
    ('thread reading does not mark channel posts read', r'''async () => {
      h.state.activeConversation.kind="channel"; h.state.threadRoot=h.message(10);
      h.history([h.message(11,"room-a",{thread_root_id:"10"})]); await h.loadThreadMessages();
      await h.delay(20); return h.calls.filter(c=>c.url.endsWith("/read")).length; }''', 0),
    ('lost response retry reuses id and ciphertext', r'''async () => {
      const payloads=[]; h.setApi(async (url,options={}) => {
        if(url==="/api/conversations") return {conversations:h.state.conversations};
        if(url.endsWith("/read"))return {ok:true};
        if(options.method==="POST") {
          const body=JSON.parse(options.body);payloads.push(body);
          if(payloads.length===1)throw new Error("lost response");
          return {message:h.message(99,"room-a",{...body,sender_id:"me"})};
        }return {messages:[]};
      });h.ui.messageInput.value="retry";await h.sendText().catch(()=>{});await h.sendText();
      return payloads.length===2&&!!payloads[0].clientMessageId&&JSON.stringify(payloads[0])===JSON.stringify(payloads[1]); }''', True),
    ('new socket resynchronizes missed messages', r'''async () => {
      h.history([h.message(1)]);h.connectSocket();h.state.ws.dispatchEvent(new Event("open"));
      await h.delay(150);return h.rows(); }''', ['1']),
    ('stale decrypt cannot overwrite a newer message', r'''async () => {
      const old=h.appendMessage(h.message(1,"room-a",{iv:"slow",ciphertext:"old"}),{});
      await h.delay(10);await h.appendMessage(h.message(1,"room-a",{ciphertext:"edited"}),{});await old;
      return [h.rows(),h.ui.messageList.querySelector(".message-text").textContent]; }''', [['1'],'edited']),
]

def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch(channel=os.environ.get('PLAYWRIGHT_CHANNEL','msedge'), headless=True)
        try:
            for title, code, expected in TESTS:
                context = browser.new_context(viewport={"width":1280,"height":800})
                page = context.new_page()
                context.route('https://m0d.test/**', lambda route: route.fulfill(status=200, content_type='text/html', body=HTML if route.request.url=='https://m0d.test/' else ''))
                try:
                    page.goto('https://m0d.test/')
                    page.add_script_tag(content=PRELUDE+SOURCE+HARNESS)
                    actual = page.evaluate(code)
                    assert actual == expected, f'{actual!r} != {expected!r}'
                    print('PASS', title, flush=True)
                except Exception as error:
                    failures.append(title)
                    print('FAIL', title, str(error)[:300], flush=True)
                finally:
                    context.close()
        finally:
            browser.close()
    print(json.dumps({"passed":len(TESTS)-len(failures),"failed":len(failures),"failures":failures}), flush=True)
    if failures and '--baseline' not in sys.argv: sys.exit(1)

if __name__ == '__main__': main()
