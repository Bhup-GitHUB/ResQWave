// service-worker.js

const CACHE_NAME = 'resqwave-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/uploads/', // Cache photo uploads
  '/socket.io/socket.io.js'
];

// Install the service worker and cache necessary assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercept fetch requests to serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return cached content if available
        }
        return fetch(event.request); // Fetch from network if not cached
      })
  );
});

// Sync offline requests when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncRequests') {
    event.waitUntil(syncOfflineRequests());
  }
});

// Sync offline data to the server
async function syncOfflineRequests() {
  const db = await openIndexedDB();
  const transaction = db.transaction(['requests'], 'readwrite');
  const objectStore = transaction.objectStore('requests');
  const requests = await getAllRequests(objectStore);

  requests.forEach((request) => {
    fetch('/submit', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(() => {
      deleteRequest(objectStore, request.id);
    });
  });
}

// Helper functions to interact with IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('offlineRequests', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function getAllRequests(objectStore) {
  return new Promise((resolve, reject) => {
    const request = objectStore.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function deleteRequest(objectStore, id) {
  const request = objectStore.delete(id);
  
  request.onerror = () => console.error('Error deleting request:', request.error);
  request.onsuccess = () => console.log(`Request ${id} successfully deleted`);
}
