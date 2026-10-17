// Der Gründungsnavigator ist nach https://felixinberlin.github.io/jobcenter-hilfe/ umgezogen.
// Dieser Service Worker ersetzt den alten, leert dessen Speicher und meldet sich ab.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('gruendungsnavigator-')) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
  })());
});
