/*
 * Review menu for the Guildboard v2 mockup. Not part of the design: it lets
 * whoever is looking at the mockup jump straight to any view, and can be
 * folded away with the button in the bottom-left corner.
 *
 * Each page's bundled template loads this file with <script src="nav.js">,
 * so it runs after the bundle has replaced the document. The menu lives in a
 * shadow root on <html> (outside <body>, which the mockup renders into), so
 * neither side's CSS leaks into the other.
 */
(function () {
    if (document.getElementById('guildboard-review-nav')) return;

    var GROUPS = [
        {
            label: 'Guildboard',
            views: [
                ['home.html', 'Front page'],
                ['claim.html', 'Claim your guild'],
                ['report.html', 'Report a problem']
            ]
        },
        {
            label: 'Guild page',
            views: [
                ['index.html', 'Guild timeline'],
                ['roster.html', 'Roster by rank'],
                ['member.html', 'Member profile'],
                ['leaderboards.html', 'Leaderboards'],
                ['lore.html', 'Lore'],
                ['settings.html', 'Guild settings']
            ]
        }
    ];

    // Open or closed carries over between views. Storage can be unavailable
    // (private windows, blocked site data); the menu then just starts open.
    var STORAGE_KEY = 'guildboard-v2-review-nav';
    function readOpen() {
        try {
            return localStorage.getItem(STORAGE_KEY) !== 'closed';
        } catch (e) {
            return true;
        }
    }
    function saveOpen(open) {
        try {
            localStorage.setItem(STORAGE_KEY, open ? 'open' : 'closed');
        } catch (e) {
            /* not remembered */
        }
    }

    var current = location.pathname.split('/').pop() || 'index.html';

    var ICON_VIEWS =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/>' +
        '<rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>' +
        '<rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>';
    var ICON_CLOSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    var css =
        ':host { all: initial; position: fixed; left: 16px; bottom: 16px; z-index: 99990;' +
        '  display: flex; flex-direction: column; align-items: flex-start; gap: 8px;' +
        '  font: 14px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #f3ece4; }' +
        '@media print { :host { display: none; } }' +
        '[hidden] { display: none !important; }' +
        'nav { box-sizing: border-box; width: min(240px, calc(100vw - 32px));' +
        '  max-height: calc(100vh - 96px); overflow-y: auto; padding: 12px 8px;' +
        '  background: rgba(8, 37, 51, 0.97); border: 1px solid rgba(226, 194, 171, 0.3);' +
        '  border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45); }' +
        '.title { margin: 0 8px 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em;' +
        '  text-transform: uppercase; color: #e2c2ab; }' +
        '.group { margin: 10px 8px 4px; font-size: 11px; letter-spacing: 0.06em;' +
        '  text-transform: uppercase; color: rgba(243, 236, 228, 0.6); }' +
        'ul { list-style: none; margin: 0; padding: 0; }' +
        'a { display: block; padding: 6px 8px; border-radius: 6px; color: inherit;' +
        '  text-decoration: none; border-left: 3px solid transparent; }' +
        'a:hover { background: rgba(226, 194, 171, 0.1); }' +
        'a[aria-current="page"] { background: rgba(226, 194, 171, 0.16); border-left-color: #e2c2ab;' +
        '  color: #fff; font-weight: 600; }' +
        'button { box-sizing: border-box; width: 44px; height: 44px; padding: 0; display: grid;' +
        '  place-items: center; cursor: pointer; color: #f3ece4; background: rgba(8, 37, 51, 0.97);' +
        '  border: 1px solid rgba(226, 194, 171, 0.3); border-radius: 50%;' +
        '  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45); }' +
        'button:hover { background: rgb(14, 56, 74); }' +
        'a:focus-visible, button:focus-visible { outline: 2px solid #e2c2ab; outline-offset: 2px; }' +
        'svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2;' +
        '  stroke-linecap: round; stroke-linejoin: round; }';

    var list = GROUPS.map(function (group) {
        var items = group.views
            .map(function (view) {
                var here = view[0] === current ? ' aria-current="page"' : '';
                return '<li><a href="' + view[0] + '"' + here + '>' + view[1] + '</a></li>';
            })
            .join('');
        return '<p class="group">' + group.label + '</p><ul>' + items + '</ul>';
    }).join('');

    var host = document.createElement('div');
    host.id = 'guildboard-review-nav';
    var root = host.attachShadow({ mode: 'open' });
    root.innerHTML =
        '<style>' + css + '</style>' +
        '<nav id="panel" aria-label="Mockup views"><p class="title">Mockup views · v2</p>' + list + '</nav>' +
        '<button type="button" aria-controls="panel"></button>';

    var panel = root.getElementById('panel');
    var button = root.querySelector('button');

    function render(open) {
        panel.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
        var label = open ? 'Hide mockup views' : 'Show mockup views';
        button.setAttribute('aria-label', label);
        button.title = label;
        button.innerHTML = open ? ICON_CLOSE : ICON_VIEWS;
    }

    button.addEventListener('click', function () {
        var open = panel.hidden;
        render(open);
        saveOpen(open);
    });
    panel.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        render(false);
        saveOpen(false);
        button.focus();
    });

    render(readOpen());
    document.documentElement.appendChild(host);
})();
