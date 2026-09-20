// ==========================================================
// SONG SEARCH & FILTER ENGINE
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
