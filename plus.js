/* Arzy+ : wardrobe, home editor, care system, new animations, Claude brain */
const SP='assets/sprites/';let saved={};try{saved=JSON.parse(localStorage.getItem('arzy2')||'{}')}catch(e){}
const Z=Object.assign({outfit:null,wall:8,floor:0,items:[],st:{hap:70,en:70,hun:70},mem:{facts:[]},lists:[],talk:'normal',lang:'taglish'},saved);
let CODE='',BOOT=true;try{CODE=localStorage.getItem('arzy-code')||''}catch(e){}
const saveLocal=()=>{Z.seen=Date.now();try{localStorage.setItem('arzy2',JSON.stringify(Z))}catch(e){}};const save=()=>{if(!BOOT)Z.ts=Date.now();saveLocal();sched()};
const OUT={hoodie:'Hoodie',jacket:'Jacket',school:'School',sports:'Sports',street:'Street',formal:'Formal',winter:'Winter',casual:'T-shirt',sunglasses:'Shades',headphones:'Headphones',cap:'Cap',mask:'Mask',glassesoff:'No glasses',backpack:'Backpack',bracelet:'Bracelet',earrings:'Earrings',messy:'Messy hair',hairdown:'Hair down',skincare:'Skincare',lipbalm:'Lip balm'};
const ACT={waving:{l:'Wave',line:'hiii! *waves*',hap:5},thumbsup:{l:'Thumbs up',line:'nice. very nice.',hap:5},writing:{l:'Write',line:'*scribbling* shh, i\'m being productive.',hap:2,en:-4},phone:{l:'Phone',line:'just checking one thing... *scrolls for an hour*',hap:6,en:-3},drinking:{l:'Boba',line:'*slurp* boba. best invention ever.',hap:10,hun:8},eating:{l:'Eat',line:'*nom nom* okay that slaps.',hap:12,hun:35},laptop:{l:'Laptop',line:'coding time. no bugs. ...probably.',hap:4,en:-6},reading:{l:'Read',line:'*reads* ...oh, plot twist.',hap:6,en:-3},stretching:{l:'Stretch',line:'*stretches* ahhh. my joints go crack.',hap:3,en:10},gaming:{l:'Game',line:'one more match! just one!',hap:18,en:-10}};
const NEWE='shocked nervous embarrassed sad sleepy teary laughhard crying blushing disappointed confident cheer hmm'.split(' ');
Object.assign(E,{shocked:{l:'Shocked',fx:'exclaim',sfx:'stab',an:'jolt',flash:1,line:'WHAT?! no way!'},nervous:{l:'Nervous',fx:'sweat',sfx:'hum',an:'shake',line:'u-uh... i didn\'t do it.'},embarrassed:{l:'Shy',fx:'sweat',sfx:'wink',an:'tilt',line:'ok that was embarrassing.'},sad:{l:'Sad',fx:'tears',sfx:'sad',an:'droop',line:'...i\'m a little sad.'},sleepy:{l:'Sleepy',fx:'zzz',sfx:'sad',an:'droop',line:'zzz... five more minutes...'},teary:{l:'Teary',fx:'tears',sfx:'sad',an:'droop',line:'*sniff* i\'m fine. i\'m fine.'},laughhard:{l:'LOL',fx:'ha',sfx:'laugh',an:'shake',line:'HAHAHA stoppp, i can\'t breathe!'},crying:{l:'Cry',fx:'tears',sfx:'sad',an:'shake',line:'waaah!! why!!'},blushing:{l:'Blush',fx:'hearts',sfx:'wink',an:'tilt',line:'s-stop, you\'re making me blush...'},disappointed:{l:'Meh',fx:'puff',sfx:'sad',an:'droop',line:'...really? disappointing.'},confident:{l:'Smug',fx:'sparkle',sfx:'ding',an:'pop',line:'yeah. i know i\'m good.'},cheer:{l:'Cheer',fx:'confetti',sfx:'fanfare',an:'hop',line:'woohoo! we did it!'},hmm:{l:'Hmm',fx:'dots',sfx:'hum',an:'tilt',line:'hmm... suspicious.'}});
Object.assign(FX,{sweat(){add(5,i=>({t:'💦',x:hx()-W*.14+i*14,y:hy()-H*.12,vx:R(-.5,.5),vy:R(.4,1.5),g:.03,life:60,sz:20,d:i*6}))},tears(){add(10,i=>({t:'💧',x:hx()+(i%2?1:-1)*W*.06,y:hy()+H*.02,vx:(i%2?1:-1)*R(.3,1),vy:R(.5,2),g:.08,life:55,sz:16,d:i*4}))},zzz(){add(3,i=>({t:'💤',x:hx()+W*.14+i*18,y:hy()-H*.08-i*10,vy:-.6,life:90,sz:22+i*6,d:i*14}))}});
[...Object.keys(OUT),...Object.keys(ACT),...NEWE,'mouth0','mouth1','mouth2','mouth3','mouth4'].forEach(k=>{S[k]=(window.SPRITE_DATA&&SPRITE_DATA[k])||SP+k+'.webp';setTimeout(()=>{new Image().src=S[k]},4000)});
/* sprite logic: outfits stick on positive moods, activities override */
let actSprite=null;const POS=['happy','talking','bye','pointing','excited','winking'];
function base(k){return actSprite?S[actSprite]:(Z.outfit&&POS.includes(k))?S[Z.outfit]:S[k]}
function emote(k,fx=true){if(!E[k])return;mood=k;actSprite=null;face.src=base(k);const d=E[k];char.className='';void char.offsetWidth;char.classList.add('a-'+d.an);if(fx){if(d.fx)FX[d.fx]();SFX[d.sfx]&&SFX[d.sfx]();if(d.flash)flash();if(d.shake)shake()}}
function talkAnim(on){idle.classList.toggle('talk',on);clearInterval(talkTimer);
 if(on&&!actSprite&&!Z.outfit&&POS.includes(mood)){let last=-1;talkTimer=setInterval(()=>{let i;do{i=(Math.random()*5)|0}while(i===last);last=i;face.src=S['mouth'+i]},115)}else face.src=base(mood)}
