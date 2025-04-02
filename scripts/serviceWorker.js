const VERSION = "v3";
const CACHE_NAME = `learnerlog-${VERSION}`;

const APP_STATIC_RESOURCES = [
  "/LearnerLog/",
  "/LearnerLog/index.html",
  "/LearnerLog/statistics.html",
  "/LearnerLog/settings.html",

  "/LearnerLog/styles/main.css",
  "/LearnerLog/assets/branding/LearnerLog.svg",
  "/LearnerLog/manifest.json",

  "/LearnerLog/scripts/app.js",
  // Functions
  "/LearnerLog/scripts/functions/convertTo12HourFormat.js",
  "/LearnerLog/scripts/functions/convertToHoursMinutes.js",
  "/LearnerLog/scripts/functions/dateValid.js",
  "/LearnerLog/scripts/functions/formatDate.js",
  "/LearnerLog/scripts/functions/getAllStoredSessions.js",
  "/LearnerLog/scripts/functions/resetErrors.js",
  "/LearnerLog/scripts/functions/storeEditedSession.js",
  "/LearnerLog/scripts/functions/storeNewSession.js",
  "/LearnerLog/scripts/functions/timeValid.js",
  // Components
  "/LearnerLog/scripts/components/editSessionModal.js",
  "/LearnerLog/scripts/components/pastSessionItem.js",
  "/LearnerLog/scripts/components/toast.js",
];

// Install event: cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Add all static files to the cache
      await cache.addAll(APP_STATIC_RESOURCES);
      // Force the waiting service worker to become the active service worker
      await self.skipWaiting();
    })()
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Get all cache keys
      const cacheKeys = await caches.keys();
      // Delete old caches
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      // Take control of all clients as soon as the service worker activates
      await clients.claim();
    })()
  );
});

// Fetch event: network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // For navigation requests, try the network first
      if (event.request.mode === "navigate") {
        try {
          // Try network first
          const networkResponse = await fetch(event.request);
          // Update cache with fresh response
          await cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // If network fails, fall back to cache
          const cachedResponse = await cache.match("/LearnerLog/index.html");
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response("Navigation failed and no cached version available", {
            status: 503,
            statusText: "Service Unavailable"
          });
        }
      }

      // For non-navigation requests, try cache first
      else {
        // Check cache first
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, try network
        try {
          const networkResponse = await fetch(event.request);
          // Cache the response for future use
          if (networkResponse.ok) {
            await cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // If both cache and network fail, return a fallback response or error
          return new Response("Resource not available offline", {
            status: 504,
            statusText: "Network Error"
          });
        }
      }
    })()
  );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});