// sw.js - Service Worker for CoCo
self.addEventListener('install', (e) => {
  console.log('CoCo Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  // This allows the app to work over HTTPS
  e.respondWith(fetch(e.request));
});
