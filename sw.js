// ==========================================================
// SERVICE WORKER — app-shell caching so the site is installable
// ==========================================================

const CACHE_VERSION = 'heypercentage-v7';

const CORE_ASSETS = [
    'index.html',
    'socials.html',
    'songs.html',
    'produced.html',
    'vault.html',
    'support.html',
    'style.css',
    'js/nav.js',
    'js/releases.js',
    'js/view-modes.js',
    'js/vault.js',
    'data/releases.js',
    'css/view-modes.css',
    'js/songs-filter.js',
    'js/song-links.js',
    'js/platform-picker.js',
    'js/register-sw.js',
    'site.webmanifest',
    'vendor/fontawesome/css/all.min.css',
    'fonts/dm-sans-200.woff2',
    'fonts/dm-sans-400.woff2',
    'fonts/dm-sans-500.woff2',
    'fonts/dm-sans-600.woff2',
    'fonts/dm-sans-700.woff2',
    'fonts/dm-sans-800.woff2',
    'fonts/dm-sans-900.woff2',
    'logo.png',
    'favicon.ico',
    'favicon-32x32.png',
    'favicon-16x16.png',
    'apple-touch-icon.png',
    'icons/icon-192.png',
    'icons/icon-512.png',
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

    const url = new URL(event.request.url);

    // Release schedule: always try the network first so new dates show up
    // without bumping CACHE_VERSION. Falls back to the cached copy offline.
    if (url.pathname.endsWith('/data/releases.js')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Audio snippets: stream straight from the network (partial 206 responses can't be cached)
    if (url.pathname.includes('/snips/')) return;

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
