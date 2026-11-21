/*
 * View modes
 *  1. Song lists (songs.html, produced.html): Grid | Coverflow | List
 *     - any element with [data-view-modes] gets a switcher
 *     - Coverflow is the 3D carousel idea from TemplateMo 615 Amber Folio,
 *       rewritten for this site (it reads the existing .song-item cards, so
 *       search + filters keep working)
 *  2. Home page: Showcase | Classic hero (+ the showcase slider)
 * Choices are remembered per visitor in localStorage (optional, never required).
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { /* private mode etc. */ }
    return null;
  }
  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function enc(p) { return encodeURI(p || ""); }

  /* ======================= 1. SONG LIST VIEW MODES ======================= */
  function initCatalog(grid) {
    var KEY = "hp-view-" + (location.pathname.split("/").pop() || "index");
    var MODES = [
      { id: "list", label: "List", icon: "fa-list" },
      { id: "grid", label: "Grid", icon: "fa-table-cells-large" },
      { id: "coverflow", label: "Coverflow", icon: "fa-compact-disc" }
    ];
    var mode = store(KEY);
    if (!MODES.some(function (m) { return m.id === mode; })) mode = "list"; // "list" = the site's original look

    /* switcher */
    var bar = h("div", "hp-vm-bar");
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Choose how songs are displayed");
    bar.appendChild(h("span", "hp-vm-label", "View"));
    var btns = {};
    MODES.forEach(function (m) {
      var b = h("button", "hp-vm-btn", '<i class="fa-solid ' + m.icon + '" aria-hidden="true"></i> ' + m.label);
      b.type = "button";
      b.addEventListener("click", function () { setMode(m.id); });
      btns[m.id] = b;
      bar.appendChild(b);
    });

    /* coverflow shell */
    var cf = h("section", "hp-cf");
    cf.hidden = true;
    cf.tabIndex = 0;
    cf.setAttribute("aria-roledescription", "carousel");
    cf.setAttribute("aria-label", "Songs coverflow. Use the left and right arrow keys.");
    var stage = h("div", "hp-cf-stage");
    var controls = h("div", "hp-cf-controls");
    var prevB = h("button", "hp-cf-btn", "&#8249;"); prevB.type = "button"; prevB.setAttribute("aria-label", "Previous song");
    var nextB = h("button", "hp-cf-btn", "&#8250;"); nextB.type = "button"; nextB.setAttribute("aria-label", "Next song");
    var count = h("span", "hp-cf-count");
    count.setAttribute("aria-live", "polite");
    controls.appendChild(prevB); controls.appendChild(count); controls.appendChild(nextB);
    cf.appendChild(stage); cf.appendChild(controls);

    var anchor = document.querySelector(".filter-container");
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    } else grid.parentNode.insertBefore(bar, grid);
    grid.parentNode.insertBefore(cf, grid);

    /* build the carousel from the (currently visible) .song-item cards */
    var items = [], cur = 0;

    function collect() {
      var out = [];
      var nodes = grid.querySelectorAll(".song-item");
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (!n.getClientRects().length) continue; // hidden by search/filter
        var a = n.querySelector("a"), img = n.querySelector("img");
        var cat = "", p = n.previousElementSibling;
        while (p) { if (p.classList && p.classList.contains("separate-title")) { cat = p.textContent.trim(); break; } p = p.previousElementSibling; }
        var q = function (s) { var e = n.querySelector(s); return e ? e.textContent.trim() : ""; };
        out.push({
          href: a ? a.getAttribute("href") : "#",
          img: img ? img.getAttribute("src") : "",
          title: q("h4"),
          sub: q("h6"),
          meta: q(".track-count"),
          cat: cat
        });
      }
      return out;
    }

    function rebuild() {
      var data = collect();
      stage.innerHTML = "";
      items = data.map(function (d, i) {
        var el = h("div", "hp-cf-item",
          '<img src="' + esc(d.img) + '" alt="" loading="lazy" decoding="async">' +
          '<div class="hp-cf-over">' +
            (d.cat || d.meta ? '<span class="hp-cf-cat">' + esc(d.cat || d.meta) + "</span>" : "") +
            "<h3>" + esc(d.title) + "</h3>" +
            (d.sub ? "<p>" + esc(d.sub) + "</p>" : "") +
            '<a class="hp-cf-open" href="' + esc(d.href) + '" target="_blank" rel="noopener">Listen</a>' +
          "</div>");
        el.setAttribute("role", "group");
        el.setAttribute("aria-roledescription", "slide");
        el.setAttribute("aria-label", (i + 1) + " of " + data.length + ": " + d.title);
        el.addEventListener("click", function (e) {
          if (e.target.closest(".hp-cf-open")) return; // let the link work
          if (i !== cur) go(i);
        });
        stage.appendChild(el);
        return el;
      });
      if (cur >= items.length) cur = Math.max(0, items.length - 1);
      layout();
    }

    function layout() {
      var n = items.length;
      var w = window.innerWidth;
      var spacing = w <= 480 ? 96 : w <= 768 ? 140 : 200;
      items.forEach(function (el, i) {
        var off = i - cur;
        if (off > n / 2) off -= n; else if (off < -n / 2) off += n;
        var a = Math.abs(off), z, ry, sc, op;
        if (a === 0) { z = 100; ry = 0; sc = 1.08; op = 1; }
        else if (a === 1) { z = 0; ry = off * -40; sc = 0.85; op = 0.75; }
        else if (a === 2) { z = -100; ry = off * -50; sc = 0.7; op = 0.5; }
        else if (a === 3) { z = -150; ry = off * -60; sc = 0.6; op = 0.3; }
        else { z = -200; ry = off * -70; sc = 0.5; op = 0; }
        el.style.transform = "translate(-50%,-50%) translateX(" + off * spacing + "px) translateZ(" + z + "px) rotateY(" + ry + "deg) scale(" + sc + ")";
        el.style.opacity = op;
        el.style.zIndex = n - a;
        el.style.pointerEvents = a > 3 ? "none" : "auto";
        el.classList.toggle("is-center", a === 0);
        // keep the "Listen" link out of the tab order unless it is the centred song
        var link = el.querySelector(".hp-cf-open");
        if (link) link.tabIndex = a === 0 ? 0 : -1;
        el.setAttribute("aria-hidden", a > 3 ? "true" : "false");
      });
      count.textContent = n ? (cur + 1) + " / " + n : "";
      prevB.disabled = nextB.disabled = n < 2;
    }

    function go(i) { var n = items.length; if (!n) return; cur = (i + n) % n; layout(); }

    prevB.addEventListener("click", function () { go(cur - 1); });
    nextB.addEventListener("click", function () { go(cur + 1); });
    cf.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
    });
    var sx = 0, sy = 0;
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      var dx = sx - e.changedTouches[0].clientX, dy = sy - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) go(cur + (dx > 0 ? 1 : -1));
    }, { passive: true });
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 100); });

    /* search + filters change which cards are visible -> rebuild */
    var ft;
    new MutationObserver(function () {
      if (mode !== "coverflow") return;
      clearTimeout(ft); ft = setTimeout(rebuild, 60);
    }).observe(grid, { subtree: true, childList: true, attributes: true, attributeFilter: ["style", "class", "hidden"] });

    function setMode(m, silent) {
      mode = m;
      if (!silent) store(KEY, m);
      MODES.forEach(function (x) { btns[x.id].setAttribute("aria-pressed", x.id === m ? "true" : "false"); });
      grid.classList.toggle("vm-grid", m === "grid");
      var cover = m === "coverflow";
      grid.classList.toggle("vm-offscreen", cover);
      if ("inert" in grid) grid.inert = cover;
      cf.hidden = !cover;
      if (cover) rebuild();
    }
    setMode(mode, true);
  }

  /* ========================= 2. HOME PAGE MODES ========================= */
  function initHome(root) {
    var KEY = "hp-home-mode";
    var toggle = document.querySelector(".hp-home-toggle");
    function setHome(m) {
      document.documentElement.setAttribute("data-home-mode", m);
      store(KEY, m);
      if (toggle) {
        var bs = toggle.querySelectorAll("button");
        for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].dataset.mode === m ? "true" : "false");
      }
    }
    if (toggle) toggle.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-mode]");
      if (b) setHome(b.dataset.mode);
    });
    setHome(document.documentElement.getAttribute("data-home-mode") || "showcase");

    /* slider: upcoming releases first, then the latest releases */
    var slidesEl = root.querySelector(".hp-slides");
    var dotsHost = root.querySelector(".hp-slider-nav");
    if (!slidesEl) return;

    var data = [];
    var R = window.HPReleases ? window.HPReleases.list.slice() : [];
    R.sort(function (a, b) { return (a._t == null) - (b._t == null) || (a._t || 0) - (b._t || 0); });
    R.forEach(function (r) {
      var out = r._t != null && r._t <= Date.now();
      data.push({ id: r.id, tag: out ? "Out Now" : "Upcoming", title: r.title, sub: r.subtitle && r.subtitle !== "(-)" ? r.subtitle : "", cover: r.cover, link: r.link, up: !out });
    });
    (window.HP_LATEST || []).forEach(function (r) {
      data.push({ tag: "Out Now", title: r.title, sub: r.subtitle ? (/^ft\./i.test(r.subtitle) ? "(" + r.subtitle + ")" : r.subtitle) : "", cover: r.cover, link: r.link });
    });
    if (!data.length) { root.classList.add("no-slides"); return; }

    var els = data.map(function (d, i) {
      var a = h("a", "hp-slide",
        '<img src="' + esc(enc(d.cover)) + '" alt="' + esc(d.title) + ' artwork" ' + (i ? 'loading="lazy"' : "") + ' decoding="async">' +
        '<div class="hp-slide-cap"><span class="hp-slide-tag">' + esc(d.tag) + "</span>" +
          "<strong>" + esc(d.title) + "</strong>" +
          (d.sub ? "<em>" + esc(d.sub) + "</em>" : "") +
          (d.id ? '<span class="hp-slide-clock" data-countdown="' + esc(d.id) + '"></span>' : "") +
        "</div>");
      a.href = d.link || "#";
      a.target = "_blank"; a.rel = "noopener";
      a.setAttribute("aria-label", d.tag + ": " + d.title);
      slidesEl.appendChild(a);
      return a;
    });

    var i = 0, timer = null;
    function show(n) {
      i = (n + els.length) % els.length;
      els.forEach(function (e, k) {
        e.classList.toggle("is-active", k === i);
        e.tabIndex = k === i ? 0 : -1;
        e.setAttribute("aria-hidden", k === i ? "false" : "true");
      });
    }
    function play() {
      if (reduceMotion || els.length < 2) return;
      stop(); timer = setInterval(function () { show(i + 1); }, 6000);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var prev = root.querySelector(".hp-arrow-prev"), next = root.querySelector(".hp-arrow-next");
    if (prev) prev.addEventListener("click", function () { show(i - 1); play(); });
    if (next) next.addEventListener("click", function () { show(i + 1); play(); });
    var box = root.querySelector(".hp-slider-wrap");
    box.addEventListener("mouseenter", stop); box.addEventListener("mouseleave", play);
    box.addEventListener("focusin", stop);    box.addEventListener("focusout", play);
    if (els.length < 2 && dotsHost) dotsHost.hidden = true;

    show(0); play();
    document.dispatchEvent(new Event("hp:render"));
  }

  function boot() {
    var grids = document.querySelectorAll("[data-view-modes]");
    for (var i = 0; i < grids.length; i++) initCatalog(grids[i]);
    var home = document.getElementById("hpShowcase");
    if (home) initHome(home);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
