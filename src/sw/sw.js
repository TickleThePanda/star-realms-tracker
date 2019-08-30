const VERSION_NAME = '///version///';

const APP_CACHE_NAME = 'app-' + VERSION_NAME;

const URLS_TO_CACHE = [
    '/',
    '/main.js',
    '/main.css',
    '/images/galaxy-background.jpg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(APP_CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== APP_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
