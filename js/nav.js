// ==========================================================
// NAVIGATION — highlights the nav link for the current page
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    let currentFile = window.location.pathname.split('/').pop();
    if (currentFile === '') currentFile = 'index.html';

    document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
        const linkFile = link.getAttribute('href');
        if (linkFile === currentFile) {
            link.classList.add('active');
            // Keep the active tab visible in the mobile swipeable nav
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            link.classList.remove('active');
        }
    });
});
