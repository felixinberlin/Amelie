// Gründungsnavigator: Offline-Speicher. Lizenz: CC0 1.0 Public Domain.
//
// Ziel: Die Seiten funktionieren im Wartebereich des Jobcenters auch ohne Netz.
// Strategie: Seiten zuerst aus dem Netz (damit Korrekturen an Normtexten sofort
// ankommen), bei Ausfall aus dem Speicher. Symbol und Manifest aus dem Speicher.
// Persönliche Eingaben liegen im localStorage, nie hier.
const CACHE = 'gruendungsnavigator-2026-10-16';
const DATEIEN = ['./', './index.html', './fall-landkarte.html', './jobcenter-hilfe.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('gruendungsnavigator-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const istSeite = req.mode === 'navigate' || req.destination === 'document';
  if (istSeite) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const kopie = res.clone(); caches.open(CACHE).then((c) => c.put(req, kopie)); }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('./index.html'))),
    );
  } else {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});
