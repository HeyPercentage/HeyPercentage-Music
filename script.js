// ==========================================
// 1. COUNTDOWN CLOCK
// ==========================================
// Set this to your next actual release date!
const targetDate = new Date("2026-06-14T20:39:00").getTime(); 

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const mainClock = document.getElementById("main-hype-clock");
    const vaultClock = document.getElementById("vault-countdown");

    if (difference <= 0) {
        clearInterval(countdownInterval);
        const expiredText = "00d: 00h: 00m: 00s";
        if (mainClock) mainClock.innerText = expiredText;
        if (vaultClock) vaultClock.innerText = "Released!";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    const sStr = String(seconds).padStart(2, '0');

    const countdownString = `${dStr}d: ${hStr}h: ${mStr}m: ${sStr}s`;

    if (mainClock) mainClock.innerText = countdownString;
    if (vaultClock) vaultClock.innerText = countdownString;
}, 1000);

// ==========================================
// 2. NAVIGATION LINKS & TAB SWITCHER
// ==========================================
document.querySelectorAll('.nav-links a, a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const rawHref = this.getAttribute('href');
        
        // Only prevent default and switch tabs if it's an internal # link
        if (rawHref && rawHref.startsWith('#')) {
            e.preventDefault();
            switchTab(rawHref.trim());
        }
    });
});

function switchTab(targetId) {
    // Rely purely on your CSS .active class for smooth transitions
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.classList.add('active');
    }

    // Update active state on the navbar
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==========================================
// 3. SONG SEARCH ENGINE
// ==========================================
const searchInput = document.getElementById('songSearch');
const songCards = document.querySelectorAll('#songsGrid .vault-card');
const noResultsMsg = document.getElementById('noResults');

// Added safety check
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;
        
        songCards.forEach(card => {
            const searchData = card.getAttribute('data-song');
            if (!searchData) return; 

            if (searchData.toLowerCase().includes(query) || query === '') {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (visibleCount === 0 && query !== '') {
            if (noResultsMsg) noResultsMsg.style.display = 'block';
        } else {
            if (noResultsMsg) noResultsMsg.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('myAudio');
  const playBtn = document.getElementById('playPause');
  const backBtn = document.getElementById('back10');
  const fwdBtn = document.getElementById('fwd10');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const progressThumb = document.getElementById('progressThumb');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const volumeContainer = document.getElementById('volumeContainer');
  const volumeBar = document.getElementById('volumeBar');

  let isDragging = false;

  // Set default volume
  audio.volume = 0.7;
  volumeBar.style.width = '70%';

  // Play / Pause
  playBtn.addEventListener('click', togglePlay);
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '|| Pause';
    } else {
      audio.pause();
      playBtn.textContent = '▶ Play';
    }
  }

  // Skip 10s
  backBtn.addEventListener('click', () => audio.currentTime = Math.max(0, audio.currentTime - 10));
  fwdBtn.addEventListener('click', () => audio.currentTime = Math.min(audio.duration, audio.currentTime + 10));

  // Progress update
  function updateProgress() {
    if (!isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => durationEl.textContent = formatTime(audio.duration));

  // Seek
  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * audio.duration;
  }
  progressContainer.addEventListener('click', seek);

  // Drag thumb
  progressThumb.addEventListener('mousedown', () => {
    isDragging = true;
    progressContainer.classList.add('dragging');
  });
  document.addEventListener('mouseup', () => {
    isDragging = false;
    progressContainer.classList.remove('dragging');
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = progressContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    progressBar.style.width = percent + '%';
    audio.currentTime = (percent / 100) * audio.duration;
  });

  // Volume control
  volumeContainer.addEventListener('click', (e) => {
    const rect = volumeContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audio.volume = percent;
    volumeBar.style.width = percent * 100 + '%';
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // ignore when typing
    
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
    if (e.code === 'ArrowLeft') audio.currentTime -= 5;
    if (e.code === 'ArrowRight') audio.currentTime += 5;
    if (e.code === 'ArrowUp') audio.volume = Math.min(1, audio.volume + 0.1);
    if (e.code === 'ArrowDown') audio.volume = Math.max(0, audio.volume - 0.1);
    volumeBar.style.width = audio.volume * 100 + '%';
  });

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});