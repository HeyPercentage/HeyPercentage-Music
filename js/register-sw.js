// ==========================================================
// SERVICE WORKER REGISTRATION (required for "Add to Home Screen")
// ==========================================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch((err) => {
            console.warn('Service worker registration failed:', err);
        });
    });
}
