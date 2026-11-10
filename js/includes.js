(function () {
    const PARTIALS = {
        'partial-header':   'partials/header.html',
        'partial-footer':   'partials/footer.html',
        'partial-solutions':'partials/solutions-section.html',
        'partial-contact':  'partials/contact-section.html',
    };

    async function loadPartial(id, url) {
        const el = document.getElementById(id);
        if (!el) return;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} yüklenemedi: ${res.status}`);
        el.outerHTML = await res.text();
    }

    window._includesReady = Promise.all(
        Object.entries(PARTIALS).map(([id, url]) =>
            loadPartial(id, url).catch(e => console.warn(e))
        )
    ).then(() => {
        document.dispatchEvent(new CustomEvent('includes:ready'));
    });
})();
