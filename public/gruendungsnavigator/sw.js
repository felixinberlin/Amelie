// Gründungsnavigator ist seit 24.10.2026 aus dem öffentlichen Geschenkbestand entfernt.
// Nur Cache-Abbau für frühere Installationen; keine App und keine Vorschau.
// Dieser Service Worker ersetzt den alten, leert dessen Speicher und meldet sich ab.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('gruendungsnavigator-')) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
  })());
});