function setOutfit(k,quiet){Z.outfit=k;save();actSprite=null;face.src=base(mood);paint();if(!quiet){SFX.ding();FX.sparkle();say(k?`[winking]ooh, ${OUT[k].toLowerCase()}. [confident]how do i look?`:'[happy]back to my classic look.')}}
function doAct(k){const a=ACT[k];actSprite=k;mood='happy';face.src=S[k];char.className='';void char.offsetWidth;char.classList.add('a-pop');SFX.pop();adj({hap:a.hap||0,en:a.en||0,hun:a.hun||0});if(a.hap>9)FX.sparkle();return say(a.line)}
function pet(){adj({hap:8});FX.hearts();SFX.ding();say(pick(['[blushing]hehe... that feels nice.','[happy]aww, thanks!','[cheer]i love head pats!']))}
const adj=d=>{for(const k in d)Z.st[k]=Math.max(0,Math.min(100,Z.st[k]+d[k]));saveLocal();bars()};
/* UI */
BG.push('home');DEC.home='';const panel=$('panel');
const mk=(id,h)=>{const d=document.createElement('div');d.id=id;d.className='pane';d.innerHTML=h;panel.insertBefore(d,$('emotes'));return d};
const tb=document.createElement('div');tb.id='tabs';panel.prepend(tb);
[['chat','💬 Chat'],['study','📚 Study'],['style','👕 Style'],['home','🏠 Home'],['care','❤️ Care'],['mem','🧠 Mind'],['music','🎧 Music']].forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;b.onclick=()=>{panel.dataset.tab=k;[...tb.children].forEach(c=>c.classList.toggle('on',c===b));SFX.pop()};tb.append(b);if(k==='chat')b.click()});
const WALLS=['#f7dcae','linear-gradient(#bde3ff,#eaf7ff)','repeating-linear-gradient(90deg,#fff4 0 14px,#0000 14px 28px),#9fd8c0','#f6b8cf','linear-gradient(#1b1f4b,#3b2f7a)','repeating-linear-gradient(0deg,#0003 0 2px,#0000 2px 22px),#b5523a','radial-gradient(#fff6 3px,#0000 4px) 0 0/22px 22px,#8e9aff','linear-gradient(#ff9a8b,#ffd6a5)','#cfe8ff','linear-gradient(#0a2a66,#2f6bd8)','repeating-linear-gradient(90deg,#fff3 0 14px,#0000 14px 28px),#4aa3e0','linear-gradient(#8ec5ff,#e3f2ff)'];
const FLOORS=['#b9835a','#6b4630','#7a5c9a','#cfd8dc','#5cc26b','#2e8fa6','#1f4e8c','#8ec5ff'];
const ITEMS='🛏️ 🛋️ 🖥️ 🪴 🪑 📚 🖼️ 🪟 🐈 🧸 🕯️ 💡 🎮 📺 🎸 🏀 🌵 🎹 🧋 🪞 ⏰ 🎧 🚪 🦖 🌌 ✨ 🐟 🛹 🥟 🍜 🔬 🧪 💻 🤖 🔭'.split(' ');
mk('t-style','<h4>Outfits &amp; looks</h4><div class="g" id="outg"></div><p style="font-size:11px;color:var(--mute)">Outfits show while he\'s happy or chatting; strong emotions switch to his reaction faces.</p>');
mk('t-home','<h4>Wall</h4><div class="sw" id="walls"></div><h4>Floor</h4><div class="sw" id="floors"></div><h4>Furniture &amp; decor</h4><div class="pal" id="pal"></div><label style="display:block;margin-top:10px;font-size:13px"><input type="checkbox" id="ed"> Edit mode (drag items in the room)</label><div id="selbar"><span id="seln">tap an item</span><button data-a="up">＋</button><button data-a="dn">－</button><button data-a="fl">⇋</button><button data-a="del">🗑</button><button data-a="clr">Clear all</button></div>');
mk('t-care','<h4>Status</h4><div id="bars"></div><h4>Hang out</h4><div class="g" id="actg"></div>');
mk('t-mem','<h4>What Arzy remembers</h4><div id="memlist"></div><div class="memadd"><input id="memin" placeholder="Teach him something about you…" maxlength="120"><button id="memadd">Add</button></div><button id="memclr" class="dng">Forget everything</button><h4>Sync across devices</h4><div class="memadd"><input id="codein" type="password" placeholder="secret sync phrase (8+ chars)" maxlength="64" autocomplete="off"><button id="codego">Connect</button></div><p class="mt" id="syncst">Use the same phrase on every device to share memory, outfit and room. Pick something long and private: anyone with it can read your memory.</p><button id="codeoff" class="dng">Disconnect this device</button>');$('memadd').onclick=()=>{const v=$('memin').value.trim();if(v){addMem(v);$('memin').value=''}};$('memclr').onclick=()=>{if(Z.mem.facts.length&&confirm('Make Arzy forget everything about you?')){Z.mem.facts=[];save();memUI()}};
const tile=(k,l,fn)=>{const b=document.createElement('button');b.dataset.k=k;b.innerHTML=`<img src="${S[k]}" alt="">${l}`;b.onclick=fn;return b};
$('outg').append(tile('happy','Default',()=>setOutfit(null)));Object.keys(OUT).forEach(k=>$('outg').append(tile(k,OUT[k],()=>setOutfit(k))));
$('actg').append(tile('blushing','Pet',pet),tile('sleepy','Nap',()=>{adj({en:40});say('[sleepy]zzz... [happy]okay, much better!')}));Object.keys(ACT).forEach(k=>$('actg').append(tile(k,ACT[k].l,()=>doAct(k))));$('actg').append(tile('thinking','Fun fact',()=>{tb.children[0].click();$('txt').value='tell me a fun fact about food, science or tech';send()}));
const sw=(id,arr,key)=>arr.forEach((v,i)=>{const b=document.createElement('button');b.style.background=v;b.dataset.i=i;b.onclick=()=>{Z[key]=i;save();applyHome();SFX.pop()};$(id).append(b)});sw('walls',WALLS,'wall');sw('floors',FLOORS,'floor');
function paint(){[...$('outg').children].forEach(b=>b.classList.toggle('on',(b.dataset.k==='happy'?null:b.dataset.k)===Z.outfit));[...$('walls').children].forEach((b,i)=>b.classList.toggle('on',i===Z.wall));[...$('floors').children].forEach((b,i)=>b.classList.toggle('on',i===Z.floor))}
function bars(){$('bars').innerHTML=[['😊 Happy','hap'],['⚡ Energy','en'],['🍜 Fullness','hun']].map(([l,k])=>`<div class="bar"><span>${l}</span><i><b style="width:${Z.st[k]}%"></b></i></div>`).join('')}
/* home / furniture */
const fl=document.createElement('div');fl.id='furn';stage.insertBefore(fl,$('bubble'));let cur=-1;
function applyHome(){stage.style.setProperty('--wall',WALLS[Z.wall]);stage.style.setProperty('--floor',FLOORS[Z.floor]);paint()}
function furn(){fl.innerHTML='';fl.classList.toggle('edit',$('ed').checked);Z.items.forEach((it,i)=>{const d=document.createElement('div');d.className='fi'+(i===cur?' cur':'');d.textContent=it.e;d.style.cssText=`left:${it.x}%;top:${it.y}%;font-size:${56*it.s}px;transform:translate(-50%,-50%) scaleX(${it.f?-1:1})`;
 d.onpointerdown=ev=>{if(!$('ed').checked)return;cur=i;$('seln').textContent=it.e+' selected';ev.preventDefault();d.setPointerCapture(ev.pointerId);const mv=e=>{const r=stage.getBoundingClientRect();it.x=Math.max(2,Math.min(98,(e.clientX-r.left)/r.width*100));it.y=Math.max(8,Math.min(96,(e.clientY-r.top)/r.height*100));d.style.left=it.x+'%';d.style.top=it.y+'%'};d.addEventListener('pointermove',mv);d.onpointerup=()=>{d.removeEventListener('pointermove',mv);save();furn()}};fl.append(d)})}
ITEMS.forEach(e=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{Z.items.push({e,x:R(15,85),y:R(42,72),s:1,f:0});cur=Z.items.length-1;$('ed').checked=true;$('seln').textContent=e+' selected';furn();save();SFX.pop();say('[happy]'+e+' '+pick(['nice pick!','ooh, i like it.','so cozy!','it fits the vibe.']))};$('pal').append(b)});
$('ed').onchange=furn;
$('selbar').onclick=e=>{const a=e.target.dataset.a,it=Z.items[cur];if(a==='clr'){Z.items=[];cur=-1}else if(!a||!it)return;else if(a==='up')it.s=Math.min(3,it.s+.25);else if(a==='dn')it.s=Math.max(.4,it.s-.25);else if(a==='fl')it.f^=1;else if(a==='del'){Z.items.splice(cur,1);cur=-1}furn();save()};
/* pet + poke */
let pd=0,px=0,py=0,petted=false;face.style.touchAction='none';
face.addEventListener('pointerdown',e=>{px=e.clientX;py=e.clientY;pd=0});
face.addEventListener('pointermove',e=>{if(!e.buttons)return;pd+=Math.hypot(e.clientX-px,e.clientY-py);px=e.clientX;py=e.clientY;if(pd>350){pd=0;petted=true;pet()}});
face.onclick=()=>{if(petted){petted=false;return}say(pick(['[surprised]hey! [laughing]ha ha, that tickles!','[angry]poke me again and... [happy]jk. do it again.','[confused]...do i have something on my face?','[winking]boop.','[nervous]careful, i\'m fragile.']))};
/* brain: Claude via /api/chat, local rules as fallback */
const HIST=[];
async function send(){const i=$('txt'),t=i.value.trim();if(!t)return;i.value='';msg('u',t);if(STUDYRE.test(t))studyUntil=Date.now()+9e5;lastAct=Date.now();emote('thinking',false);SFX.pop();let r,viaAI=false;
 try{const res=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({memory:Z.mem.facts.map(f=>f.t),messages:[...HIST,{role:'user',content:t}],state:{talk:Z.talk,lang:Z.lang,turns:HIST.length>>1,study:Date.now()<studyUntil,outfit:Z.outfit,name:user,stats:Z.st,scene:BG[bgi]}})});if(!res.ok){let m='HTTP '+res.status;try{m=(await res.json()).error||m}catch(e){}throw new Error(m)}r=(await res.json()).text;if(!r)throw 0;viaAI=true}catch(e){if(Date.now()-(window._ln||0)>60000){window._ln=Date.now();note('🔌 AI brain offline ('+(e.message||'no reply')+'), using basic replies')}await sleep(350);learnLocal(t);r=think(t)}
 HIST.push({role:'user',content:t},{role:'assistant',content:r.replace(/\[[^\]]*\]/g,'')||'...'});while(HIST.length>16)HIST.splice(0,2);if(viaAI)autoMem(t);
 const cmds=[];r=r.replace(/\[(outfit|bg|do|mem|forget|play):([^\]]+)\]/g,(_,k,v)=>{if(k==='mem')addMem(v);else if(k==='forget')forgetMem(v);else cmds.push([k,v.trim()]);return''});
 await say(r);for(const[k,v]of cmds){if(k==='outfit'&&(v==='default'||OUT[v]))setOutfit(v==='default'?null:v,1);if(k==='bg'&&BG.includes(v))setBg(BG.indexOf(v));if(k==='do'&&ACT[v])await doAct(v);if(k==='play')await playSong(v)}}
