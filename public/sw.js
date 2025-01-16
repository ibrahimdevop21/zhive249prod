const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
  static: `static-${CACHE_VERSION}`,
  pages: `pages-${CACHE_VERSION}`,
  assets: `assets-${CACHE_VERSION}`,
};

const OFFLINE_URL = '/offline';
const OFFLINE_IMAGE = '/images/offline.svg';

// Assets that should be cached immediately
const STATIC_ASSETS = [
  '/offline',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/fonts/SpaceGrotesk.woff2',
  OFFLINE_IMAGE,
];

// Assets that should always go to network first
const NETWORK_FIRST_PATTERNS = [
  /\/$/, // Homepage
  /\/api\//, // API routes
  /\.(astro|html)$/, // Astro/HTML pages
];

// Assets that should use cache first
const CACHE_FIRST_PATTERNS = [
  /\.(woff2?|ttf|eot)$/, // Fonts
  /\.(png|jpg|jpeg|gif|svg|ico|webp)$/, // Images
  /\.(css|js)$/, // Styles and scripts
];

// Helper function to determine if URL matches patterns
function matchesPatterns(url, patterns) {
  return patterns.some((pattern) => pattern.test(url.pathname));
}

// Helper function to fetch and cache
async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);

    // Only cache successful GET responses
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Let the error propagate
    throw error;
  }
}

// Network-first strategy with timeout
async function networkFirstWithTimeout(request, timeout = 3000) {
  try {
    // Try network first with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), timeout);
    });

    const networkResponse = await Promise.race([
      fetch(request),
      timeoutPromise,
    ]);

    // Cache successful responses
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAMES.pages);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // On failure, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a navigation request, return offline page
    if (request.mode === 'navigate') {
      const cache = await caches.open(CACHE_NAMES.static);
      return cache.match(OFFLINE_URL);
    }

    throw error;
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cache = await caches.match(request);
  if (cache) {
    return cache;
  }
  return fetchAndCache(request, CACHE_NAMES.assets);
}

// Clear old caches
async function clearOldCaches() {
  const cacheKeys = await caches.keys();
  const validCacheKeys = Object.values(CACHE_NAMES);

  return Promise.all(
    cacheKeys
      .filter((key) => !validCacheKeys.includes(key))
      .map((key) => caches.delete(key))
  );
}

// Install event handler
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAMES.static);
      await cache.addAll(STATIC_ASSETS);
      await self.skipWaiting();
    })()
  );
});

// Activate event handler
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([clearOldCaches(), self.clients.claim()]));
});

// Fetch event handler
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Handle different request types
  event.respondWith(
    (async () => {
      try {
        // Network-first for navigation and API requests
        if (matchesPatterns(url, NETWORK_FIRST_PATTERNS)) {
          return await networkFirstWithTimeout(event.request);
        }

        // Cache-first for static assets
        if (matchesPatterns(url, CACHE_FIRST_PATTERNS)) {
          return await cacheFirst(event.request);
        }

        // Default to network-first
        return await networkFirstWithTimeout(event.request);
      } catch (error) {
        // Handle offline scenarios
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAMES.static);
          return cache.match(OFFLINE_URL);
        }

        if (event.request.destination === 'image') {
          const cache = await caches.open(CACHE_NAMES.static);
          return cache.match(OFFLINE_IMAGE);
        }

        throw error;
      }
    })()
  );
});
