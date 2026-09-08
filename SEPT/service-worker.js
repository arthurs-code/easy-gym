const CACHE_PREFIX='easy-gym-pwa-test:'+encodeURIComponent(self.registration.scope)+':';
const CACHE=CACHE_PREFIX+'v315x-r1';
const ASSETS=[
  './','./index.html','./manifest.json','./styles.css','./responsive.css','./responsive.js','./script_0.js','./script_1.js','./script_2.js',
  './lang/config.js','./lang/loader.js','./lang/en.js','./lang/de.js','./lang/fr.js','./lang/it.js','./lang/es.js',
  './info/en.html','./info/de.html','./info/fr.html','./info/it.html','./info/es.html','./info/README_INFO_TEXTS.txt','./README_GITHUB_PWA_V315X.txt',
  './icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||(e.request.mode==='navigate'?c.match('./index.html'):Response.error())))));});
