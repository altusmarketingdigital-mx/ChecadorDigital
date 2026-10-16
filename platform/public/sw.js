// Service Worker para ALTUS Checador Digital PWA (Optimizado para iOS y Android)
const CACHE_NAME = 'altus-checador-v2';

self.addEventListener('install', (event) => {
  // Activar inmediatamente este nuevo Service Worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpiar cachés anteriores corruptas o vacías
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// IMPORTANTE: NO interceptar 'fetch' con respondWith() si no hay estrategia offline estricta.
// En iOS WebKit, devolver 'undefined' en catch() de respondWith provoca una pantalla blanca permanente (White Screen of Death).
// Dejamos que el navegador maneje las peticiones de red a través de la pila nativa del sistema operativo:
self.addEventListener('fetch', (event) => {
  // Pasar a la red nativa directamente
  return;
});

// Manejo de Notificaciones Push nativas en iOS y Android
self.addEventListener('push', (event) => {
  let data = { title: 'ALTUS Checador', body: 'Nuevo registro de asistencia' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/logo-altus.jpg',
    badge: '/logo-altus.jpg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'ALTUS Checador', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
