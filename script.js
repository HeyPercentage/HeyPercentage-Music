// Wait for the HTML to fully load before attaching the engine
document.addEventListener('DOMContentLoaded', () => {

    // 1. MASTER FUNCTION FOR SEAMLESS TAB SWITCHING
    function switchTab(targetId) {
        const links = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.page-section');

        // Remove active visibility from all header links and page wrappers
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        // Open up the target container seamlessly
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Highlight the matching navigation tab up in the header menu automatically
        const matchingHeaderLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (matchingHeaderLink) {
            matchingHeaderLink.classList.add('active');
        }
    }

    // INTERCEPT RULES FOR NAVBAR MENU LINKS
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchTab(this.getAttribute('href'));
        });
    });

    // INTERCEPT RULES FOR INNER-PAGE BUTTON LINKS (Like "Explore Teasers")
    document.querySelectorAll('.cta-group a').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const targetDestination = this.getAttribute('href');
            
            if (targetDestination && targetDestination.startsWith('#')) {
                e.preventDefault();
                switchTab(targetDestination);
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Resets page focus cleanly to top
            }
        });
    });

    // 2. UNIFIED LIVE COUNTDOWN ENGINE
    function startGlobalCountdown() {
        const mainClock = document.getElementById('main-hype-clock');
        const vaultClock = document.getElementById('vault-countdown');
        
        // Set target timestamp (Midnight leading into June 7, 2026 SAST UTC+2)
        const targetDate = new Date('2026-06-07T00:00:00+02:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            // If the countdown reaches zero
            if (difference <= 0) {
                clearInterval(interval);
                if (mainClock) mainClock.innerText = "AVAILABLE NOW";
                if (vaultClock) vaultClock.innerText = "OUT NOW!";
                return;
            }

            // Time math conversions
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Format A: Standard Clock Padding (e.g., 02d : 14h : 05m : 22s)
            const dStr = String(days).padStart(2, '0');
            const hStr = String(hours).padStart(2, '0');
            const mStr = String(minutes).padStart(2, '0');
            const sStr = String(seconds).padStart(2, '0');

            if (mainClock) {
                mainClock.innerText = `${dStr}d : ${hStr}h : ${mStr}m : ${sStr}s`;
            }

            // Format B: Compact Vault text (e.g., "1d 14h 32m 05s")
            if (vaultClock) {
                let vaultOutput = "";
                if (days > 0) vaultOutput += `${days}d `;
                vaultOutput += `${hours}h ${minutes}m ${seconds}s`;
                vaultClock.innerText = vaultOutput;
            }
        }, 1000);
    }

    // Fire the execution pipelines
    startGlobalCountdown();
});
