/*
 * Release countdowns — replaces js/countdown.js.
 * Reads window.HP_UPCOMING (data/releases.js). Each release has its own time.
 *
 *   data-countdown="next"        -> countdown to the soonest upcoming release
 *   data-countdown="<id>"        -> countdown to that release
 *   data-release-when="<id|next>"-> "Fri 5 Dec · 18:00 SAST (your time 18:00)"
 *   data-release-title="next"    -> title of the soonest release
 *   data-release-card="<id>"     -> card that flips to "Out Now" when its time passes
 */
(function () {
  "use strict";

  var TZ = window.HP_TIMEZONE || "Africa/Johannesburg";
  var list = (window.HP_UPCOMING || []).map(function (r) {
    var t = r.releaseAt ? Date.parse(r.releaseAt) : NaN;
    if (r.releaseAt && isNaN(t)) {
      console.warn("[releases] Bad releaseAt for", r.id, "- treated as TBA:", r.releaseAt);
    }
    r._t = isNaN(t) ? null : t;
    return r;
  });

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function byId(id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // Soonest release that has not happened yet; dated ones first, then TBA.
  function getNext() {
    var now = Date.now(), dated = [], tba = [];
    list.forEach(function (r) {
      if (r._t === null) tba.push(r);
      else if (r._t > now) dated.push(r);
    });
    dated.sort(function (a, b) { return a._t - b._t; });
    return dated[0] || tba[0] || null;
  }

  function resolve(key) { return key === "next" ? getNext() : byId(key); }

  function clock(r) {
    if (!r) return "No release scheduled";
    if (r._t === null) return "Date TBA";
    var diff = r._t - Date.now();
    if (diff <= 0) return "Out Now";
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600);  s -= h * 3600;
    var m = Math.floor(s / 60);    s -= m * 60;
    return pad(d) + "d: " + pad(h) + "h: " + pad(m) + "m: " + pad(s) + "s";
  }

  function fmt(ms, zone) {
    var opts = { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false };
    if (zone) opts.timeZone = zone;
    try { return new Intl.DateTimeFormat(undefined, opts).format(new Date(ms)); }
    catch (e) { return new Date(ms).toString(); }
  }

  function zoneLabel(ms, zone) {
    try {
      var p = new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "short" }).formatToParts(new Date(ms));
      for (var i = 0; i < p.length; i++) if (p[i].type === "timeZoneName") return p[i].value;
    } catch (e) {}
    return zone;
  }

  function when(r) {
    if (!r) return "";
    if (r._t === null) return "Release date and time to be announced";
    var mine = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var artist = fmt(r._t, TZ) + " " + zoneLabel(r._t, TZ);
    return mine === TZ ? artist : artist + " · your time: " + fmt(r._t);
  }

  function render() {
    var els, i, r, key;

    els = document.querySelectorAll("[data-countdown]");
    for (i = 0; i < els.length; i++) {
      r = resolve(els[i].getAttribute("data-countdown"));
      var txt = clock(r);
      if (els[i].textContent !== txt) els[i].textContent = txt;
    }

    els = document.querySelectorAll("[data-release-when]");
    for (i = 0; i < els.length; i++) {
      var w = when(resolve(els[i].getAttribute("data-release-when")));
      if (els[i].textContent !== w) els[i].textContent = w;
    }

    els = document.querySelectorAll("[data-release-title]");
    for (i = 0; i < els.length; i++) {
      r = resolve(els[i].getAttribute("data-release-title"));
      els[i].textContent = r ? r.title : "";
    }

    // Cards flip to "Out Now" by themselves when their own time passes.
    els = document.querySelectorAll("[data-release-card]");
    for (i = 0; i < els.length; i++) {
      key = els[i].getAttribute("data-release-card");
      r = byId(key);
      var out = !!(r && r._t !== null && r._t <= Date.now());
      els[i].classList.toggle("is-out", out);
      var badge = els[i].querySelector(".badge");
      if (badge && out) badge.textContent = "Out Now";
    }
  }

  window.HPReleases = { list: list, getNext: getNext, byId: byId, render: render };

  function start() {
    render();
    setInterval(render, 1000);
    document.addEventListener("hp:render", render); // other scripts can ask for a refresh
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
