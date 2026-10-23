# Headless browser smoke test (needs: pip install playwright && playwright install chromium). Run: python3 tests/smoke.py
import asyncio,json,threading,http.server,socketserver,os,base64
from playwright.async_api import async_playwright
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
srv=socketserver.TCPServer(('127.0.0.1',8766),H);threading.Thread(target=srv.serve_forever,daemon=True).start()
PNG=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
open('/tmp/t.png','wb').write(PNG)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':780})
        errs=[];reqs=[]
        pg.on('pageerror',lambda e:errs.append('PAGEERROR '+str(e)))
        mode={'chat':'ok'}
        async def chat(route):
            body=json.loads(route.request.post_data or '{}');reqs.append(body)
            if mode['chat']=='junk':return await route.fulfill(status=200,content_type='application/json',body=json.dumps({'text':'User Safety: safe\nResponse Safety: safe'}))
            if mode['chat']=='504':return await route.fulfill(status=504,content_type='application/json',body='{"error":"timed out"}')
            await route.fulfill(status=200,content_type='application/json',body=json.dumps({'text':'[happy]yo. [excited]nice. [link:Example|https://example.com] [mem:user likes pizza]','sources':[{'title':'Src','url':'https://a.com'}]}))
        async def music(route):
            if 'meta=' in route.request.url:return await route.fulfill(json={'title':'My List'})
            await route.fulfill(json={'title':'Aria Math','artist':'C418','cover':'https://example.com/c.jpg','preview':'https://example.com/a.mp3','link':'https://x'})
        await pg.route('**/api/chat*',chat);await pg.route('**/api/music*',music)
        await pg.route('**/*youtube.com/**',lambda r:r.abort());await pg.route('**/*spotify.com/**',lambda r:r.abort())
        await pg.goto('http://127.0.0.1:8766/index.html');await pg.wait_for_timeout(500);await pg.click('#wake');await pg.wait_for_timeout(800)
        async def say(t,w=2500):
            await pg.fill('#txt',t);await pg.press('#txt','Enter');await pg.wait_for_timeout(w)
        await say('hello there')
        print('chips:',await pg.eval_on_selector_all('.src a','e=>e.map(x=>x.textContent)'),'| mem:',await pg.evaluate('Z.mem.facts.map(f=>f.t)'))
        mode['chat']='junk';await say('hi again');print('junk note:','AI brain offline' in await pg.inner_text('#log'))
        mode['chat']='504';await say('another');mode['chat']='ok'
        await pg.set_input_files('input[type=file]','/tmp/t.png');await pg.wait_for_timeout(500);print('picbar thumb:',await pg.locator('#picbar img').count())
        await pg.fill('#txt','what is this');await pg.press('#txt','Enter');await pg.wait_for_timeout(2500)
        print('image sent:',any(r.get('image') for r in reqs),'len',[len((r.get('image') or {}).get('data','')) for r in reqs if r.get('image')])
        await say('play aria math c418',3500)
        print('card:',await pg.locator('.mc').count(),'dock on:',await pg.evaluate("document.getElementById('dock').classList.contains('on')"),'lyr:',await pg.evaluate("getComputedStyle(document.getElementById('lyr')).display"))
        await say('https://www.youtube.com/playlist?list=PLabc123',4000)
        print('yt hang? thinking text:',await pg.inner_text('#bubble'),'| lists:',await pg.evaluate('Z.lists.length'),'| mode:',await pg.evaluate('MP.mode'))
        await pg.evaluate("document.getElementById('dkv').dispatchEvent(new WheelEvent('wheel',{deltaY:-100}))");print('vol',await pg.evaluate('MP.vol'))
        print('\n'.join(errs) or 'NO PAGE ERRORS')
        await pg.screenshot(path='shot.png');await b.close()
asyncio.run(main())
