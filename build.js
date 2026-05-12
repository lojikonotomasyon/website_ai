#!/usr/bin/env node
// ===== LOJIKON - Static Site Builder =====
//
// Kullanım: node build.js
//
// partials/ klasöründeki dosyaları tüm HTML sayfalarına otomatik enjekte eder.
// Sadece partial dosyasını değiştir, sonra "node build.js" çalıştır.
// Tüm sayfalarda tek seferde güncellenir.
//
// Marker formatı (HTML dosyalarında):
//   <!-- PARTIAL:header:START -->  ...içerik...  <!-- PARTIAL:header:END -->

const fs   = require('fs');
const path = require('path');

const BASE     = __dirname;
const PARTIALS = path.join(BASE, 'partials');

// Hangi partial → hangi marker
const PARTIAL_MAP = {
    'header':             'partials/header.html',
    'footer':             'partials/footer.html',
    'solutions-section':  'partials/solutions-section.html',
    'services-section':   'partials/services-section.html',
    'contact-section':    'partials/contact-section.html',
};

// Tüm HTML dosyalarını bul (build.js ve partials/ hariç)
const htmlFiles = fs.readdirSync(BASE)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(BASE, f));

let totalUpdated = 0;

htmlFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed  = false;

    for (const [name, partialPath] of Object.entries(PARTIAL_MAP)) {
        const startMarker = `<!-- PARTIAL:${name}:START -->`;
        const endMarker   = `<!-- PARTIAL:${name}:END -->`;

        const startIdx = content.indexOf(startMarker);
        const endIdx   = content.indexOf(endMarker);
        if (startIdx === -1 || endIdx === -1) continue;

        const partialContent = fs.readFileSync(path.join(BASE, partialPath), 'utf8').trimEnd();
        const newBlock = `${startMarker}\n${partialContent}\n    ${endMarker}`;

        const before = content.slice(0, startIdx);
        const after  = content.slice(endIdx + endMarker.length);
        content = before + newBlock + after;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓  ${path.basename(filePath)}`);
        totalUpdated++;
    }
});

console.log(`\n${totalUpdated} dosya güncellendi.`);
console.log('Partial değiştirince tekrar "node build.js" çalıştır.');
