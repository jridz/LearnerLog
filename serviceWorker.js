// Define a unique cache name for this version of the app
const CACHE_NAME = 'learnerlog-cache-v1';

// List of resources to cache (adjust this based on your app's file structure)
const urlsToCache = [
  '/LearnerLog/',
  '/LearnerLog/index.html',
  '/LearnerLog/styles/main.css',
  '/LearnerLog/scripts/main.js',
  '/LearnerLog/images/logo.png',
  // Add all other static resources used by your app here
];

// Install event: Cache all specified resources when the service worker is installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching resources');
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.error('Caching failed:', error))
  );
});

// Activate event: Clean up old caches to keep only the current version
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached resources or fetch from network as a fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return the cached response if available, otherwise fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Optional: Return a fallback offline page if both cache and network fail
        // For simplicity, this is omitted here
      })
  );
});