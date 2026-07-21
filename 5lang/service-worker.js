const CACHE='easy-gym-pwa-v251x-fixed-shell-stacked-cards-r1';
const ASSETS=[
  './','./index.html','./manifest.json','./script_0.js','./script_1.js','./script_2.js',
  './lang/config.js','./lang/loader.js','./lang/en.js','./lang/de.js','./lang/fr.js','./lang/it.js','./lang/es.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('easy-gym-')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));});
