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

import os, sys, re, hashlib

BASE     = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(BASE, 'partials')

PARTIAL_MAP = {
    'header':            'partials/header.html',
    'footer':            'partials/footer.html',
    'solutions-section': 'partials/solutions-section.html',
    'contact-section':   'partials/contact-section.html',
    'hero-slogan':       'partials/hero-slogan.html',
}

html_files = sorted(
    f for f in os.listdir(BASE)
    if f.endswith('.html')
)

total_updated = 0

ASSET_RE = re.compile(r'((?:src|href)=")(?!https?:|//)([^"?#]+\.(?:css|js))(?:\?v=[0-9a-z]+)?"')

def versioned(match):
    asset = os.path.join(BASE, match.group(2).lstrip('/'))
    if not os.path.isfile(asset):
        return match.group(0)
    digest = hashlib.md5(open(asset, 'rb').read()).hexdigest()[:8]
    return f'{match.group(1)}{match.group(2)}?v={digest}"'

for fname in html_files:
    fpath = os.path.join(BASE, fname)
    original = open(fpath, encoding='utf-8').read()
    content = original
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

    content = ASSET_RE.sub(versioned, content)
    changed = changed or content != original

    if changed:
        open(fpath, 'w', encoding='utf-8').write(content)
        print(f'✓  {fname}')
        total_updated += 1

print(f'\n{total_updated} dosya güncellendi.')
print('Partial değiştirince tekrar "python3 build.py" çalıştır.')