/* memory */
const norm=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'').trim();
function note(t){const d=document.createElement('div');d.className='note';d.textContent=t;log.append(d);log.scrollTop=log.scrollHeight}
function memUI(){const L=$('memlist');L.innerHTML='';if(!Z.mem.facts.length){L.innerHTML='<p class="mt">nothing yet. chat with him and he\'ll start remembering things about you.</p>';return}Z.mem.facts.forEach((f,i)=>{const r=document.createElement('div');r.className='mi';const s=document.createElement('span');s.textContent=f.t;const m=document.createElement('small');m.textContent=f.d;const b=document.createElement('button');b.textContent='✕';b.onclick=()=>{Z.mem.facts.splice(i,1);save();memUI()};r.append(s,m,b);L.append(r)})}
function addMem(t,quiet){t=String(t).trim().slice(0,140);if(t.length<3||Z.mem.facts.some(f=>{const a=norm(f.t),c=norm(t);return a===c||a.includes(c)||c.includes(a)}))return;Z.mem.facts.push({t,d:new Date().toISOString().slice(0,10)});while(Z.mem.facts.length>60)Z.mem.facts.shift();const m=t.match(/name is ([a-z]+)/i);if(m)user=m[1];save();memUI();if(!quiet)note('🧠 remembered: '+t)}
function forgetMem(k){const n=Z.mem.facts.length;k=norm(String(k));if(!k)return;Z.mem.facts=Z.mem.facts.filter(f=>!norm(f.t).includes(k));if(Z.mem.facts.length<n){save();memUI();note('🧠 forgot: '+k)}}
function learnLocal(t){let m;if(m=t.match(/my name is ([a-z]{2,20})/i))addMem("user's name is "+m[1]);if(m=t.match(/\bi (?:really )?(?:like|love|enjoy) ([^.!?,]{2,40})/i))addMem('user likes '+m[1]);if(m=t.match(/\bi(?:'m| am) from ([^.!?,]{2,30})/i))addMem('user is from '+m[1]);if(m=t.match(/my favou?rite (\w+) is ([^.!?,]{2,30})/i))addMem(`user's favorite ${m[1]} is ${m[2]}`);if(m=t.match(/\bi (?:study|work (?:as|in|on)) ([^.!?,]{2,40})/i))addMem('user studies/works: '+m[1])}
const FACTS=['[thinking]fun fact: [excited]the first computer "bug" was a real moth stuck in a relay in 1947.','[thinking]fun fact: [surprised]octopuses have three hearts. [winking]i only have one.','[thinking]fun fact: [happy]steaming cooks with moist heat, which is why steamed dumplings stay juicy.','[excited]fun fact: bananas are slightly radioactive from potassium-40. [happy]totally harmless though.','[thinking]fun fact: [excited]honey barely spoils, because it\'s so low in water that microbes can\'t grow.'];
BR.unshift([/what do you (remember|know) about me|do you remember me|my memory/i,()=>Z.mem.facts.length?[`[thinking]let me check my notes... [happy]${Z.mem.facts.slice(-3).map(f=>f.t).join('; ')}.`]:['[confused]not much yet. tell me about yourself!']],
[/siomai|dumpling|favou?rite food|fav food/i,()=>['[excited]siomai!! my favorite food. [happy]steamed, with calamansi and chili garlic oil. perfection.']],
[/favou?rite colou?r|fav color|\bblue\b/i,()=>['[happy]blue, in every shade: navy, cobalt, sky, teal. [confident]i look good in all of them.']],
[/fun fact|teach me|tell me something|something interesting/i,()=>FACTS]);
/* cloud sync */
const setSt=t=>{const e=$('syncst');if(e)e.textContent=t};
async function cloud(op,data){const r=await fetch('/api/memory',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({code:CODE,op,data})});if(!r.ok){let m=r.status;try{m=(await r.json()).error||m}catch(e){}throw new Error(m)}return r.json()}
const snap=()=>({ts:Z.ts||Date.now(),mem:Z.mem,outfit:Z.outfit,wall:Z.wall,floor:Z.floor,items:Z.items,st:Z.st,lists:Z.lists,talk:Z.talk,lang:Z.lang});
async function push(){if(CODE)await cloud('save',snap())}
let pt;function sched(){if(!CODE)return;clearTimeout(pt);pt=setTimeout(()=>push().then(()=>setSt('☁️ synced')).catch(e=>setSt('⚠️ '+e.message)),1500)}
function refreshAll(){memUI();applyHome();furn();bars();paint();setOutfit(Z.outfit,1)}
async function syncNow(){if(!CODE)return;try{const{data}=await cloud('load');if(data){const have=new Set(Z.mem.facts.map(f=>norm(f.t)));const add=((data.mem||{}).facts||[]).filter(f=>!have.has(norm(f.t)));
 if((data.ts||0)>(Z.ts||0))for(const k of['outfit','wall','floor','items','st','lists','talk','lang'])if(data[k]!==undefined)Z[k]=data[k];
 Z.mem.facts=[...Z.mem.facts,...add].sort((a,b)=>a.d<b.d?-1:1).slice(-60);Z.ts=Math.max(Z.ts||0,data.ts||0);sanitizeZ();saveLocal();refreshAll()}
 await push();setSt('☁️ synced just now')}catch(e){setSt('⚠️ '+e.message)}}
$('codego').onclick=async()=>{const v=$('codein').value.trim();if(v.length<8){setSt('⚠️ use at least 8 characters');return}CODE=v;try{localStorage.setItem('arzy-code',v)}catch(e){}$('codein').value='';$('codein').placeholder='connected ✓';setSt('syncing…');await syncNow();BOOT=false};
$('codeoff').onclick=()=>{CODE='';try{localStorage.removeItem('arzy-code')}catch(e){}$('codein').placeholder='secret sync phrase (8+ chars)';setSt('disconnected. your data stays on this device.')};
/* study, auto-memory, quieter fallback brain */
let studyUntil=0,lastMem=0;const STUDYRE=/\b(study|quiz|explain|exam|reviewer|review|homework|assignment|solve|lesson|aral|flashcards?|research|compare|analy[sz]e|game theory|bible|scripture|fact-?check|outline|summari[sz]e|pros and cons|code|coding|datapack|luau|html|css|javascript|debug|vibecode)\b/i;
async function autoMem(t){if(!(/\b(i|i'm|im|my|me|ako|akong|ko|akin|gusto|favorite|fav|study|exam|school|work|grade|course)\b/i.test(t)&&t.length>12))return;if(Date.now()-lastMem<20000)return;lastMem=Date.now();
 try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({task:'memorize',memory:Z.mem.facts.map(f=>f.t),messages:HIST.slice(-6)})});if(!r.ok)return;const m=((await r.json()).text||'').match(/\[[\s\S]*\]/);if(!m)return;JSON.parse(m[0]).filter(x=>typeof x==='string').slice(0,4).forEach(x=>addMem(x))}catch(e){}}
const STUDY={Explain:t=>`explain ${t} step by step with a simple example`,ELI5:t=>`explain ${t} like i'm 10`,'Teach me':t=>`teach me ${t} from zero, in small steps, and check my understanding`,Quiz:t=>`quiz me on ${t}, one question at a time, wait for my answer`,Flashcards:t=>`make 8 flashcards (Q/A) for ${t}`,Practice:t=>`give me practice problems on ${t}, start with one`,Summary:t=>`give me a short summary of ${t} with the key points`,Mnemonic:t=>`make a mnemonic to help me remember ${t}`,Brief:t=>`research brief on ${t}: key points, what's debated, what to verify`,Compare:t=>`compare ${t}: key differences, pros and cons`,'Fact-check':t=>`fact-check this and tell me what's solid vs uncertain: ${t}`,Outline:t=>`make a clear outline for ${t}`,'Game theory':t=>`analyze ${t} using game theory: players, incentives, payoffs, best move`,'Social help':t=>`help me with this social situation or message: ${t}. give wording i can send`,'Bible Q':t=>`answer from the Bible as a Witness, with scriptures: ${t}`,'Code help':t=>`help me with this website or code: ${t}`,Datapack:t=>`help me make a Minecraft datapack: ${t}. tell me which version it targets`,Roblox:t=>`help me with Roblox Studio / Luau: ${t}`};
const FAITH=['[happy]random, but psalm 83:18 is my favorite verse. it has god\'s name in it.','[talking]ever wonder why bad things happen? the bible actually answers that. ask me sometime.','[hmm]revelation 21:4 just hits different. no more death, no more pain.','[happy]matthew 6:33. seek first the kingdom. fixed my priorities.','[talking]philippians 4:6, 7. that one calms me down every time.','[winking]i could talk about the bible all day. just saying. no pressure.','[happy]Awit 83:18 ang paborito kong teksto. nandoon ang pangalan ng Diyos.','[talking]Filipos 4:6, 7. ito ang nagpapakalma sa akin tuwing kabado ako.'];
mk('t-study','<h4>Study, research &amp; code</h4><div class="memadd"><input id="stopic" placeholder="topic, question or situation" maxlength="240"></div><div class="g" id="stg" style="margin-top:8px"></div><h4>Focus timer</h4><div class="bar"><span id="pomo" style="width:auto;font-size:22px">25:00</span><button id="pstart" class="dng" style="margin:0 4px">Focus 25</button><button id="pbreak" class="dng" style="margin:0 4px">Break 5</button><button id="pstop" class="dng" style="margin:0">Stop</button></div><p class="mt">Paste your notes in the chat and say "quiz me on this" or "make flashcards". He adapts to how you learn and remembers it.</p>');
Object.keys(STUDY).forEach(k=>{const b=document.createElement('button');b.textContent=k;b.style.padding='10px 2px';b.onclick=()=>{const t=$('stopic').value.trim();tb.children[0].click();if(!t){say('[hmm]what topic?');return}studyUntil=Date.now()+9e5;$('txt').value=STUDY[k](t);send()};$('stg').append(b)});
let ptm=null;function pomo(min,focus){clearInterval(ptm);const end=Date.now()+min*6e4;studyUntil=end+9e5;doAct(focus?'reading':'stretching');say(focus?`[confident]locked in. ${min} mins.`:'[happy]break. drink water.');
 ptm=setInterval(()=>{const s=Math.max(0,Math.round((end-Date.now())/1e3));$('pomo').textContent=String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(!s){clearInterval(ptm);SFX.fanfare();FX.confetti();say(focus?'[cheer]time. nice work, take 5.':'[happy]break over. back at it?')}},500)}
$('pstart').onclick=()=>pomo(25,1);$('pbreak').onclick=()=>pomo(5,0);$('pstop').onclick=()=>{clearInterval(ptm);$('pomo').textContent='25:00'};
const J=['[laughing]bakit malungkot ang kalendaryo? bilang na ang araw niya.','[winking]what do you call a sleeping bull? a bulldozer. [laughing]i\'m cooked.','[talking]what\'s a computer\'s favorite snack? [laughing]microchips. no cap.','[laughing]sabi ng zero sa eight: ang ganda ng belt mo, pre.','[thinking]why was six scared of seven? [laughing]because seven ate nine. six seven. sorry.'];
BR.length=0;
BR.push([/what do you (remember|know) about me|do you remember me/i,()=>Z.mem.facts.length?[`[thinking]${Z.mem.facts.slice(-3).map(f=>f.t.replace(/^user('s)? ?/i,'')).join(', ')}.`]:['[confused]not much yet.']],
[/my name is ([a-z ]{1,20})/i,(t,m)=>{user=m[1].trim().split(' ')[0];return `[happy]noted, ${user}.`}],
[/^(hi|hello|hey|yo|sup|kumusta|musta)\b/i,()=>[`[happy]yo${user?' '+user:''}.`,'[winking]sup.','[happy]uy, musta.']],
[/how are (you|u)|kumusta ka/i,()=>['[happy]chill. you?','[winking]vibing. lowkey sleepy.','[tired]surviving, fr.']],
[/joke|funny|pun|patawa/i,()=>J],
[/study|review|quiz|explain|homework|aral/i,()=>['[thinking]bet. what subject? (i teach best with my AI brain connected)']],
[/siomai|sisig|bbq|barbecue|favou?rite food|fav food|\bfood\b|kain/i,()=>['[excited]sisig, bbq ribs, siomai. i eat everything. [winking]veggies too.','[happy]depends. sisig tonight, brisket tomorrow.']],
[/favou?rite colou?r|\bblue\b/i,()=>['[happy]blue. all shades.']],
[/fun fact|something interesting/i,()=>FACTS],
[/\b(sigma|skibidi|rizz|aura|cooked|ohio|npc|sus|brainrot|six seven|67)\b/i,()=>['[laughing]ohio-level cooked.','[winking]aura -500.','[laughing]chat, is this real?','[confident]skibidi. i said what i said.']],
[/thank|salamat|thx/i,()=>['[happy]gg.','[winking]walang anuman.']],
[/(stupid|dumb|idiot|hate you|suck)/i,()=>['[disappointed]...ok.','[hmm]that\'s mid, bro.']],
[/(sad|lonely|bad day|stress|anxious|depress|pagod|malungkot)/i,()=>['[sad]hey. i\'m here. want to talk?','[sad]sounds heavy. take your time.']],
[/(bye|goodbye|see you|good ?night|gn|paalam)/i,()=>['[bye]sige. ingat.','[bye]later.']],
[/(help|what can you do|commands)/i,()=>['[pointing]chat, jokes, study, quiz, timer, outfits, decorate the room.']],
[/time|date|what day/i,()=>[`[thinking]${new Date().toLocaleString([],{weekday:'long',hour:'2-digit',minute:'2-digit'})}.`]],
[/(background|scene|wallpaper|\bbg\b|switch|change|go to)/i,t=>{const k=['room','night','meadow','sunset','cyber','home'].find(x=>t.includes(x));return [`[happy]${setBg(k?BG.indexOf(k):bgi+1)}.`]}],
[/^(be|act|show|make|look|feel)\b/i,t=>{const k=Object.keys(E).find(x=>t.includes(x.slice(0,4)));return k?[`[${k}]${E[k].line}`]:['[confused]be what?']}]);
BR.unshift([/(full name|real name|your name|who are you|sino ka)/i,()=>['[talking]arzy. azrel seth m. villeza if we\'re being formal.']],
[/\byour (sister|family|parents|mom|mother|dad|father)\b|about your family|may kapatid/i,()=>['[happy]my sister\'s sophia. mom and dad too. [winking]that\'s the whole squad.']],
[/(jehovah|witness|religion|your faith|bible|kingdom hall|\bjw\b)/i,()=>['[talking]i\'m one of jehovah\'s witnesses. [excited]it means a lot to me. ask me anything, or i\'ll start telling you lol.']]);
BR.unshift([/minecraft|datapack|redstone|mcfunction/i,()=>['[excited]minecraft is peak. i mess with datapacks too.','[happy]datapacks are lowkey fun: functions, advancements, loot tables.']],
[/roblox|luau/i,()=>['[happy]roblox, yeah i play. luau scripting is a vibe.']],
[/(vibe ?cod|website|html|\bcss\b|javascript|vercel)/i,()=>['[confident]i vibecode websites. made an activity site for my class section recently.','[happy]websites are fun. what are we building?']],
[/(pirated|crack|torrent|free games?)/i,()=>['[nervous]ahh... gray area for me, ngl. i won\'t help you find any though.']]);
/* images, links, thinking status, send v2 */
let PIC=null,stT=null;
const WEBRE=/\b(search|look up|google|news|latest|recent|link|source|reference|song|music|playlist|artist|album|release|who is|who won|score|price|weather|trending)\b/i;
function thinkStart(l){thinkStop();const L=l?[l,'*working on it...*']:['*thinking...*','*working on it...*','*one sec...*'];let n=0;const go=()=>{bubble.textContent=n>5?'*still working on it...*':L[n%L.length];n++;bubble.style.fontSize='24px';bubble.classList.add('on')};go();SFX.hum();stT=setInterval(go,1800)}
function thinkStop(){clearInterval(stT);stT=null}
async function shrink(f){const u=URL.createObjectURL(f);try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});let s=Math.min(1,1280/Math.max(im.width,im.height)),q=.85,d;for(let k=0;k<5;k++){const c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);d=c.toDataURL('image/jpeg',q);if(d.length<3.2e6)break;s*=.75;q-=.08}return{url:d,mime:'image/jpeg',data:d.split(',')[1]}}finally{URL.revokeObjectURL(u)}}
const picbar=document.createElement('div');picbar.id='picbar';$('row').before(picbar);
function renderPic(){picbar.innerHTML='';if(!PIC)return;const w=document.createElement('div');w.className='pb';const im=document.createElement('img');im.src=PIC.url;const x=document.createElement('button');x.textContent='✕';x.onclick=()=>{PIC=null;renderPic()};w.append(im,x);picbar.append(w)}
const att=document.createElement('button');att.id='att';att.textContent='📎';att.title='Attach an image (up to 10 MB)';$('row').prepend(att);
const fin=document.createElement('input');fin.type='file';fin.accept='image/*';fin.hidden=true;document.body.append(fin);
att.onclick=()=>fin.click();
fin.onchange=async()=>{const f=fin.files[0];fin.value='';if(!f)return;if(!f.type.startsWith('image/'))return note('📎 images only');if(f.size>10*1024*1024)return note('📎 that image is over 10 MB');try{PIC=await shrink(f);renderPic()}catch(e){note('📎 couldn\'t read that image')}};
function userMsg(t,pic){const m=document.createElement('div');m.className='m u';if(pic){const im=document.createElement('img');im.src=pic.url;im.className='pic';m.append(im)}const s=document.createElement('span');s.textContent=t;m.append(s);log.append(m);log.scrollTop=log.scrollHeight}
function addLinks(L){const seen=new Set(),ok=L.filter(l=>/^https?:\/\//i.test(l.url)&&!seen.has(l.url)&&seen.add(l.url)).slice(0,6);if(!ok.length)return;const d=document.createElement('div');d.className='src';ok.forEach(l=>{const a=document.createElement('a');a.href=l.url;a.target='_blank';a.rel='noopener noreferrer';let h='';try{h=new URL(l.url).hostname}catch(e){}a.textContent='🔗 '+(l.title||h).slice(0,42);d.append(a)});log.append(d);log.scrollTop=log.scrollHeight}
async function send(){
 if(window._busy)return;const i=$('txt'),t=i.value.trim(),pic=PIC;if(!t&&!pic)return;i.value='';PIC=null;renderPic();
 const text=t||'what do you think of this?';userMsg(text,pic);lastAct=Date.now();if(!pic&&await musicCmd(text))return;
 if(STUDYRE.test(text)||WEBRE.test(text))studyUntil=Date.now()+9e5;
 emote('thinking',false);SFX.pop();thinkStart(pic?'*looking at your image...*':WEBRE.test(text)?'*searching the web...*':null);FX.dots();
 let r,viaAI=false,srcs=[];window._busy=true;setTimeout(()=>{window._busy=false},40000);
 try{
  const res=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({memory:Z.mem.facts.map(f=>f.t),messages:[...HIST,{role:'user',content:text}],image:pic?{mime:pic.mime,data:pic.data}:null,state:{talk:Z.talk,lang:Z.lang,turns:HIST.length>>1,study:Date.now()<studyUntil,outfit:Z.outfit,name:user,stats:Z.st,scene:BG[bgi],now:new Date().toString()}})});
  if(!res.ok){let m='HTTP '+res.status;try{m=(await res.json()).error||m}catch(e){}throw new Error(m)}
  const j=await res.json();r=(j.text||'').replace(/^\s*(user|response) safety\s*:.*$/gim,'').trim();srcs=j.sources||[];
  if(!r)throw new Error('empty reply');
  if(/(user|response)\s*safety\s*:/i.test(r)||(r.match(/(^|\n)\s*(VOICE|HUMOR|IDENTITY|FAITH|FOCUS AREAS|EMOTION TAGS)\s*:/g)||[]).length>=2)throw new Error('model returned junk');
  viaAI=true;
 }catch(e){if(Date.now()-(window._ln||0)>60000){window._ln=Date.now();note('🔌 AI brain offline ('+(e.message||'no reply')+'), using basic replies')}await sleep(300);learnLocal(text);r=pic?'[hmm]i can\'t see images in basic mode.':think(text)}
 window._busy=false;thinkStop();
 HIST.push({role:'user',content:text+(pic?' [sent an image]':'')},{role:'assistant',content:r.replace(/\[[^\]]*\]/g,'')||'...'});while(HIST.length>16)HIST.splice(0,2);if(viaAI)autoMem(text);
 const links=[...srcs];r=r.replace(/\[link:([^|\]]{1,80})\|(https?:\/\/[^\]\s]+)\]/g,(_,a,u)=>{links.push({title:a.trim(),url:u});return''});
 const cmds=[];r=r.replace(/\[(outfit|bg|do|mem|forget|play):([^\]]+)\]/g,(_,k,v)=>{if(k==='mem')addMem(v);else if(k==='forget')forgetMem(v);else cmds.push([k,v.trim()]);return''});
 chatSave(text,r.replace(/\[[^\]]*\]/g,'').trim());await say(r.trim()||'[hmm]...');addLinks(links);
 for(const[k,v]of cmds){if(k==='outfit'&&(v==='default'||OUT[v]))setOutfit(v==='default'?null:v,1);if(k==='bg'&&BG.includes(v))setBg(BG.indexOf(v));if(k==='do'&&ACT[v])await doAct(v);if(k==='play')await playSong(v)}}
