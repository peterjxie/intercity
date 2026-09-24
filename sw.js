// INTERCITY service worker: cache on first load, serve from cache, refresh in the background when online.
const CACHE='intercity-0.898';const SHELL=['./','./index.html','./manifest.webmanifest','./intercity-icon-833.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){net.catch(()=>{});return hit}const res=await net;if(res)return res;
  return r.mode==='navigate'?(await c.match('./index.html'))||Response.error():Response.error()}))});
