/*
 * HeyPercentage — release schedule
 * --------------------------------
 * Edit THIS file whenever a release is added, moved or goes out.
 * Every release has its OWN date + time, so two songs can drop on different
 * days, or on the same day at different hours.
 *
 * releaseAt  ISO 8601 date-time WITH a UTC offset, e.g.
 *              "2026-12-05T18:00:00+02:00"   (18:00 South African time)
 *            South Africa is always +02:00 (no daylight saving).
 *            Leave as null for "Date TBA".
 * cover      file inside /artworks
 * snippet    file inside /snips (leave null if there is no preview yet)
 * link       pre-save / smart link / streaming link
 *
 * IMPORTANT: anything in /snips is a public download. Only put short,
 * low-bitrate previews there — never a full unreleased track.
 */

window.HP_TIMEZONE = "Africa/Johannesburg"; // the "artist time" shown on the site

window.HP_UPCOMING = [
  {
    id: "take-me-home",
    title: "Take Me Home",
    subtitle: "(-)",
    cover: "artworks/Take Me Home.jpeg",
    snippet: "snips/takemehome.mp3",
    link: "https://bfan.link/percudie", // TODO: check this is the Take Me Home link, it matches PERCUDIE's
    releaseAt: "2026-11-26T00:13:00+02:00" // from your old countdown.js (00:13 South African time)
  },
  {
    id: "percudie",
    title: "PERCUDIE",
    subtitle: "(-)",
    cover: "artworks/PERCUDIE.jpg",
    snippet: null, // e.g. "snips/percudie.mp3"
    link: "https://bfan.link/percudie",
    releaseAt: null // e.g. "2026-12-12T12:00:00+02:00"
  }
];

/* Shown in the home-page "Showcase" carousel after the upcoming releases.
 * Keep to the last few — it is only a teaser, /songs.html has everything. */
window.HP_LATEST = [
  { title: "Peace of Mind",  subtitle: "ft. keen", cover: "artworks/Peace of Mind.jpg", link: "https://open.spotify.com/album/2eErfR0qIpSpx8zYZ2GMBm" },
  { title: "Obsession",      subtitle: "",         cover: "artworks/Obsession.jpg",     link: "https://open.spotify.com/album/0Nwd2bxtzyD2VSgv2fszzv" },
  { title: "Vacation",       subtitle: "",         cover: "artworks/Vacation.jpg",      link: "https://open.spotify.com/album/3AcLorCVa4z0EL6951uoJZ" },
  { title: "Trust Issues",   subtitle: "ft. Luvarzy", cover: "artworks/Trust Issues.jpg", link: "https://push.fm/fl/pti" },
  { title: "Twilight",       subtitle: "",         cover: "artworks/Twilight.jpg",      link: "https://push.fm/fl/ptwilight" }
];