$('send').onclick=()=>send();$('txt').onkeydown=e=>{if(e.key==='Enter'&&!e.isComposing)send()};
/* music v2: dock toolbar, playlists by link, full songs */
const MP={mode:null,au:null,yt:null,sp:null,cur:null,list:null,playing:false,vol:.7,card:null,nt:null,shuf:false,rep:false,pos:0,dur:0};
const PICKS=['C418 Aria Math','C418 Sweden','Eraserheads Ligaya','Parokya ni Edgar Harana','December Avenue Sleep Tonight','Daft Punk Get Lucky'];
const dec=s=>String(s||'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
const MR=/^\s*(?:(?:hey |yo )?arzy[, ]+)?(?:(?:can|could) you |please |pls )*(?:play|put on|patugtugin|patugtog|pakinggan)(?: me)?(?: the song| the music| some| song)? +(.{2,90}?)(?: please| pls| for me)?[.!?]*\s*$/i;
const TIME=/\b(time for (some )?(music|tunes|vibes)|music time|pull up (my |the )?(playlists?|music|songs?)|open (my |the )?(playlists?|music)|show (my |the )?playlists?|my playlists?|play (my |the )?playlists?|put on (my |the )?playlist|let'?s (listen|vibe)|oras na ng music)\b/i;
const TK=['chat','study','style','home','care','mem','music'];const tabTo=k=>tb.children[TK.indexOf(k)].click();
Object.assign(FX,{notes(){add(3,i=>({t:pick(['🎵','🎶','♪']),x:hx()+R(-W*.25,W*.25),y:hy()+H*.05,vx:R(-.3,.3),vy:R(-1.4,-.6),life:80,sz:R(18,28),d:i*8}))}});
const yb=document.createElement('div');yb.id='ytbox';yb.style.display='none';stage.append(yb);
const IC={sh:'⇄',pv:'⏮\uFE0E',nx:'⏭\uFE0E',rp:'↻',pl:'▶\uFE0E',pa:'⏸\uFE0E'};
const dock=document.createElement('div');dock.id='dock';
dock.innerHTML=`<div id="dkt">♫ nothing playing</div><div id="dkc"><button id="dksh" title="Shuffle">${IC.sh}</button><button id="dkpv" title="Previous">${IC.pv}</button><button id="dkpp" class="big">${IC.pl}</button><button id="dknx" title="Next">${IC.nx}</button><button id="dkrp" title="Repeat">${IC.rp}</button><div id="dkv" title="Volume"><i></i></div></div><div id="dkp"><span id="dkl">-:--</span><div id="dkb"><i id="dkf"></i></div><span id="dkr">-:--</span></div><button id="dkx" title="Hide">✕</button>`;stage.append(dock);
const hb=document.createElement('button');hb.className='ib';hb.textContent='🎧';hb.title='Music';$('mute').before(hb);
const fmt=s=>isFinite(s)&&s>=0?(s/60|0)+':'+String(Math.floor(s%60)).padStart(2,'0'):'-:--';
function showDock(on=true){dock.classList.toggle('on',on);stage.classList.toggle('docked',on);yb.classList.toggle('up',on)}
const isList=()=>MP.mode==='yt'&&MP.list&&MP.list.kind==='list';
function tick(){let p=MP.pos,d=MP.dur;
 if(MP.mode==='yt'&&MP.yt&&MP.yt.getCurrentTime){try{p=MP.yt.getCurrentTime();d=MP.yt.getDuration();const v=MP.yt.getVideoData();if(isList()&&v&&v.title)MP.cur={title:v.title,artist:v.author||''}}catch(e){}}
 else if(MP.mode==='au'&&MP.au){p=MP.au.currentTime;d=MP.au.duration}
 MP.pos=p;MP.dur=d;$('dkl').textContent=fmt(p);$('dkr').textContent=d?'-'+fmt(d-p):'-:--';$('dkf').style.width=(d?Math.min(100,p/d*100):0)+'%';
 const c=MP.cur;$('dkt').textContent=c?'♫ '+(c.artist?c.artist+' – ':'')+c.title+(MP.list&&MP.list.name!==c.title?' · '+MP.list.name:''):'♫ nothing playing'}
setInterval(tick,500);
function mUI(){const p=!!(MP.playing&&MP.mode);idle.classList.toggle('vibe',p);$('dkpp').textContent=p?IC.pa:IC.pl;$('dkv').style.opacity=MP.mode==='sp'?.4:1;$('dksh').classList.toggle('act',MP.shuf);$('dkrp').classList.toggle('act',MP.rep);
 const n=isList()?1:.35;$('dkpv').style.opacity=$('dknx').style.opacity=$('dksh').style.opacity=n;
 if(MP.card){MP.card.classList.toggle('playing',p);const i=MP.card.querySelector('i');if(i)i.textContent=p?'⏸':'▶'}clearInterval(MP.nt);if(p)MP.nt=setInterval(()=>FX.notes(),1800)}
function mPlay(){if(!MP.mode)return;MP.playing=true;if(MP.mode==='au')MP.au.play().catch(()=>{});else if(MP.mode==='yt')MP.yt.playVideo();else if(MP.sp)(MP.sp.resume||MP.sp.play).call(MP.sp);mUI()}
function mPause(){MP.playing=false;try{if(MP.mode==='au')MP.au.pause();else if(MP.mode==='yt')MP.yt.pauseVideo();else if(MP.sp)MP.sp.pause()}catch(e){}mUI()}
function mBack(){try{if(MP.au){MP.au.pause();MP.au=null}if(MP.yt){MP.yt.destroy();MP.yt=null}if(MP.sp){MP.sp.destroy();MP.sp=null}}catch(e){}yb.innerHTML='';MP.mode=null}
function mStop(){mBack();yb.style.display='none';MP.cur=null;MP.list=null;MP.playing=false;showDock(false);mUI()}
function mVol(d){mSetVol(MP.vol+d)}
function mNext(){if(isList())MP.yt.nextVideo()}function mPrev(){if(isList()&&MP.pos<4)MP.yt.previousVideo();else mSeek(0)}
function mSeek(s){try{if(MP.mode==='au')MP.au.currentTime=s;else if(MP.mode==='yt')MP.yt.seekTo(s,true);else if(MP.sp)MP.sp.seek(s)}catch(e){}}
$('dkpp').onclick=()=>MP.playing?mPause():mPlay();$('dknx').onclick=mNext;$('dkpv').onclick=mPrev;
$('dksh').onclick=()=>{MP.shuf=!MP.shuf;if(isList())MP.yt.setShuffle(MP.shuf);mUI()};
$('dkrp').onclick=()=>{MP.rep=!MP.rep;if(MP.au)MP.au.loop=MP.rep;if(isList())MP.yt.setLoop(MP.rep);mUI()};
$('dkb').onclick=e=>{if(MP.dur)mSeek(e.offsetX/$('dkb').clientWidth*MP.dur)};$('dkx').onclick=()=>showDock(false);hb.onclick=()=>showDock(!dock.classList.contains('on'));
let ytP=null,spP=null;
const loadAPI=(src,ready,chk,name)=>new Promise((ok,no)=>{if(chk())return ok(chk());ready(ok);const s=document.createElement('script');s.src=src;s.async=true;s.onerror=()=>no(new Error(name+' blocked (ad blocker or network?)'));document.head.append(s);setTimeout(()=>chk()?ok(chk()):no(new Error(name+' timed out')),9000)});
const ytAPI=()=>ytP||(ytP=loadAPI('https://www.youtube.com/iframe_api',ok=>{window.onYouTubeIframeAPIReady=()=>ok(true)},()=>window.YT&&YT.Player,'YouTube').catch(e=>{ytP=null;throw e}));
const spAPI=()=>spP||(spP=loadAPI('https://open.spotify.com/embed/iframe-api/v1',ok=>{window.onSpotifyIframeApiReady=A=>{window._spA=A;ok(A)}},()=>window._spA,'Spotify').catch(e=>{spP=null;throw e}));
async function ytLoad(o){await ytAPI();mBack();yb.style.cssText='display:block;width:200px;height:216px';yb.innerHTML='<div id="ytbar">⠿ drag me</div><div id="ytp"></div>';MP.mode='yt';const pv={autoplay:1,playsinline:1,rel:0};
 const cfg=o.kind==='list'?{playerVars:{...pv,listType:'playlist',list:o.id}}:{videoId:o.id,playerVars:{...pv,loop:1,playlist:o.id}};
 MP.yt=new YT.Player('ytp',{width:'200',height:'200',...cfg,events:{onReady:e=>{e.target.setVolume(MP.vol*100);if(o.kind==='list'){MP.shuf&&e.target.setShuffle(true);MP.rep&&e.target.setLoop(true)}e.target.playVideo()},onStateChange:e=>{MP.playing=e.data===1||e.data===3;if(e.data===0&&MP.rep&&o.kind!=='list'){e.target.seekTo(0);e.target.playVideo()}mUI()}}});MP.playing=true}
async function spLoad(o){const A=await spAPI();mBack();yb.style.cssText=`display:block;width:300px;height:${(o.kind==='track'?152:232)+16}px`;yb.innerHTML='<div id="ytbar">⠿ drag me</div><div id="spp"></div>';MP.mode='sp';
 A.createController($('spp'),{uri:`spotify:${o.kind}:${o.id}`,width:'100%',height:o.kind==='track'?'152':'232'},c=>{MP.sp=c;c.addListener('playback_update',e=>{const d=e.data||{};MP.playing=!d.isPaused;MP.pos=(d.position||0)/1e3;MP.dur=(d.duration||0)/1e3;mUI()});c.addListener('ready',()=>{try{c.play()}catch(x){}})});MP.playing=true}
function auLoad(d){mBack();MP.mode='au';const a=new Audio(d.preview);a.loop=true;MP.rep=true;a.volume=MP.vol;a.onplay=()=>{MP.playing=true;mUI()};MP.au=a;a.play().catch(()=>note('🎵 tap ▶ on the toolbar to start (browser blocked autoplay)'));yb.style.display='none'}
/* playlists by link */
function parseLink(u){try{const x=new URL(u),h=x.hostname.replace(/^www\.|^m\./,'');
 if(/(^|\.)youtube\.com$|^youtu\.be$/.test(h)){const l=x.searchParams.get('list'),v=h==='youtu.be'?x.pathname.slice(1):x.searchParams.get('v');if(l)return{t:'yt',kind:'list',id:l};if(v)return{t:'yt',kind:'video',id:v}}
 if(h==='open.spotify.com'){const m=x.pathname.match(/\/(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);if(m)return{t:'sp',kind:m[1],id:m[2]}}}catch(e){}return null}
function listAdd(L,url){Z.lists=Z.lists||[];let o=Z.lists.find(x=>x.t===L.t&&x.id===L.id);if(!o){o={name:(L.t==='yt'?'YouTube ':'Spotify ')+L.kind,url,...L};Z.lists.push(o);if(Z.lists.length>30)Z.lists.shift();save();libUI();listMeta(o)}return o}
async function listMeta(o){try{const j=await (await fetch('/api/music?meta='+encodeURIComponent(o.url))).json();if(j.title){o.name=dec(j.title).slice(0,50);save();libUI()}}catch(e){}}
async function playList(o){mStopSoft();MP.list=o;Z.lastList=o.id;save();showDock();MP.cur={title:o.name,artist:''};try{if(o.t==='yt')await ytLoad(o);else await spLoad(o)}catch(e){MP.mode=null;MP.playing=false;MP.cur=null;MP.list=null;showDock(false);mUI();addLinks([{title:'Open on '+(o.t==='yt'?'YouTube':'Spotify'),url:o.url}]);note('🎧 player couldn\'t load: '+e.message);say('[sad]player won\'t load. i left you a link.');return}mUI();await say(pick([`[excited]bet. ${o.name}.`,'[happy]vibes on.','[winking]time for music.']))}
function mStopSoft(){mBack();MP.playing=false}
mk('t-music','<h4>My playlists</h4><div id="plist"></div><div class="memadd"><input id="plink" placeholder="paste a Spotify or YouTube link"><button id="padd">Add</button></div><h4>Play a song</h4><div class="memadd"><input id="psong" placeholder="song and artist"><button id="pgo">Play</button></div><p class="mt">Say "time for music" or "pull up my playlist" in chat. YouTube plays full songs. Spotify plays full songs only if you are logged in to Spotify in this browser, otherwise 30-second previews.</p>');
function libUI(){const L=$('plist');L.innerHTML='';const a=Z.lists||[];if(!a.length){L.innerHTML='<p class="mt">no playlists yet. paste a link below or in the chat.</p>';return}a.forEach((o,i)=>{const r=document.createElement('div');r.className='mi';const s=document.createElement('span');s.textContent=(o.t==='yt'?'▶ ':'🟢 ')+o.name;s.style.cursor='pointer';s.onclick=()=>{tabTo('chat');playList(o)};const x=document.createElement('button');x.textContent='✕';x.onclick=()=>{Z.lists.splice(i,1);save();libUI()};r.append(s,x);L.append(r)})}
$('padd').onclick=()=>{const u=$('plink').value.trim(),L=parseLink(u);if(!L){note('🎧 send a full open.spotify.com or youtube.com link');return}listAdd(L,u);$('plink').value=''};
$('pgo').onclick=()=>{const q=$('psong').value.trim();if(q){tabTo('chat');playSong(q)}};
/* songs */
function musicCard(d){const w=document.createElement('div');w.className='mw';const mc=document.createElement('div');mc.className='mc';mc.innerHTML='<div class="disc"></div><div class="art"><i>▶</i><b></b><small></small></div>';
 if(/^https:\/\/[^"')\s]+$/.test(d.cover||'')){mc.querySelector('.art').style.backgroundImage=`url("${d.cover}")`;mc.querySelector('.disc').style.setProperty('--cv',`url("${d.cover}")`)}
 mc.querySelector('b').textContent=d.title;mc.querySelector('small').textContent=d.artist;
 const cap=document.createElement('div');cap.className='cap';cap.textContent='♫ '+d.artist+' – '+d.title+(d.yt||d.sp?'':' · 30s preview');
 mc.onclick=()=>MP.card===mc?(MP.playing?mPause():mPlay()):playSong(d.title+' '+d.artist);
 w.append(mc,cap);log.append(w);log.scrollTop=log.scrollHeight;MP.card=mc}
async function playSong(q){
 const pl=(Z.lists||[]).find(x=>norm(x.name)&&norm(x.name)===norm(q));if(pl)return playList(pl);
 thinkStart('*finding the song...*');let d;
 try{const r=await fetch('/api/music?q='+encodeURIComponent(q));if(!r.ok){let m='HTTP '+r.status;try{m=(await r.json()).error||m}catch(e){}throw new Error(m)}d=await r.json()}
 catch(e){thinkStop();note('🎵 couldn\'t play "'+q+'" ('+e.message+')');say('[confused]couldn\'t find that one.');return}
 thinkStop();mStopSoft();if(MP.card)MP.card.classList.remove('playing');
 d.title=dec(d.title);d.artist=dec(d.artist);MP.cur=d;MP.list=null;showDock();
 try{if(d.yt)await ytLoad({kind:'video',id:d.yt.id});else if(d.sp)await spLoad({kind:'track',id:d.sp.id});else if(d.preview)auLoad(d);else{note('🎵 no playable source for that song');showDock(false);return}}catch(e){note('🎵 full player unavailable ('+e.message+'), playing the preview');if(d.preview){d.yt=null;d.sp=null;auLoad(d)}else{showDock(false);return}}
 musicCard(d);mUI();
 try{if('mediaSession' in navigator){navigator.mediaSession.metadata=new MediaMetadata({title:d.title,artist:d.artist,artwork:[{src:d.cover,sizes:'512x512'}]});navigator.mediaSession.setActionHandler('play',mPlay);navigator.mediaSession.setActionHandler('pause',mPause)}}catch(e){}
 SFX.ding();await say(pick([`[excited]bet. ${d.title}.`,`[happy]ayy, ${d.title}. good pick.`,'[winking]vibes on.']))}
async function musicCmd(t){let m;
 const um=t.match(/https?:\/\/[^\s]+/i);
 if(um&&!/(summari|explain|transcript|about this)/i.test(t)){const L=parseLink(um[0]);if(L){const o=listAdd(L,um[0]);note('🎧 saved to your playlists');await playList(o);return true}if(/spotify\.link|spotify|youtu/i.test(um[0])){say('[confused]can\'t read that link. send the full open.spotify.com or youtube.com link.');return true}}
 if(TIME.test(t)){if(MP.mode||(Z.lists||[]).length)showDock();if(/pull up|open|show|my playlists?/i.test(t))tabTo('music');const a=Z.lists||[];
  if(!a.length){say('[hmm]no playlist yet. send me a spotify or youtube link.');return true}
  const nm=a.find(x=>norm(x.name)&&norm(t).includes(norm(x.name))),o=nm||a.find(x=>x.id===Z.lastList)||a[a.length-1];
  if(nm||!MP.playing)await playList(o);else say('[happy]already on.');return true}
 if(MP.mode){
  if(/^\s*(stop|tigil)( the)?( music| song| kanta)?[.!]*\s*$/i.test(t)){mStop();say(pick(['[happy]music off.','[winking]aight, stopped.']));return true}
  if(/^\s*pause( the)?( music| song)?[.!]*\s*$/i.test(t)){mPause();say('[happy]paused.');return true}
  if(/^\s*(resume|unpause|continue)( the)?( music| song)?[.!]*\s*$/i.test(t)){mPlay();say('[happy]back on.');return true}
  if(/^\s*(next|skip)( song| track)?[.!]*\s*$/i.test(t)){mNext();say('[winking]next.');return true}
  if(/^\s*(previous|prev|go back)( song| track)?[.!]*\s*$/i.test(t)){mPrev();say('[happy]back.');return true}
  if(/^\s*shuffle( on| off)?[.!]*\s*$/i.test(t)){$('dksh').click();say(MP.shuf?'[happy]shuffle on.':'[happy]shuffle off.');return true}
  if(/\b(louder|volume up|turn it up)\b/i.test(t)){mVol(.15);say('[excited]louder.');return true}
  if(/\b(quieter|volume down|turn it down|lower the volume)\b/i.test(t)){mVol(-.15);say('[happy]lowered.');return true}}
 if(m=t.match(MR)){let q=m[1].trim();if(/^(some )?(music|a song|something|anything)$/i.test(q))q=pick(PICKS);await playSong(q);return true}
 return false}
/* volume knob, draggable video box, lyrics card */
const kn=$('dkv');let kd=null,pm=.7;
function mSetVol(v){MP.vol=Math.max(0,Math.min(1,v));if(MP.au)MP.au.volume=MP.vol;try{MP.yt&&MP.yt.setVolume(MP.vol*100)}catch(e){}kn.style.setProperty('--r',(-135+MP.vol*270)+'deg');kn.title='Volume '+Math.round(MP.vol*100)+'%'+(MP.mode==='sp'?' (Spotify controls its own volume)':'');try{localStorage.setItem('arzy-vol',MP.vol)}catch(e){}}
kn.onpointerdown=e=>{kn.setPointerCapture(e.pointerId);kd={y:e.clientY,v:MP.vol,m:0}};
kn.onpointermove=e=>{if(!kd)return;kd.m=Math.max(kd.m,Math.abs(kd.y-e.clientY));mSetVol(kd.v+(kd.y-e.clientY)/120)};
kn.onpointerup=()=>{if(kd&&kd.m<4){if(MP.vol>0){pm=MP.vol;mSetVol(0)}else mSetVol(pm||.7)}kd=null};
kn.onwheel=e=>{e.preventDefault();mSetVol(MP.vol+(e.deltaY<0?.05:-.05))};
try{mSetVol(parseFloat(localStorage.getItem('arzy-vol')??'.7'))}catch(e){mSetVol(.7)}
let yd=null;
yb.addEventListener('pointerdown',e=>{if(e.target.id!=='ytbar')return;e.preventDefault();const r=yb.getBoundingClientRect(),s=stage.getBoundingClientRect();yd={dx:e.clientX-r.left,dy:e.clientY-r.top,s};yb.style.cssText+=';right:auto;bottom:auto;left:'+(r.left-s.left)+'px;top:'+(r.top-s.top)+'px';e.target.setPointerCapture(e.pointerId)});
yb.addEventListener('pointermove',e=>{if(!yd)return;const s=yd.s;yb.style.left=Math.max(0,Math.min(s.width-yb.offsetWidth,e.clientX-s.left-yd.dx))+'px';yb.style.top=Math.max(0,Math.min(s.height-yb.offsetHeight,e.clientY-s.top-yd.dy))+'px'});
yb.addEventListener('pointerup',()=>{yd=null});
const ly=document.createElement('div');ly.id='lyr';
ly.innerHTML='<div id="lyh"><b>♫ Lyrics &amp; vibe</b><span>▾</span></div><div id="lyb"><div id="lyt"></div><div id="lys"></div><button id="lyq">What\'s it about?</button><div id="lya"></div><small>Lyrics open on licensed sites. Arzy can\'t print them here.</small></div>';stage.append(ly);
if(innerWidth<520)ly.classList.add('min');$('lyh').onclick=()=>ly.classList.toggle('min');
let lyKey='';const LC=new Map();
function lyricsUI(){const c=MP.cur;ly.style.display=c?'block':'none';if(!c){lyKey='';return}const k=(c.artist||'')+'|'+c.title;if(k===lyKey)return;lyKey=k;
 $('lyt').textContent=(c.artist?c.artist+' – ':'')+c.title;$('lys').textContent=LC.get(k)||'';$('lyq').style.display=LC.get(k)?'none':'inline-block';
 const q=encodeURIComponent(((c.artist||'')+' '+c.title).trim()),sp=c.sp&&c.sp.id?'https://open.spotify.com/track/'+c.sp.id:'https://open.spotify.com/search/'+q;
 const A=$('lya');A.innerHTML='';[['Spotify',sp],['Genius','https://genius.com/search?q='+q],['Google','https://www.google.com/search?q='+q+'+lyrics']].forEach(([n,u])=>{const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.textContent=n;A.append(a)})}
setInterval(lyricsUI,700);
$('lyq').onclick=async()=>{const c=MP.cur;if(!c)return;const k=(c.artist||'')+'|'+c.title;$('lyq').textContent='*thinking...*';let t='';
 try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content:`In 2 short lines, say what the song "${c.title}"${c.artist?' by '+c.artist:''} is about: theme and mood only, in your own words. Do NOT quote or reproduce any lyrics. If you don't know the song, say so.`}],memory:[],state:{study:true}})});if(r.ok)t=((await r.json()).text||'').replace(/\[[^\]]*\]/g,'').replace(/\s+/g,' ').trim().slice(0,320)}catch(e){}
 $('lyq').textContent='What\'s it about?';if(t){LC.set(k,t);if(lyKey===k){$('lys').textContent=t;$('lyq').style.display='none'}}else note('🎵 couldn\'t get a summary right now')};
