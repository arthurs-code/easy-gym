// Cache scope stays isolated to this published PWA directory, as in v316X.
const CACHE_PREFIX='easy-gym-pwa-test:'+encodeURIComponent(self.registration.scope)+':';
const CACHE=CACHE_PREFIX+"v319x-fdab091c1dcd9312";
const ASSETS=[
  "./",
  "./css/base.css",
  "./css/base.css?v=319X",
  "./css/custom.css",
  "./css/custom.css?v=319X",
  "./css/responsive.css",
  "./css/responsive.css?v=319X",
  "./generated/content.js",
  "./generated/content.js?v=319X",
  "./icons/easy-gym-lockup.svg",
  "./icons/easy-gym-lockup.svg?v=319X",
  "./icons/favicon-32.png",
  "./icons/favicon-32.png?v=319X",
  "./icons/header-logo.png",
  "./icons/icon-180.png",
  "./icons/icon-180.png?v=319X",
  "./icons/icon-192.png",
  "./icons/icon-192.png?v=319X",
  "./icons/icon-512.png",
  "./icons/icon-512.png?v=319X",
  "./icons/maskable-512.png",
  "./icons/maskable-512.png?v=319X",
  "./index.html",
  "./info/de.html",
  "./info/de.html?v=319X",
  "./info/en.html",
  "./info/en.html?v=319X",
  "./info/es.html",
  "./info/es.html?v=319X",
  "./info/fr.html",
  "./info/fr.html?v=319X",
  "./info/it.html",
  "./info/it.html?v=319X",
  "./js/app.js",
  "./js/app.js?v=319X",
  "./js/responsive.js",
  "./js/responsive.js?v=319X",
  "./js/service-worker-registration.js",
  "./js/service-worker-registration.js?v=319X",
  "./js/theme.js",
  "./js/theme.js?v=319X",
  "./lang/loader.js",
  "./lang/loader.js?v=319X",
  "./manifest.json",
  "./manifest.json?v=319X"
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
