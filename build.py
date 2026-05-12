#!/usr/bin/env python3
# ===== LOJIKON - Static Site Builder =====
#
# Kullanım: python3 build.py
#
# partials/ klasöründeki dosyaları tüm HTML sayfalarına otomatik enjekte eder.
# Sadece partial dosyasını değiştir, sonra "python3 build.py" çalıştır.
# Tüm sayfalarda tek seferde güncellenir.
#
# Marker formatı (HTML dosyalarında):
#   <!-- PARTIAL:header:START -->  ...içerik...  <!-- PARTIAL:header:END -->

import os, sys

BASE     = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(BASE, 'partials')

PARTIAL_MAP = {
    'header':            'partials/header.html',
    'footer':            'partials/footer.html',
    'solutions-section': 'partials/solutions-section.html',
    'services-section':  'partials/services-section.html',
    'contact-section':   'partials/contact-section.html',
    'hero-slogan':       'partials/hero-slogan.html',
}

html_files = sorted(
    f for f in os.listdir(BASE)
    if f.endswith('.html')
)

total_updated = 0

for fname in html_files:
    fpath = os.path.join(BASE, fname)
    content = open(fpath, encoding='utf-8').read()
    changed = False

    for name, partial_path in PARTIAL_MAP.items():
        start_marker = f'<!-- PARTIAL:{name}:START -->'
        end_marker   = f'<!-- PARTIAL:{name}:END -->'

        start_idx = content.find(start_marker)
        end_idx   = content.find(end_marker)
        if start_idx == -1 or end_idx == -1:
            continue

        partial_content = open(
            os.path.join(BASE, partial_path), encoding='utf-8'
        ).read().rstrip()

        new_block = (
            f'{start_marker}\n'
            f'{partial_content}\n'
            f'    {end_marker}'
        )

        before  = content[:start_idx]
        after   = content[end_idx + len(end_marker):]
        content = before + new_block + after
        changed = True

    if changed:
        open(fpath, 'w', encoding='utf-8').write(content)
        print(f'✓  {fname}')
        total_updated += 1

print(f'\n{total_updated} dosya güncellendi.')
print('Partial değiştirince tekrar "python3 build.py" çalıştır.')