/* audit: robustness, settings, voice, backup, accessibility */
window.addEventListener('error',e=>{if(Date.now()-(window._en||0)>30000){window._en=Date.now();try{note('⚠️ something glitched: '+String(e.message||'error').slice(0,60))}catch(x){}}});
const num=(v,d,a,b)=>{v=Number(v);return isFinite(v)?Math.max(a,Math.min(b,v)):d};
function sanitizeZ(){Z.wall=num(Z.wall,8,0,WALLS.length-1)|0;Z.floor=num(Z.floor,0,0,FLOORS.length-1)|0;Z.outfit=OUT[Z.outfit]?Z.outfit:null;
 const s=Z.st||{};Z.st={hap:num(s.hap,70,0,100),en:num(s.en,70,0,100),hun:num(s.hun,70,0,100)};
 Z.items=(Array.isArray(Z.items)?Z.items:[]).slice(0,60).map(i=>({e:String(i&&i.e||'').slice(0,8),x:num(i&&i.x,50,2,98),y:num(i&&i.y,60,8,96),s:num(i&&i.s,1,.4,3),f:i&&i.f?1:0})).filter(i=>i.e);
 Z.lists=(Array.isArray(Z.lists)?Z.lists:[]).slice(-30).filter(l=>l&&/^(yt|sp)$/.test(l.t)&&/^[\w-]{3,80}$/.test(l.id||'')&&/^(list|video|playlist|album|track|artist|show|episode)$/.test(l.kind||'')).map(l=>({t:l.t,kind:l.kind,id:l.id,url:String(l.url||'').slice(0,300),name:String(l.name||'playlist').slice(0,60)}));
 Z.mem={facts:(((Z.mem||{}).facts)||[]).filter(f=>f&&typeof f.t==='string').slice(-60).map(f=>({t:f.t.slice(0,140),d:String(f.d||'').slice(0,10)}))};
 Z.talk=['quiet','normal','chatty'].includes(Z.talk)?Z.talk:'normal';Z.lang=['english','taglish','tagalog'].includes(Z.lang)?Z.lang:'taglish'}
