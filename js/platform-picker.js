// ==========================================================
// PLATFORM PICKER
// Adds a "choose platform + Listen" row under each song card.
// "Listen" is a normal link, so nothing redirects until it is
// clicked (keyboard and screen-reader friendly). The choice is
// remembered on this device only.
// ==========================================================

(function () {
    const STORAGE_KEY = 'hp_platform';
    const ALL = 'all';

    function loadChoice() {
        try { return localStorage.getItem(STORAGE_KEY) || ALL; } catch (e) { return ALL; }
    }
    function saveChoice(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage blocked: fine */ }
    }

    function isSafeUrl(url) {
        try { return new URL(url).protocol === 'https:'; } catch (e) { return false; }
    }

    const grid = document.getElementById('songsGrid');
    if (!grid || typeof SONG_LINKS === 'undefined' || typeof PLATFORMS === 'undefined') return;

    const rows = [];

    grid.querySelectorAll('.song-item').forEach((item) => {
        const card = item.querySelector('a.vault-card');
        if (!card) return;

        const key = item.getAttribute('data-key');
        const fanLink = card.getAttribute('href');
        const links = (key && SONG_LINKS[key]) || {};
        const available = PLATFORMS.filter((p) => links[p.id] && isSafeUrl(links[p.id]));
        if (available.length === 0) return; // no direct links yet: card keeps its push.fm link

        const title = item.querySelector('h4')?.textContent.trim() || 'this song';
        const selectId = `platform-${key}`;

        const row = document.createElement('div');
        row.className = 'platform-row';

        const label = document.createElement('label');
        label.className = 'sr-only';
        label.htmlFor = selectId;
        label.textContent = `Choose where to listen to ${title}`;

        const select = document.createElement('select');
        select.id = selectId;
        select.className = 'platform-select';
        select.add(new Option('All platforms', ALL));
        available.forEach((p) => select.add(new Option(p.label, p.id)));

        const go = document.createElement('a');
        go.className = 'platform-go';
        go.target = '_blank';
        go.rel = 'noopener';
        go.textContent = 'Listen';

        row.append(label, select, go);
        item.appendChild(row);

        function update() {
            const url = select.value === ALL ? fanLink : links[select.value];
            go.href = url;
            const name = select.value === ALL ? 'all platforms' : available.find((p) => p.id === select.value).label;
            go.setAttribute('aria-label', `Listen to ${title} on ${name}`);
        }

        select.addEventListener('change', () => {
            saveChoice(select.value);
            rows.forEach((r) => r.apply(select.value)); // keep every card in sync
        });

        rows.push({
            apply(value) {
                select.value = available.some((p) => p.id === value) ? value : ALL;
                update();
            },
        });
    });

    const saved = loadChoice();
    rows.forEach((r) => r.apply(saved));
})();
