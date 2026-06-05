// ==========================================
// 1. COUNTDOWN TIMER CONFIGURATION
// ==========================================
// CRITICAL: Use the "T" separator format so ALL mobile and desktop browsers can parse it correctly!
const targetDate = new Date("2026-06-07T12:00:00").getTime(); 

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // If the countdown is finished
    if (difference <= 0) {
        clearInterval(countdownInterval);
        updateCountdownDisplay(0, 0, 0, 0);
        return;
    }

    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update the UI
    updateCountdownDisplay(days, hours, minutes, seconds);
}, 1000);

// Helper function to safely update text elements if they exist
function updateCountdownDisplay(d, h, m, s) {
    if (document.getElementById("days")) document.getElementById("days").innerText = d;
    if (document.getElementById("hours")) document.getElementById("hours").innerText = h;
    if (document.getElementById("minutes")) document.getElementById("minutes").innerText = m;
    if (document.getElementById("seconds")) document.getElementById("seconds").innerText = s;
}


// ==========================================
// 2. NAVIGATION & TAB SWITCHING
// ==========================================

// Line 30 Area: Header Navigation Links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            switchTab(rawHref.trim()); // Trimmed safely
        }
    });
});

// Line 37 Area: Action Buttons / Home Screen Buttons
document.querySelectorAll('.hero-btn, .section-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            const targetDestination = rawHref.trim(); // Trimmed safely
            switchTab(targetDestination);
        }
    });
});

// Your core switchTab mechanism
function switchTab(targetId) {
    // Your existing logic that hides other sections and shows the targetId
    console.log("Navigating to:", targetId);
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        // Example logic: handle class toggles or scrolling here
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}
