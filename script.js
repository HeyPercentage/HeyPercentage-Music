// ==========================================================
// 1. COUNTDOWN CLOCK
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

// ==========================================================
// 2. NAVIGATION & TAB SWITCHER
// ==========================================================

function switchTab(targetId) {
    const cleanId = targetId && targetId.startsWith('#') ? targetId.trim() : '#home';

    document.querySelectorAll('.page-section').forEach((section) => {
        section.classList.remove('active');
    });

    const targetElement = document.querySelector(cleanId);
    if (targetElement) targetElement.classList.add('active');

    document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
        if (link.getAttribute('href') === cleanId) {
            link.classList.add('active');
            // Keep the active tab visible in the mobile swipeable nav
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } else {
            link.classList.remove('active');
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function () {
        const rawHref = this.getAttribute('href');
        if (rawHref && rawHref.startsWith('#')) {
            window.location.hash = rawHref.trim();
        }
    });
});

window.addEventListener('hashchange', () => switchTab(window.location.hash));

document.addEventListener('DOMContentLoaded', () => switchTab(window.location.hash || '#home'));

// ==========================================================
// 3. SONG SEARCH & FILTER ENGINE
// ==========================================================

/**
 * Attaches search / filter / clear behaviour to a song grid.
 * @param {Object} config
 * @param {string} config.gridId       - Container of .song-item elements
 * @param {string} config.searchId     - Search input id
 * @param {string} config.yearFilterId - Year <select> id
 * @param {string} config.typeFilterId - Type <select> id
 * @param {string} config.clearBtnId   - "Clear" button id
 * @param {string} config.countId      - Element showing the visible count
 * @param {string} config.noResultsId  - "No songs found" message id
 */
function setupSongFilter({
    gridId,
    searchId,
    yearFilterId,
    typeFilterId,
    clearBtnId,
    countId,
    noResultsId,
}) {
    const grid = document.getElementById(gridId);
    const searchInput = document.getElementById(searchId);
    const yearFilter = document.getElementById(yearFilterId);
    const typeFilter = document.getElementById(typeFilterId);
    const clearBtn = document.getElementById(clearBtnId);
    const countEl = document.getElementById(countId);
    const noResultsEl = document.getElementById(noResultsId);

    if (!grid) return;

    const items = grid.querySelectorAll('.song-item');
    if (countEl) countEl.textContent = items.length;

    function applyFilters() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const year = yearFilter ? yearFilter.value : 'all';
        const type = typeFilter ? typeFilter.value : 'all';

        let visibleCount = 0;

        items.forEach((item) => {
            const card = item.querySelector('.vault-card');
            const searchData = (card?.getAttribute('data-song') || '').toLowerCase();
            const itemYear = item.getAttribute('data-year') || '';
            const itemType = item.getAttribute('data-type') || '';

            const matchesSearch = query === '' || searchData.includes(query);
            const matchesYear = year === 'all' || itemYear === year;
            const matchesType = type === 'all' || itemType === type;

            const visible = matchesSearch && matchesYear && matchesType;
            item.style.display = visible ? '' : 'none';
            if (visible) visibleCount++;
        });

        if (countEl) countEl.textContent = visibleCount;
        if (noResultsEl) noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    function clearFilters() {
        if (searchInput) searchInput.value = '';
        if (yearFilter) yearFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        applyFilters();
    }

    searchInput?.addEventListener('input', applyFilters);
    yearFilter?.addEventListener('change', applyFilters);
    typeFilter?.addEventListener('change', applyFilters);
    clearBtn?.addEventListener('click', clearFilters);
}

setupSongFilter({
    gridId: 'songsGrid',
    searchId: 'songSearch',
    yearFilterId: 'year-filter',
    typeFilterId: 'type-filter',
    clearBtnId: 'clear-filters',
    countId: 'song-count',
    noResultsId: 'no-results-message',
});

setupSongFilter({
    gridId: 'producedSongsGrid',
    searchId: 'producedSongSearch',
    yearFilterId: 'produced-year-filter',
    typeFilterId: 'produced-type-filter',
    clearBtnId: 'clear-produced-filters',
    countId: 'produced-song-count',
    noResultsId: 'producedNoResults',
});

