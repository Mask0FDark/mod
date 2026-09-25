"""Layout regression with real CSS and deterministic API data; no server writes."""
import json,sys,re
from pathlib import Path
from playwright.sync_api import sync_playwright
import delivery_browser as d
ROOT=Path(sys.argv[1]); OUT=ROOT/'review';OUT.mkdir(exist_ok=True)
errors=[];results=[]
with sync_playwright() as p:
  browser=p.chromium.launch(channel='msedge',headless=True)
  for width,height,native in [(1280,850,False),(390,844,False),(390,844,True),(432,960,True)]:
    c=browser.new_context(viewport={'width':width,'height':height})
    page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
    def route(r):
      name=r.request.url.split('https://m0d.test/')[-1].split('?')[0]
      if not name:return r.fulfill(content_type='text/html',body=d.HTML)
      path=ROOT/'apps/web'/name
      r.fulfill(content_type='text/css' if name.endswith('.css') else 'image/svg+xml',body=path.read_bytes() if path.is_file() else b'')
    c.route('https://m0d.test/**',route);page.goto('https://m0d.test/')
    page.add_script_tag(content=d.PRELUDE+d.SOURCE+d.HARNESS)
    if native:page.evaluate("document.documentElement.classList.add('native-app')")
    page.evaluate('''async()=>{
      h.state.me={id:'me',display_name:'Макс',username:'mask0fdark'};
      h.state.conversations=[{...h.state.conversations[0],public_id:101,members:[{id:'me',displayName:'Макс'},{id:'peer',displayName:'Анастасия',username:'anastasia'}],last_ciphertext:'Увидимся вечером 💜',last_iv:'iv',last_message_at:'2026-09-25T08:10:00Z',unread_count:3},
      {id:'group',public_id:102,kind:'group',title:'Команда M0D',members:[],last_ciphertext:'Макс: обновление готово',last_iv:'iv',last_message_at:'2026-09-25T07:55:00Z',notifications_enabled:false},
      {id:'channel',public_id:103,kind:'channel',title:'M0D · Новости',members:[],last_ciphertext:'Новые возможности мессенджера',last_iv:'iv',last_message_at:'2026-09-24T18:00:00Z'}];
      h.state.roomKeys.set('group',{});h.state.roomKeys.set('channel',{});
      h.ui.appView.classList.remove('chat-open');h.state.activeConversation=null;await renderConversationList();syncMe();
    }''')
    page.wait_for_timeout(80)
    box=page.locator('#chatList').bounding_box();assert box['height']>300,(width,native,box)
    assert page.locator('#chatList .chat-row').count()==3
    assert page.locator('#chatList').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
    assert page.locator('#appView').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
    page.screenshot(path=str(OUT/f'list-{width}-{native}.png'))
    for kind,count in [('group',1),('direct',1),('channel',1),('all',3)]:
      page.locator(f'[data-filter="{kind}"]').click();assert page.locator('#chatList .chat-row').count()==count
    page.locator('#chatSearch').fill('Анастасия');assert page.locator('#chatList .chat-row').count()==1
    page.locator('#chatSearch').fill('');assert page.locator('#chatList .chat-row').count()==3
    page.evaluate('''async()=>{await h.openConversation('room-a',{syncUrl:false});await h.appendMessage(h.message(1,'room-a',{ciphertext:'Привет! Как прошёл день?',created_at:'2026-09-24T18:00:00Z'}),{});await h.appendMessage(h.message(2,'room-a',{sender_id:'me',ciphertext:'Хорошо. Давай созвонимся вечером 💜',created_at:'2026-09-25T08:00:00Z'}),{});}''')
    assert page.locator('[data-date-label]').count()==2
    assert page.locator('#messageList').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
    comp=page.locator('.composer').bounding_box();header=page.locator('.chat-header').bounding_box()
    assert comp['y']+comp['height']<=height+1 and header['y']>=0,(comp,header)
    if width<760:assert not page.locator('#mobileBottomNav').is_visible()
    page.screenshot(path=str(OUT/f'chat-{width}-{native}.png'))
    page.evaluate("openProfile()")
    profile=page.locator('.profile-card').bounding_box()
    if width<760:assert abs(profile['width']-width)<2 and profile['x']==0
    page.screenshot(path=str(OUT/f'profile-{width}-{native}.png'))
    page.locator('.profile-close').click()
    page.evaluate("openMobileSettings()")
    assert page.locator('#settingsDrawer').is_visible()
    page.screenshot(path=str(OUT/f'settings-{width}-{native}.png'))
    results.append({'width':width,'height':height,'native':native,'listHeight':box['height']})
    c.close()
  browser.close()
assert not errors,errors
print(json.dumps({'passed':results,'browserErrors':errors}))
