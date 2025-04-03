const VERSION = "v6";
const CACHE_NAME = `learner-hours-${VERSION}`;
const BASE_PATH = "/LearnerLog"

const APP_STATIC_RESOURCES = [
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/main.css`,
  `${BASE_PATH}/app.js`,
  // Functions
  `${BASE_PATH}/scripts/functions/convertTo12HourFormat.js`,
  `${BASE_PATH}/scripts/functions/convertToHoursMinutes.js`,
  `${BASE_PATH}/scripts/functions/dateValid.js`,
  `${BASE_PATH}/scripts/functions/formatDate.js`,
  `${BASE_PATH}/scripts/functions/getAllStoredSessions.js`,
  `${BASE_PATH}/scripts/functions/resetErrors.js`,
  `${BASE_PATH}/scripts/functions/storeEditedSession.js`,
  `${BASE_PATH}/scripts/functions/storeNewSession.js`,
  `${BASE_PATH}/scripts/functions/timeValid.js`,
  // Components
  `${BASE_PATH}/scripts/components/editSessionModal.js`,
  `${BASE_PATH}/scripts/components/pastSessionItem.js`,
  `${BASE_PATH}/scripts/components/toast.js`,
  // Assets
  `${BASE_PATH}/assets/branding/LearnerLog.svg`
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
  // For navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        // Return the actual page if found in cache
        if (cachedResponse) {
          return cachedResponse;
        }

        // Try network
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }
        } catch (error) {
          // Network failed
        }

        // If all else fails, return index.html as fallback
        return cache.match(`${BASE_PATH}/index.html`);
      })()
    );
  }

  // For all other requests, use cache-first then network strategy
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        // Not in cache, try the network
        const networkResponse = await fetch(event.request);

        // Cache the response for future use
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Network failed, return a fallback or error
        return new Response("Network error", {status: 408});
      }
    })()
  );
});