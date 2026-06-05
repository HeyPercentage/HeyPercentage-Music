// ==========================================
// 1. DUAL COUNTDOWN ENGINE
// ==========================================
const targetDate = new Date("2026-06-07T12:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const mainClock = document.getElementById("main-hype-clock");
    const vaultClock = document.getElementById("vault-countdown");

    // Stop the timer when it hits zero
    if (difference <= 0) {
        clearInterval(countdownInterval);
        const expiredText = "00d: 00h: 00m: 00s";
        if (mainClock) mainClock.innerText = expiredText;
        if (vaultClock) vaultClock.innerText = "Released!";
        return;
    }

    // Time math
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Format numbers to always display 2 digits
    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    const countdownString = `${dStr}d: ${hStr}h: ${mStr}m: ${sStr}s`;

    // Safely update elements if they exist on the current active view
    if (mainClock) mainClock.innerText = countdownString;
    if (vaultClock) vaultClock.innerText = countdownString;
}, 1000);

// ==========================================
// 2. NAVIGATION LINKS
// ==========================================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            switchTab(rawHref.trim());
        }
    });
});

// Target explicit section landing buttons (like Hero layout buttons)
document.querySelectorAll('a[href^="#"]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            switchTab(rawHref.trim());
        }
    });
});

// ==========================================
// 3. TAB SWITCHER LOGIC
// ==========================================
function switchTab(targetId) {
    const sections = document.querySelectorAll('.page-section');
    
    // Hide all sections
    sections.forEach(section => section.style.display = 'none');
    
    // Show active target section
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.style.display = 'block';
    }
    
    // Update active navbar state
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
