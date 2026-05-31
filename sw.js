const CACHE_VERSION = 'mhs-v1.0';
const CACHE_NAME = `mi-hogar-sid-${CACHE_VERSION}`;
const FILES_TO_CACHE = [
  './index.html','./manifest.json','./icon-192.png','./icon-512.png',
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/docx.umd.min.js',
  'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES_TO_CACHE).catch(e=>console.warn(e))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached)return cached;
    return fetch(event.request).then(response=>{
      if(!response||response.status!==200)return response;
      const clone=response.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(event.request,clone));
      return response;
    }).catch(()=>{if(event.request.destination==='document')return caches.match('./index.html');});
  }));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