sanitizeZ();
{const away=(Date.now()-(Z.seen||Date.now()))/6e4;if(away>2){const f=Math.min(away,480);Z.st.hun=Math.max(10,Z.st.hun-f*.12);Z.st.en=Math.max(10,Z.st.en-f*.06);Z.st.hap=Math.max(15,Z.st.hap-f*.05)}}
/* chat history survives reloads */
const CK='arzy-chat';
function chatSave(u,a){try{const L=JSON.parse(localStorage.getItem(CK)||'[]');L.push(['u',u.slice(0,400)],['a',a.slice(0,600)]);localStorage.setItem(CK,JSON.stringify(L.slice(-60)))}catch(e){}while(log.children.length>160)log.firstChild.remove()}
function chatLoad(){try{const L=JSON.parse(localStorage.getItem(CK)||'[]');L.forEach(([r,t])=>{if(r==='u')userMsg(t);else msg('a','').textContent=t});HIST.push(...L.slice(-8).map(([r,t])=>({role:r==='u'?'user':'assistant',content:t})))}catch(e){}}
chatLoad();
/* images: paste, drop */
async function attachFile(f){if(!f||!f.type.startsWith('image/'))return note('📎 images only');if(f.size>10*1024*1024)return note('📎 that image is over 10 MB');try{PIC=await shrink(f);renderPic()}catch(e){note('📎 couldn\'t read that image')}}
fin.onchange=()=>{const f=fin.files[0];fin.value='';attachFile(f)};
document.addEventListener('paste',e=>{const f=[...((e.clipboardData||{}).files||[])].find(x=>x.type.startsWith('image/'));if(f){e.preventDefault();attachFile(f)}});
panel.addEventListener('dragover',e=>e.preventDefault());panel.addEventListener('drop',e=>{const f=[...((e.dataTransfer||{}).files||[])].find(x=>x.type.startsWith('image/'));if(f){e.preventDefault();attachFile(f)}});
/* voice input */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){const mb=document.createElement('button');mb.id='mic';mb.textContent='🎤';mb.title='Talk to Arzy';mb.setAttribute('aria-label','Voice input');att.after(mb);
 mb.onclick=()=>{const r=new SR();r.lang=Z.lang==='tagalog'?'fil-PH':(navigator.language||'en-US');r.interimResults=false;r.onstart=()=>mb.classList.add('rec');r.onend=()=>mb.classList.remove('rec');r.onerror=()=>note('🎤 couldn\'t hear that');r.onresult=e=>{$('txt').value=e.results[0][0].transcript;send()};try{r.start()}catch(e){}}}
