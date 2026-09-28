// Cache scope stays isolated to this published PWA directory, as in v316X.
const CACHE_PREFIX='easy-gym-pwa-test:'+encodeURIComponent(self.registration.scope)+':';
const CACHE=CACHE_PREFIX+"v323x-8f183adb9c434a41";
const ASSETS=[
  "./",
  "./css/base.css",
  "./css/base.css?v=323X",
  "./css/custom.css",
  "./css/custom.css?v=323X",
  "./css/responsive.css",
  "./css/responsive.css?v=323X",
  "./generated/content.js",
  "./generated/content.js?v=323X",
  "./icons/easy-gym-lockup.svg",
  "./icons/easy-gym-lockup.svg?v=323X",
  "./icons/favicon-32.png",
  "./icons/favicon-32.png?v=323X",
  "./icons/header-logo.png",
  "./icons/icon-180.png",
  "./icons/icon-180.png?v=323X",
  "./icons/icon-192.png",
  "./icons/icon-192.png?v=323X",
  "./icons/icon-512.png",
  "./icons/icon-512.png?v=323X",
  "./icons/maskable-512.png",
  "./icons/maskable-512.png?v=323X",
  "./index.html",
  "./info/de.html",
  "./info/de.html?v=323X",
  "./info/en.html",
  "./info/en.html?v=323X",
  "./info/es.html",
  "./info/es.html?v=323X",
  "./info/fr.html",
  "./info/fr.html?v=323X",
  "./info/it.html",
  "./info/it.html?v=323X",
  "./js/app.js",
  "./js/app.js?v=323X",
  "./js/header-layout.js",
  "./js/header-layout.js?v=323X",
  "./js/responsive.js",
  "./js/responsive.js?v=323X",
  "./js/service-worker-registration.js",
  "./js/service-worker-registration.js?v=323X",
  "./js/theme.js",
  "./js/theme.js?v=323X",
  "./lang/loader.js",
  "./lang/loader.js?v=323X",
  "./manifest.json",
  "./manifest.json?v=323X"
];
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
