// Service Worker for Habitat Lobby
const CACHE_NAME = 'habitat-lobby-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Only cache essential files, not external resources
        return cache.addAll([
          '/',
          '/index.html',
          '/favicon.svg',
          '/favicon.ico'
        ]);
      })
  );
});

// Fetch event - Network first, cache fallback
self.addEventListener('fetch', (event) => {
  // Skip chrome-extension requests (they can't be cached)
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Skip all external resources to avoid CSP issues
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com') ||
      event.request.url.includes('js.stripe.com') ||
      event.request.url.includes('api.stripe.com') ||
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('images.unsplash.com') ||
      event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('googletagmanager.com')) {
    return;
  }

  // Only handle same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses for static assets
          if (response.status === 200 && event.request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            }).catch((error) => {
              console.warn('Failed to cache response:', error);
            });
          }
          return response;
        })
        .catch((error) => {
          console.warn('Fetch failed, trying cache:', error);
          // Fallback to cache for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return caches.match(event.request);
        })
    );
  }
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