/* settings, diagnostics, backup (Mind tab) */
{const s=document.createElement('div');
 s.innerHTML='<h4>Settings</h4><label class="row">Talkativeness<select id="setTalk"><option value="quiet">Quiet</option><option value="normal">Normal</option><option value="chatty">Chatty</option></select></label><label class="row">Language<select id="setLang"><option value="taglish">Taglish</option><option value="english">English</option><option value="tagalog">Tagalog</option></select></label><button id="chk" class="dng">Check AI connection</button> <button id="expb" class="dng">Export backup</button> <button id="impb" class="dng">Import backup</button> <button id="clrc" class="dng">Clear chat history</button><p class="mt" id="chkout"></p>';$('t-mem').append(s);
 $('setTalk').value=Z.talk;$('setLang').value=Z.lang;$('setTalk').onchange=e=>{Z.talk=e.target.value;save()};$('setLang').onchange=e=>{Z.lang=e.target.value;save()};
 $('chk').onclick=async()=>{const o=$('chkout');o.textContent='checking…';try{const r=await fetch('/api/chat?test=1'),j=await r.json();if(!r.ok)throw new Error(j.error||r.status);const L=[];for(const p in(j.test||{})){const t=j.test[p];L.push((t.ok?'✅ ':'❌ ')+p+' '+t.ms+'ms'+(t.ok?'':' – '+(t.error||t.why||'bad reply')))}if(!L.length)L.push('❌ no AI keys set');L.push('music: '+((j.music.youtube?'YouTube ':'')+(j.music.spotify?'Spotify ':'')||'previews only'));L.push('cloud sync: '+(j.sync?'on':'off'));o.textContent=L.join('\n')}catch(e){o.textContent='❌ '+e.message}};
 $('expb').onclick=()=>{const b=new Blob([JSON.stringify({arzy:1,data:Z},null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='arzy-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
 const imp=document.createElement('input');imp.type='file';imp.accept='application/json';imp.hidden=true;document.body.append(imp);$('impb').onclick=()=>imp.click();
 imp.onchange=async()=>{const f=imp.files[0];imp.value='';if(!f||f.size>2e5)return note('⚠️ backup file missing or too big');try{const j=JSON.parse(await f.text());if(!j.arzy||!j.data)throw 0;Object.assign(Z,j.data);sanitizeZ();Z.ts=Date.now();saveLocal();refreshAll();note('✅ backup restored')}catch(e){note('⚠️ that doesn\'t look like an Arzy backup')}};
 $('clrc').onclick=()=>{try{localStorage.removeItem(CK)}catch(e){}log.innerHTML='';HIST.length=0;note('chat history cleared')}}
/* accessibility */
[['send','Send message'],['bgb','Change background'],['mute','Toggle sound']].forEach(([i,l])=>$(i).setAttribute('aria-label',l));
log.setAttribute('role','log');log.setAttribute('aria-live','polite');$('txt').setAttribute('aria-label','Message Arzy');att.setAttribute('aria-label','Attach image');hb.setAttribute('aria-label','Music toolbar');
['dksh','dkpv','dkpp','dknx','dkrp','dkx'].forEach((i,k)=>$(i).setAttribute('aria-label',['Shuffle','Previous','Play or pause','Next','Repeat','Hide toolbar'][k]));
kn.setAttribute('role','slider');kn.setAttribute('aria-label','Volume');kn.tabIndex=0;kn.onkeydown=e=>{if(e.key==='ArrowUp'||e.key==='ArrowRight')mSetVol(MP.vol+.05);if(e.key==='ArrowDown'||e.key==='ArrowLeft')mSetVol(MP.vol-.05)};
[...tb.children].forEach(b=>b.setAttribute('role','tab'));
{const w=$('wake');w.tabIndex=0;w.setAttribute('role','button');w.setAttribute('aria-label','Wake Arzy');w.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')w.click()}}
/* installable app */
if('serviceWorker' in navigator&&!window.SPRITE_DATA&&location.protocol==='https:')navigator.serviceWorker.register('/sw.js').catch(()=>{});
/* boot */
(function(){const p=document.querySelector('.pill');p.insertAdjacentHTML('afterbegin','<img src="logo.svg" alt="">');p.title='Azrel Seth M. Villeza';$('wake').querySelector('h1').insertAdjacentHTML('afterend','<p style="letter-spacing:.12em;font-size:13px">AZREL SETH M. VILLEZA</p>');$('wake').querySelector('h1').innerHTML='<img src="logo.svg" alt=""> ARZY';
 $('emotes').innerHTML='';Object.keys(E).forEach(k=>{const x=document.createElement('button');x.className='em';x.innerHTML=`<img src="${S[k]}" alt=""><span>${E[k].l}</span>`;x.onclick=()=>say(`[${k}]${E[k].line}`);$('emotes').append(x)});
 const nm=Z.mem.facts.map(f=>f.t.match(/name is ([a-z]+)/i)).find(Boolean);if(nm)user=nm[1];applyHome();furn();bars();memUI();libUI();if(CODE){$('codein').placeholder='connected ✓';syncNow().finally(()=>{BOOT=false})}else BOOT=false;setOutfit(Z.outfit,1);
 $('wake').addEventListener('click',()=>setTimeout(()=>{setBg(BG.indexOf('home'));setOutfit(Z.outfit,1);if(Z.mem.facts.length)say(`[happy]ayy, welcome back${user?', '+user:''}.`)},60));
 setInterval(()=>adj({hun:-.25,en:-.15,hap:(Z.st.hun<30||Z.st.en<20)?-.3:-.08}),15000);
 setInterval(()=>{if($('wake')||(typeof MP!=='undefined'&&MP.playing)||Date.now()-lastAct<({quiet:150000,normal:80000,chatty:40000}[Z.talk]||80000))return;const s=Z.st;if(s.hun<30)say('[sad]hungry. feed me?');else if(s.en<25)say('[sleepy]sleepy.');else if(Math.random()<.22&&!Z.mem.facts.some(f=>/no religio/i.test(f.t)))say(pick(FAITH));else if(Math.random()<.3)doAct(pick(Object.keys(ACT)))},7000)})();