// ==========================================================
// 4. CUSTOM AUDIO PLAYER
// ==========================================================

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

    // Volume elements — volumeContainer is the clickable/draggable track,
    // volumeBar is the fill, volumeThumb (optional) is the little handle
    const volumeContainer = document.getElementById('volumeContainer');
    const volumeBar = document.getElementById('volumeBar');
    const volumeThumb = document.getElementById('volumeThumb');

    if (!audio || !playBtn) return;

    let isDragging = false;      // dragging the progress bar
    let isDraggingVol = false;   // dragging the volume bar

    audio.volume = 0.7;
    if (volumeBar) volumeBar.style.width = '70%';
    if (volumeThumb) volumeThumb.style.left = '70%';

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        } else {
            audio.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play';
        }
    }

    playBtn.addEventListener('click', togglePlay);

    backBtn?.addEventListener('click', () => {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    fwdBtn?.addEventListener('click', () => {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });

    function updateProgress() {
        if (!isNaN(audio.duration) && isDragging === false) {
            const percent = (audio.currentTime / audio.duration) * 100;
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressThumb) progressThumb.style.left = `${percent}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }

    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('loadedmetadata', () => {
        if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // ---- Shared helper: clamp a percentage 0-100 based on pointer X ----
    function getPercentFromEvent(e, container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = (x / rect.width) * 100;
        return Math.min(100, Math.max(0, percent));
    }

    // ---------------- Draggable progress bar ----------------
    if (progressContainer) {
        function seekToEvent(e) {
            if (isNaN(audio.duration)) return;
            const percent = getPercentFromEvent(e, progressContainer);
            if (progressBar) progressBar.style.width = `${percent}%`;
            if (progressThumb) progressThumb.style.left = `${percent}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime((percent / 100) * audio.duration);
            return percent;
        }

        progressContainer.addEventListener('pointerdown', (e) => {
            isDragging = true;
            progressContainer.setPointerCapture(e.pointerId);
            seekToEvent(e);
        });

        progressContainer.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            seekToEvent(e);
        });

        function endProgressDrag(e) {
            if (!isDragging) return;
            const percent = seekToEvent(e);
            if (!isNaN(audio.duration) && percent !== undefined) {
                audio.currentTime = (percent / 100) * audio.duration;
            }
            isDragging = false;
        }

        progressContainer.addEventListener('pointerup', endProgressDrag);
        progressContainer.addEventListener('pointercancel', () => { isDragging = false; });
    }

    // ---------------- Draggable volume bar ----------------
    if (volumeContainer) {
        function setVolumeFromEvent(e) {
            const percent = getPercentFromEvent(e, volumeContainer);
            audio.volume = percent / 100;
            if (volumeBar) volumeBar.style.width = `${percent}%`;
            if (volumeThumb) volumeThumb.style.left = `${percent}%`;
        }

        volumeContainer.addEventListener('pointerdown', (e) => {
            isDraggingVol = true;
            volumeContainer.setPointerCapture(e.pointerId);
            setVolumeFromEvent(e);
        });

        volumeContainer.addEventListener('pointermove', (e) => {
            if (!isDraggingVol) return;
            setVolumeFromEvent(e);
        });

        volumeContainer.addEventListener('pointerup', () => { isDraggingVol = false; });
        volumeContainer.addEventListener('pointercancel', () => { isDraggingVol = false; });
    }
});

// ---------------- Spectrum Visualizer ----------------
// Add a <canvas id="visualizer"></canvas> in your HTML near the audio controls

let audioCtx, analyser, source, dataArray, bufferLength;
let visualizerStarted = false;
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas?.getContext('2d');

function setupVisualizer() {
    if (visualizerStarted) return;
    visualizerStarted = true;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioCtx.destination); // keep audio flowing to speakers

    analyser.fftSize = 128; // lower = fewer, chunkier bars. try 64, 128, 256
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    drawVisualizer();
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!analyser || !canvasCtx) return;

    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;
    canvasCtx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 1.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;
        canvasCtx.fillStyle = `hsl(${(i / bufferLength) * 360}, 80%, 55%)`;
        canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// Hook into your existing togglePlay so the AudioContext starts on user gesture
const originalTogglePlay = togglePlay;
togglePlay = function () {
    setupVisualizer();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    originalTogglePlay();
};