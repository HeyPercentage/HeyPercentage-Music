// ==========================================
// 1. COUNTDOWN CLOCK
// ==========================================
const targetDate = new Date("2026-07-21T16:00:00").getTime(); 

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
// 2. UNIFIED NAVIGATION & TAB SWITCHER
// ==========================================
function switchTab(targetId) {
    const cleanId = targetId && targetId.startsWith('#') ? targetId.trim() : '#home';
    
    // Toggle page sections visibility
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetElement = document.querySelector(cleanId);
    if (targetElement) {
        targetElement.classList.add('active');
    }

    // Toggle active highlighting on nav buttons
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
        if (link.getAttribute('href') === cleanId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Global click event handler for hash routing links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const rawHref = this.getAttribute('href');
        if (rawHref && rawHref.startsWith('#')) {
            e.preventDefault();
            window.location.hash = rawHref.trim();
        }
    });
});

// Sync switching with page URL transformations (Back/Forward arrows support)
window.addEventListener('hashchange', () => switchTab(window.location.hash));

// Initialize tab state on page boot
document.addEventListener('DOMContentLoaded', () => {
    switchTab(window.location.hash || '#home');
});

// ==========================================
// 3. UNIFIED SONG SEARCH & FILTER ENGINE
// ==========================================

// --- ENGINE A: ALL SONGS ---
const searchInput = document.getElementById('songSearch');
const yearFilter = document.getElementById('year-filter');
const typeFilter = document.getElementById('type-filter');
const songsGrid = document.getElementById('songsGrid');
const songItems = songsGrid ? songsGrid.querySelectorAll('.song-item') : [];
const noResultsMessage = document.getElementById('no-results-message');
const songCountEl = document.getElementById('song-count');

function filterAllSongs() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedYear = yearFilter ? yearFilter.value : 'all';
    const selectedType = typeFilter ? typeFilter.value : 'all';
    
    let visibleCount = 0;

    songItems.forEach(song => {
        const vaultCard = song.querySelector('.vault-card');
        const searchData = vaultCard ? vaultCard.getAttribute('data-song') || '' : '';
        const songYear = song.getAttribute('data-year') || '';
        const songType = song.getAttribute('data-type') || '';

        const matchesSearch = query === '' || searchData.toLowerCase().includes(query);
        const matchesYear = selectedYear === 'all' || songYear === selectedYear;
        const matchesType = selectedType === 'all' || songType === selectedType;

        if (matchesSearch && matchesYear && matchesType) {
            song.style.display = ''; 
            visibleCount++;
        } else {
            song.style.display = 'none';
        }
    });

    if (songCountEl) songCountEl.textContent = visibleCount;

    if (visibleCount === 0) {
        if (noResultsMessage) noResultsMessage.style.display = 'block';
    } else {
        if (noResultsMessage) noResultsMessage.style.display = 'none';
    }
}

if (songCountEl) songCountEl.textContent = songItems.length;
if (searchInput) searchInput.addEventListener('input', filterAllSongs);
if (yearFilter) yearFilter.addEventListener('change', filterAllSongs);
if (typeFilter) typeFilter.addEventListener('change', filterAllSongs);

// --- CLEAR BUTTON: ALL SONGS ---
const clearBtn = document.getElementById('clear-filters');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (yearFilter) yearFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    filterAllSongs(); // re-run your existing function
  });
}

// --- CLEAR BUTTON: PRODUCED SONGS ---
const clearProducedBtn = document.getElementById('clear-produced-filters');
if (clearProducedBtn) {
  clearProducedBtn.addEventListener('click', () => {
    if (producedSearchInput) producedSearchInput.value = '';
    if (producedYearFilter) producedYearFilter.value = 'all';
    if (producedTypeFilter) producedTypeFilter.value = 'all';
    filterProducedSongs(); // re-run your existing function
  });
}

// --- ENGINE B: PRODUCED SONGS ---
const producedSearchInput = document.getElementById('producedSongSearch');
const producedYearFilter = document.getElementById('produced-year-filter');
const producedTypeFilter = document.getElementById('produced-type-filter');
const producedSongsGrid = document.getElementById('producedSongsGrid');
const producedSongItems = producedSongsGrid ? producedSongsGrid.querySelectorAll('.song-item') : [];
const producedNoResultsMsg = document.getElementById('producedNoResults');
const producedSongCountEl = document.getElementById('produced-song-count');

