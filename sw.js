const V='arzy-v3',CORE=['/','/index.html','/plus.js','/plus.css','/logo.svg','/manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return;
  const keep=r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r};
  if(u.pathname.startsWith('/assets/')){e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(keep)));return}
  e.respondWith(fetch(e.request).then(keep).catch(()=>caches.match(e.request).then(h=>h||caches.match('/index.html'))));
});
