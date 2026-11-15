// Guarda la app en el teléfono para que abra sin internet.
// Al publicar una versión nueva, cambia el número de CACHE para que los teléfonos la descarguen.
const CACHE = 'centro-control-v4';
const ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) =>
      hit ||
      fetch(e.request)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copia));
          return res;
        })
        .catch(() => caches.match('index.html'))
    )
  );
});
