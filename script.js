[span_135](start_span)const targetDate = new Date("2026-06-07T12:00:00").getTime();[span_135](end_span)

const countdownInterval = setInterval(() => {
    [span_136](start_span)const now = new Date().getTime();[span_136](end_span)
    [span_137](start_span)const difference = targetDate - now;[span_137](end_span)

    const mainClock = document.getElementById("main-hype-clock");
    const vaultClock = document.getElementById("vault-countdown");

    // Stop the timer when it hits zero
    if (difference <= 0) {
        [span_138](start_span)clearInterval(countdownInterval);[span_138](end_span)
        const expiredText = "00d: 00h: 00m: 00s";
        if (mainClock) mainClock.innerText = expiredText;
        if (vaultClock) vaultClock.innerText = "Released!";
        [span_139](start_span)return;[span_139](end_span)
    }

    // Time math
    [span_140](start_span)const days = Math.floor(difference / (1000 * 60 * 60 * 24));[span_140](end_span)
    [span_141](start_span)const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));[span_141](end_span)
    [span_142](start_span)const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));[span_142](end_span)
    [span_143](start_span)const seconds = Math.floor((difference % (1000 * 60)) / 1000);[span_143](end_span)

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
[span_144](start_span)document.querySelectorAll('.nav-links a').forEach(link => {[span_144](end_span)
    [span_145](start_span)link.addEventListener('click', function(e) {[span_145](end_span)
        [span_146](start_span)e.preventDefault();[span_146](end_span)
        [span_147](start_span)const rawHref = this.getAttribute('href');[span_147](end_span)
        if (rawHref) {
            [span_148](start_span)switchTab(rawHref.trim());[span_148](end_span)
        }
    });
});

// Target explicit section landing buttons (like your Hero buttons)
[span_149](start_span)document.querySelectorAll('a[href^="#"]').forEach(button => {[span_149](end_span)
    [span_150](start_span)button.addEventListener('click', function(e) {[span_150](end_span)
        [span_151](start_span)e.preventDefault();[span_151](end_span)
        [span_152](start_span)const rawHref = this.getAttribute('href');[span_152](end_span)
        if (rawHref) {
            [span_153](start_span)switchTab(rawHref.trim());[span_153](end_span)
        }
    });
});

// ==========================================
// 3. TAB SWITCHER LOGIC
// ==========================================
[span_154](start_span)function switchTab(targetId) {[span_154](end_span)
    [span_155](start_span)const sections = document.querySelectorAll('.page-section');[span_155](end_span)
    
    // Hide all sections
    [span_156](start_span)sections.forEach(section => section.style.display = 'none');[span_156](end_span)
    
    // Show active target section
    [span_157](start_span)const targetElement = document.querySelector(targetId);[span_157](end_span)
    if (targetElement) {
        [span_158](start_span)targetElement.style.display = 'block';[span_158](end_span)
    }
    
    // Update active navbar styles state
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
