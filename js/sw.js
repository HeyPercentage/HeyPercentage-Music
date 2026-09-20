// ==========================================================
// SERVICE WORKER — app-shell caching so the site is installable
// ==========================================================

const CACHE_VERSION = 'heypercentage-v1';

const CORE_ASSETS = [
    'index.html',
    'socials.html',
    'songs.html',
    'produced.html',
    'vault.html',
    'support.html',
    'style.css',
    'js/nav.js',
    'js/countdown.js',
    'js/songs-filter.js',
    'js/player.js',
    'js/register-sw.js',
    'site.webmanifest',
    'logo.png',
    'favicon.ico',
    'favicon-32x32.png',
    'favicon-16x16.png',
    'apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) =>
            // Don't let one missing/renamed asset (e.g. a cover image) block install
            Promise.allSettled(CORE_ASSETS.map((asset) => cache.add(asset)))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_VERSION)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Cache-first for core assets, network-first fallback for everything else
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request)
                .then((response) => {
                    // Only cache successful, same-origin responses
                    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
                        const clone = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match('index.html'));
        })
    );
});