function filterProducedSongs() {
    const query = producedSearchInput ? producedSearchInput.value.toLowerCase().trim() : '';
    const selectedYear = producedYearFilter ? producedYearFilter.value : 'all';
    const selectedType = producedTypeFilter ? producedTypeFilter.value : 'all';
    
    let visibleCount = 0;

    producedSongItems.forEach(song => {
        const vaultCard = song.querySelector('.vault-card');
        const searchData = vaultCard ? vaultCard.getAttribute('data-song') || '' : '';
        const songYear = song.getAttribute('data-year') || '';
        const songType = song.getAttribute('data-type') || '';

        const matchesSearch = query === '' || searchData.toLowerCase().includes(query);
        const matchesYear = selectedYear === 'all' || songYear === selectedYear;
        const matchesType = selectedType === 'all' || songType === selectedType;

        if (matchesSearch && matchesYear && matchesType) {
            song.style.display = ''; 
            visibleCount++;
        } else {
            song.style.display = 'none';
        }
    });

    // Don't count the h2 title headers as invisible songs
    if (producedSongCountEl) producedSongCountEl.textContent = visibleCount;

    if (visibleCount === 0) {
        if (producedNoResultsMsg) producedNoResultsMsg.style.display = 'block';
    } else {
        if (producedNoResultsMsg) producedNoResultsMsg.style.display = 'none';
    }
}

if (producedSongCountEl) producedSongCountEl.textContent = producedSongItems.length;
if (producedSearchInput) producedSearchInput.addEventListener('input', filterProducedSongs);
if (producedYearFilter) producedYearFilter.addEventListener('change', filterProducedSongs);
if (producedTypeFilter) producedTypeFilter.addEventListener('change', filterProducedSongs);

// ==========================================
// 4. CUSTOM AUDIO PLAYER LOGIC
// ==========================================
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
  const volumeIcon = document.getElementById('volumeIcon');

  if (!audio || !playBtn) return; 

  let isDragging = false;

  audio.volume = 0.7;
  if (volumeBar) volumeBar.style.width = '70%';

  playBtn.addEventListener('click', togglePlay);
  
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    } else {
      audio.pause();
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
    }
  }

  if (backBtn) backBtn.addEventListener('click', () => audio.currentTime = Math.max(0, audio.currentTime - 10));
  if (fwdBtn) fwdBtn.addEventListener('click', () => audio.currentTime = Math.min(audio.duration, audio.currentTime + 10));

  function updateProgress() {
    if (!isNaN(audio.duration)) {
      const progress = (audio.currentTime / audio.duration) * 100;
      if (progressBar) progressBar.style.width = progress + '%';
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  }
  
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
  });

  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * audio.duration;
  }
  if (progressContainer) progressContainer.addEventListener('click', seek);

  if (progressThumb) {
      progressThumb.addEventListener('mousedown', () => {
        isDragging = true;
        progressContainer.classList.add('dragging');
      });
  }
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    if (progressContainer) progressContainer.classList.remove('dragging');
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !progressContainer) return;
    const rect = progressContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    if (progressBar) progressBar.style.width = percent + '%';
    audio.currentTime = (percent / 100) * audio.duration;
  });

  function updateVolumeUI(volumeValue) {
      if (!volumeBar) return;
      volumeBar.style.width = volumeValue * 100 + '%';
      
      if (!volumeIcon) return;
      if (volumeValue === 0) {
          volumeIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      } else if (volumeValue < 0.5) {
          volumeIcon.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
      } else {
          volumeIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      }
  }

  if (volumeContainer) {
      volumeContainer.addEventListener('click', (e) => {
        const rect = volumeContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        let percent = x / rect.width;
        percent = Math.max(0, Math.min(percent, 1));
        audio.volume = percent;
        updateVolumeUI(percent);
      });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
    if (e.code === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    if (e.code === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      audio.volume = Math.min(1, audio.volume + 0.1);
      updateVolumeUI(audio.volume);
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      audio.volume = Math.max(0, audio.volume - 0.1);
      updateVolumeUI(audio.volume);
    }
  });

  function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});
