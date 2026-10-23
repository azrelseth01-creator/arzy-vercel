// Static checks: node tests/static.js
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');let fail=0;
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const f of ['plus.js','sw.js','api/chat.js','api/music.js','api/memory.js','api/_lib.js']){try{new Function(fs.readFileSync(path.join(root,f),'utf8'));ok(1,'parses '+f)}catch(e){ok(0,f+': '+e.message)}}
try{new Function(fs.readFileSync(path.join(root,'index.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1]);ok(1,'parses index.html script')}catch(e){ok(0,'index.html: '+e.message)}
const sp=fs.readdirSync(path.join(root,'assets/sprites'));ok(sp.length>=60,'60+ sprites ('+sp.length+')');
for(const k of 'talking pointing happy laughing surprised thinking confused tired excited winking angry bye mouth0 mouth4 hoodie eating gaming shocked'.split(' '))ok(sp.includes(k+'.webp'),'sprite '+k);
const c=require('../api/chat.js');
ok(c.bad('User Safety: safe\nResponse Safety: safe'),'rejects safety-label output');ok(c.bad(''),'rejects empty');ok(c.bad('VOICE: x\nFAITH: y'),'rejects prompt dump');ok(!c.bad('[happy]yo. [winking]sup.'),'accepts normal reply');
ok(c.uniq([{url:'https://a.com'},{url:'https://a.com'},{url:'javascript:alert(1)'}]).length===1,'dedupes and filters links');
process.exit(fail?1:0);
