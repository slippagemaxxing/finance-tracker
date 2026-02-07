// Service Worker for Finance Tracker PWA
// Version 1.0

const CACHE_NAME = ‘finance-tracker-v1’;
const urlsToCache = [
‘./’,
‘./index.html’,
‘./styles.css’,
‘./app.js’,
‘./manifest.json’,
‘https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js’
];

// Install event - cache resources
self.addEventListener(‘install’, (event) => {
event.waitUntil(
caches.open(CACHE_NAME)
.then((cache) => {
console.log(‘Opened cache’);
return cache.addAll(urlsToCache);
})
.catch((error) => {
console.error(‘Cache installation failed:’, error);
})
);
self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener(‘activate’, (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cacheName) => {
if (cacheName !== CACHE_NAME) {
console.log(‘Deleting old cache:’, cacheName);
return caches.delete(cacheName);
}
})
);
})
);
self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener(‘fetch’, (event) => {
event.respondWith(
caches.match(event.request)
.then((response) => {
// Cache hit - return response
if (response) {
return response;
}

```
            // Clone the request
            const fetchRequest = event.request.clone();
            
            return fetch(fetchRequest).then((response) => {
                // Check if valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                
                // Clone the response
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                
                return response;
            });
        })
        .catch(() => {
            // Offline fallback - could return a custom offline page here
            console.log('Fetch failed; returning offline page instead.');
        })
);
```

});

// Background sync for future features (optional)
self.addEventListener(‘sync’, (event) => {
if (event.tag === ‘sync-transactions’) {
event.waitUntil(syncTransactions());
}
});

async function syncTransactions() {
// Placeholder for future sync functionality
console.log(‘Syncing transactions…’);
}

// Push notifications (optional for future reminders)
self.addEventListener(‘push’, (event) => {
const options = {
body: event.data ? event.data.text() : ‘New notification’,
icon: ‘data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">💰</text></svg>’,
badge: ‘data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">💰</text></svg>’,
vibrate: [200, 100, 200],
tag: ‘finance-tracker’,
requireInteraction: false
};

```
event.waitUntil(
    self.registration.showNotification('Finance Tracker', options)
);
```

});

// Notification click handler
self.addEventListener(‘notificationclick’, (event) => {
event.notification.close();

```
event.waitUntil(
    clients.openWindow('/')
);
```

});