// Renders technical spec cards from window.PAGE_SPECS config.
// Called by i18n.js on every language change and on DOMContentLoaded.
window.renderSpecsForLang = function (lang) {
    if (!window.PAGE_SPECS) return;
    const container = document.getElementById('specs-container');
    if (!container) return;

    const cardClass = window.PAGE_SPECS.layout === 'columns' ? 'specs-column' : 'spec-card';

    container.innerHTML = window.PAGE_SPECS.cards.map(function (card) {
        const title = typeof card.title === 'string' ? card.title : (card.title[lang] || card.title.tr);
        const items = card.items.map(function (item) {
            const label = typeof item.label === 'string' ? item.label : (item.label[lang] || item.label.tr);
            const value = typeof item.value === 'string' ? item.value : (item.value[lang] || item.value.tr);
            return '<li><strong>' + label + ':</strong> ' + value + '</li>';
        }).join('\n                ');
        return '<div class="' + cardClass + '">\n'
             + '            <h3>' + title + '</h3>\n'
             + '            <ul>\n                ' + items + '\n            </ul>\n'
             + '        </div>';
    }).join('\n        ');
};

document.addEventListener('DOMContentLoaded', function () {
    var lang = localStorage.getItem('lojikon_lang') || 'tr';
    window.renderSpecsForLang(lang);
});
