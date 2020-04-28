const cacheName = 'pprmnt-1.0.6';

const thingsToCache = [
  '/',
  './index.html',
  './favicon.df682a99.ico',
  './manifest.webmanifest',
  './peppermint.wasm', // generated by emscripten, outside of parcel
  './peppermint.js', // generated by emscripten, outside of parcel
  './src.e31bb0bc.js', // generated by parcel, the "hash" stays the same between builds,
  './peppermint.worker.f4a6b94e.js', // generated by parcel, the "hash" stays the same between builds,
  './InputMono-Regular.6e8cbed8.woff2', // generated by parcel, the "hash" stays the same between builds,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => cache.addAll(thingsToCache))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(() => {
    // do cleanup of stale cache
    return Promise.all(
      caches
        .keys()
        .map((key) => (key !== cacheName ? caches.delete(key) : null)),
    );
  });
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches
        .open(cacheName)
        .then((cache) => cache.match(e.request), { ignoreSearch: true })
        .then((res) => res);
    }),
  );
});
