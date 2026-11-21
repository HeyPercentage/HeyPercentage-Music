/*
 * The Vault — replaces js/player.js.
 * Builds one card + one snippet player per release in window.HP_UPCOMING
 * (data/releases.js). Only one snippet plays at a time.
 */
(function () {
  "use strict";

  var host = document.getElementById("vaultList");
  if (!host) return;

  var releases = window.HP_UPCOMING || [];
  var audios = [];
  var actx = null;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function enc(p) { return encodeURI(p || ""); }
  function fmtTime(s) {
    if (!isFinite(s)) s = 0;
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  /* ---- order: dated releases by time, then "TBA" ones in listed order ---- */
  function ordered() {
    var R = window.HPReleases ? window.HPReleases.list : releases;
    var dated = R.filter(function (r) { return r._t != null; }).sort(function (a, b) { return a._t - b._t; });
    var tba = R.filter(function (r) { return r._t == null; });
    return dated.concat(tba);
  }

  function buildCard(r, isNext) {
    var art = document.createElement("article");
    art.className = "hp-release";
    art.setAttribute("data-release-card", r.id);

    var badge = isNext ? "Next Release" : "Upcoming";
    var sub = r.subtitle ? "<h6>" + esc(r.subtitle) + "</h6>" : "";
    var tag = r.link ? "a" : "div";
    var open = r.link
      ? '<a href="' + esc(r.link) + '" target="_blank" rel="noopener" class="vault-card status-production">'
      : '<div class="vault-card vault-card-static status-production">';
    art.innerHTML =
      open +
        '<img src="' + esc(enc(r.cover)) + '" alt="' + esc(r.title) + ' artwork" class="vault-cover" loading="lazy" decoding="async">' +
        '<div class="vault-info"><div class="vault-info-text">' +
          "<h4>" + esc(r.title) + "</h4>" + sub +
          '<h5 data-countdown="' + esc(r.id) + '">Calculating...</h5>' +
        '</div><span class="badge">' + badge + "</span></div>" +
      "</" + tag + ">" +
      '<p class="hp-when" data-release-when="' + esc(r.id) + '"></p>';

    art.appendChild(buildPlayer(r));
    return art;
  }

  function buildPlayer(r) {
    var wrap = document.createElement("div");
    wrap.className = "hp-player";

    if (!r.snippet) {
      wrap.classList.add("is-empty");
      wrap.innerHTML = '<p class="hp-player-empty">Snippet coming soon</p>';
      return wrap;
    }

    wrap.innerHTML =
      '<audio preload="metadata" src="' + esc(enc(r.snippet)) + '"></audio>' +
      '<div class="hp-controls">' +
        '<button type="button" class="hp-btn" data-act="back" aria-label="Back 10 seconds"><i class="fa-solid fa-backward"></i> 10s</button>' +
        '<button type="button" class="hp-btn hp-play" data-act="play" aria-label="Play snippet of ' + esc(r.title) + '"><i class="fa-solid fa-play"></i> Play</button>' +
        '<button type="button" class="hp-btn" data-act="fwd" aria-label="Forward 10 seconds">10s <i class="fa-solid fa-forward"></i></button>' +
      "</div>" +
      '<div class="hp-progress-row">' +
        '<span class="hp-cur">0:00</span>' +
        '<div class="hp-progress" role="slider" aria-label="Seek" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="hp-progress-bar"></div></div>' +
        '<span class="hp-dur">0:00</span>' +
      "</div>" +
      '<div class="hp-volume-row">' +
        '<button type="button" class="hp-icon" data-act="mute" aria-label="Mute"><i class="fa-solid fa-volume-low"></i></button>' +
        '<div class="hp-volume" role="slider" aria-label="Volume" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60">' +
          '<canvas class="hp-viz"></canvas><div class="hp-volume-bar"></div></div>' +
      "</div>";

    wire(wrap);
    return wrap;
  }

  function wire(wrap) {
    var audio = wrap.querySelector("audio");
    var playBtn = wrap.querySelector('[data-act="play"]');
    var cur = wrap.querySelector(".hp-cur");
    var dur = wrap.querySelector(".hp-dur");
    var prog = wrap.querySelector(".hp-progress");
    var bar = wrap.querySelector(".hp-progress-bar");
    var vol = wrap.querySelector(".hp-volume");
    var volBar = wrap.querySelector(".hp-volume-bar");
    var muteBtn = wrap.querySelector('[data-act="mute"]');
    var canvas = wrap.querySelector(".hp-viz");
    var analyser = null, raf = 0;

    audios.push(audio);
    audio.volume = 0.6;
    volBar.style.width = "60%";

    function setPlayUi(playing) {
      playBtn.innerHTML = playing
        ? '<i class="fa-solid fa-pause"></i> Pause'
        : '<i class="fa-solid fa-play"></i> Play';
      wrap.classList.toggle("is-playing", playing);
    }

    playBtn.addEventListener("click", function () {
      if (audio.paused) {
        audios.forEach(function (a) { if (a !== audio) a.pause(); });
        var p = audio.play();
        if (p && p.catch) p.catch(function () { setPlayUi(false); });
      } else audio.pause();
    });
    wrap.querySelector('[data-act="back"]').addEventListener("click", function () {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
    wrap.querySelector('[data-act="fwd"]').addEventListener("click", function () {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });

    audio.addEventListener("play", function () { setPlayUi(true); startViz(); });
    audio.addEventListener("pause", function () { setPlayUi(false); });
    audio.addEventListener("ended", function () { setPlayUi(false); audio.currentTime = 0; });
    audio.addEventListener("loadedmetadata", function () { dur.textContent = fmtTime(audio.duration); });
    audio.addEventListener("error", function () {
      wrap.classList.add("is-empty");
      wrap.innerHTML = '<p class="hp-player-empty">Snippet unavailable right now</p>';
    });
    audio.addEventListener("timeupdate", function () {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      bar.style.width = pct + "%";
      prog.setAttribute("aria-valuenow", Math.round(pct));
      cur.textContent = fmtTime(audio.currentTime);
    });

    function drag(el, fn) {
      function at(e) {
        var r = el.getBoundingClientRect();
        fn(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
      }
      el.addEventListener("pointerdown", function (e) {
        el.setPointerCapture(e.pointerId); at(e);
        var move = function (ev) { at(ev); };
        var up = function () { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
        el.addEventListener("pointermove", move); el.addEventListener("pointerup", up);
      });
      el.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 0.05 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -0.05 : 0;
        if (!step) return;
        e.preventDefault();
        var now = el === prog ? (audio.duration ? audio.currentTime / audio.duration : 0) : audio.volume;
        fn(Math.min(1, Math.max(0, now + step)));
      });
    }
    drag(prog, function (f) { if (audio.duration) audio.currentTime = f * audio.duration; });
    drag(vol, function (f) {
      audio.volume = f; audio.muted = false;
      volBar.style.width = f * 100 + "%";
      vol.setAttribute("aria-valuenow", Math.round(f * 100));
      muteBtn.innerHTML = '<i class="fa-solid ' + (f === 0 ? "fa-volume-xmark" : f < 0.5 ? "fa-volume-low" : "fa-volume-high") + '"></i>';
    });
    muteBtn.addEventListener("click", function () {
      audio.muted = !audio.muted;
      muteBtn.innerHTML = '<i class="fa-solid ' + (audio.muted ? "fa-volume-xmark" : "fa-volume-low") + '"></i>';
    });

    /* Visualizer: purely cosmetic, so any failure is ignored. */
    function startViz() {
      try {
        if (!analyser) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          actx = actx || new AC();
          var src = actx.createMediaElementSource(audio);
          analyser = actx.createAnalyser();
          analyser.fftSize = 64;
          src.connect(analyser); analyser.connect(actx.destination);
        }
        if (actx.state === "suspended") actx.resume();
        cancelAnimationFrame(raf);
        draw();
      } catch (e) { analyser = null; }
    }
    function draw() {
      if (audio.paused || !analyser) { clear(); return; }
      var w = canvas.width = canvas.clientWidth, h = canvas.height = canvas.clientHeight;
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      var ctx = canvas.getContext("2d"), bw = w / data.length;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      for (var i = 0; i < data.length; i++) {
        var bh = (data[i] / 255) * h;
        ctx.fillRect(i * bw, h - bh, bw - 1, bh);
      }
      raf = requestAnimationFrame(draw);
    }
    function clear() {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function render() {
    host.innerHTML = "";
    var rs = ordered();
    if (!rs.length) {
      host.innerHTML = '<p class="hp-empty">Nothing in the vault right now. Check back soon.</p>';
      return;
    }
    var next = window.HPReleases && window.HPReleases.getNext();
    rs.forEach(function (r) { host.appendChild(buildCard(r, next && next.id === r.id)); });
    document.dispatchEvent(new Event("hp:render"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
