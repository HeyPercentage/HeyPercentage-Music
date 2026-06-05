function startMainHypeClock() {
    const clock = document.getElementById('main-hype-clock');
    if (!clock) return;

    const targetDate = new Date('2026-06-07T00:00:00+02:00').getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(interval);
            clock.innerText = "AVAILABLE NOW";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Pad single numbers with a leading zero for a premium digital clock aesthetic (e.g., 02:05:09)
        const dStr = String(days).padStart(2, '0');
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        clock.innerText = `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`;
    }, 1000);
}

// Initialize clock interface loop
startMainHypeClock();
