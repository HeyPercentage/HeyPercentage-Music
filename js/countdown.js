// ==========================================================
// COUNTDOWN CLOCK
// ==========================================================

// Target release date of the next drop (local time)
const TARGET_DATE = new Date('2026-08-17T00:10:00').getTime();

function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(days)}d: ${pad(hours)}h: ${pad(minutes)}m: ${pad(seconds)}s`;
}

const countdownInterval = setInterval(() => {
    const remaining = TARGET_DATE - Date.now();

    const mainClock = document.getElementById('main-hype-clock');
    const vaultClock = document.getElementById('vault-countdown');
    const heroClock = document.getElementById('hero-countdown-clock');

    if (remaining <= 0) {
        clearInterval(countdownInterval);
        const expired = '00d: 00h: 00m: 00s';
        if (mainClock) mainClock.textContent = expired;
        if (heroClock) heroClock.textContent = expired;
        if (vaultClock) vaultClock.textContent = 'Released!';
        return;
    }

    const text = formatCountdown(remaining);
    if (mainClock) mainClock.textContent = text;
    if (heroClock) heroClock.textContent = text;
    if (vaultClock) vaultClock.textContent = text;
}, 1000);
