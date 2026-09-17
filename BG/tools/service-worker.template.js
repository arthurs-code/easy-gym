// Cache scope stays isolated to this published PWA directory, as in v316X.
const CACHE_PREFIX='easy-gym-pwa-test:'+encodeURIComponent(self.registration.scope)+':';
const CACHE=CACHE_PREFIX+__CACHE_NAME__;
const ASSETS=__ASSET_LIST__;
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    const copy=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return r;
  }).catch(()=>caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||(e.request.mode==='navigate'?c.match('./index.html'):Response.error())))));
});
