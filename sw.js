const VERSION = "v10";
const CACHE_NAME = `learner-hours-${VERSION}`;
const BASE_PATH = "/LearnerLog"

const APP_STATIC_RESOURCES = [
  // Global
  `${BASE_PATH}/main.css`,
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/assets/branding/LearnerLog.svg`,
  `${BASE_PATH}/assets/fonts/inter_variable.ttf`,
  `${BASE_PATH}/assets/fonts/inter_italic_variable.tff`,

  // Index
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/scripts/index.js`,
  `${BASE_PATH}/styles/index.css`,

  // Settings
  `${BASE_PATH}/settings.html`,
  `${BASE_PATH}/scripts/settings.js`,
  `${BASE_PATH}/styles/settings.css`,
];

// Install event: cache static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      // Open the specified cache
      const cache = await caches.open(CACHE_NAME);
      // Add all static files to the cache
      await cache.addAll(APP_STATIC_RESOURCES);
    })() // Immediately invoke the async function
  );
});

// Activate event: delete old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Get a list of all the caches
      const names = await caches.keys();
      // Go through the list
      await Promise.all(
        names.map((name) => {
          // Check if it is not the current cache
          if (name !== CACHE_NAME) {
            // Delete it
            return caches.delete(name);
          }
        })
      );
      // Set the current service worker as the controller
      await clients.claim();
    })()
  );
});

// Fetch event: intercept server requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      // Check if the request is for a static resource
      if (APP_STATIC_RESOURCES.includes(new URL(event.request.url).pathname)) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        // If found in cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not found in cache, fetch from network
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            await cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        } catch (error) {
          console.error("Network error:", error);
        }
      }

      // Fallback to network if not a static resource
      return fetch(event.request);
    })()
  );
});