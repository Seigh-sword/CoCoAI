
self.addEventListener('install', (e) => {
  console.log('CoCo Service Worker Installed');
});

self.addEventListener('fetch', (e) => {

  e.respondWith(fetch(e.request));
});
