// ==========================================
// 1. COUNTDOWN TIMER CONFIGURATION
// ==========================================
// FIX: The "T" is added here so browsers don't show zeros
const targetDate = new Date("2026-06-07T12:00:00").getTime(); 

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    // Stop the timer when it hits zero
    if (difference <= 0) {
        clearInterval(countdownInterval);
        if (document.getElementById("days")) {
            document.getElementById("days").innerText = 0;
            document.getElementById("hours").innerText = 0;
            document.getElementById("minutes").innerText = 0;
            document.getElementById("seconds").innerText = 0;
        }
        return;
    }

    // Time math
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update HTML
    if (document.getElementById("days")) {
        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = hours;
        document.getElementById("minutes").innerText = minutes;
        document.getElementById("seconds").innerText = seconds;
    }
}, 1000);

// ==========================================
// 2. NAVIGATION LINKS (Around Line 30 & 37)
// ==========================================

// FIX: .trim() added to header navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            switchTab(rawHref.trim()); 
        }
    });
});

// FIX: .trim() added to your page buttons
document.querySelectorAll('a[href^="#"]').forEach(button => {
    // This targets any button/link that starts with "#" to catch your home buttons
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const rawHref = this.getAttribute('href');
        if (rawHref) {
            switchTab(rawHref.trim());
        }
    });
});

// ==========================================
// 3. YOUR ORIGINAL TAB SWITCHER
// ==========================================
function switchTab(targetId) {
    // Paste your original switchTab logic from the PDF right here.
    // Usually, it looks something like finding all sections, hiding them, 
    // and then showing the one that matches 'targetId'.
    
    const sections = document.querySelectorAll('.page-section'); // or whatever class you use
    sections.forEach(section => section.style.display = 'none');
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.style.display = 'block';
    }
}
