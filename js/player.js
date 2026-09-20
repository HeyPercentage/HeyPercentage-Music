// ==========================================================
// CUSTOM AUDIO PLAYER + SPECTRUM VISUALIZER
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

    const volumeContainer = document.getElementById('volumeContainer');
    const volumeBar = document.getElementById('volumeBar');
    const volumeThumb = document.getElementById('volumeThumb');
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas?.getContext('2d');

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

    // ---------------- Spectrum visualizer ----------------
    let audioCtx, analyser, source, dataArray, bufferLength;
    let visualizerStarted = false;

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

    // Play/pause also starts the AudioContext on this same user gesture
    playBtn.addEventListener('click', () => {
        setupVisualizer();
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        togglePlay();
    });

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
