#!/usr/bin/env python3
"""Adds data-i18n to section headers and the About section in index.html."""

import re, os

BASE = os.path.dirname(os.path.abspath(__file__))

# ── Section h2 replacements (applied to all 10 sub-pages) ──────────────────
SECTION_H2 = [
    ('<h2>Nasıl Çalışır?</h2>',  '<h2 data-i18n="sections.howItWorks">Nasıl Çalışır?</h2>'),
    ('<h2>Neden Kullanılır?</h2>', '<h2 data-i18n="sections.whyUse">Neden Kullanılır?</h2>'),
    ('<h2>Neden Lojikon?</h2>',   '<h2 data-i18n="sections.whyLojikon">Neden Lojikon?</h2>'),
    ('<h2>Nerede Kullanılır?</h2>', '<h2 data-i18n="sections.whereUsed">Nerede Kullanılır?</h2>'),
    ('<h2>Kullanım Alanları</h2>', '<h2 data-i18n="sections.usageAreas">Kullanım Alanları</h2>'),
    ('<h2>Teknik Özellikler</h2>', '<h2 data-i18n="sections.techSpecs">Teknik Özellikler</h2>'),
]

# ── Per-page section subtitle replacements ─────────────────────────────────
# Format: (filename, old_text, i18n_key)
PAGE_SUBTITLES = [
    # sorter
    ('sorter.html', 'Sorter sisteminin çalışma prensibi ve adımları', 'sorter.howItWorksDesc'),
    ('sorter.html', 'Sorter sistemleri neden tercih edilmeli?', 'sorter.whyUseDesc'),
    ('sorter.html', 'Sorter sistemlerinin kullanıldığı endüstriler ve uygulamalar', 'sorter.whereUsedDesc'),
    ('sorter.html', 'Sorter sistemlerimizin detaylı teknik özellikleri', 'sorter.techSpecsDesc'),

    # pallet-elevator
    ('pallet-elevator.html', 'Palet elevatörünün çalışma prensibi ve adımları', 'pallet.howItWorksDesc'),
    ('pallet-elevator.html', 'Palet elevatörleri neden tercih edilmeli?', 'pallet.whyUseDesc'),
    ('pallet-elevator.html', 'Palet elevatörlerinin kullanıldığı endüstriler', 'pallet.whereUsedDesc'),
    ('pallet-elevator.html', 'Palet elevatörlerimizin detaylı teknik özellikleri', 'pallet.techSpecsDesc'),

    # miniload-shuttle
    ('miniload-shuttle.html', 'Miniload shuttle sisteminin çalışma prensibi ve adımları', 'miniload.howItWorksDesc'),
    ('miniload-shuttle.html', 'Miniload shuttle sistemleri neden tercih edilmeli?', 'miniload.whyUseDesc'),
    ('miniload-shuttle.html', 'Miniload shuttle sistemlerinin kullanıldığı endüstriler', 'miniload.whereUsedDesc'),
    ('miniload-shuttle.html', 'Miniload shuttle sistemlerimizin detaylı teknik özellikleri', 'miniload.techSpecsDesc'),

    # pick-to-light
    ('pick-to-light.html', 'Pick to light sisteminin çalışma prensibi ve adımları', 'picktolight.howItWorksDesc'),
    ('pick-to-light.html', 'Pick to light sistemleri neden tercih edilmeli?', 'picktolight.whyUseDesc'),
    ('pick-to-light.html', 'Pick to light sistemlerinin kullanıldığı endüstriler', 'picktolight.whereUsedDesc'),
    ('pick-to-light.html', 'Pick to light sistemlerimizin detaylı teknik özellikleri', 'picktolight.techSpecsDesc'),

    # scada
    ('scada.html', 'SCADA sisteminin çalışma prensibi ve adımları', 'scada.howItWorksDesc'),
    ('scada.html', 'SCADA sistemleri neden tercih edilmeli?', 'scada.whyUseDesc'),
    ('scada.html', 'SCADA sistemlerinin kullanıldığı endüstriler', 'scada.whereUsedDesc'),
    ('scada.html', 'SCADA sistemlerimizin detaylı teknik özellikleri', 'scada.techSpecsDesc'),

    # production-tracking
    ('production-tracking.html', 'Üretim takip sisteminin çalışma prensibi ve adımları', 'production.howItWorksDesc'),
    ('production-tracking.html', 'Üretim takip sistemleri neden tercih edilmeli?', 'production.whyUseDesc'),
    ('production-tracking.html', 'Üretim takip sistemlerinin kullanıldığı endüstriler', 'production.whereUsedDesc'),
    ('production-tracking.html', 'Üretim takip sistemlerimizin detaylı teknik özellikleri', 'production.techSpecsDesc'),

    # data-collection
    ('data-collection.html', 'Veri toplama sisteminin çalışma prensibi ve adımları', 'datacollection.howItWorksDesc'),
    ('data-collection.html', 'Veri toplama sistemleri neden tercih edilmeli?', 'datacollection.whyUseDesc'),
    ('data-collection.html', 'Veri toplama sistemlerinin kullanıldığı endüstriler', 'datacollection.whereUsedDesc'),
    ('data-collection.html', 'Veri toplama sistemlerimizin detaylı teknik özellikleri', 'datacollection.techSpecsDesc'),

    # custom-software
    ('custom-software.html', 'Özel yazılım geliştirme sürecimiz ve adımları', 'software.howItWorksDesc'),
    ('custom-software.html', 'Özel yazılım çözümleri neden tercih edilmeli?', 'software.whyUseDesc'),
    ('custom-software.html', 'Özel yazılım çözümlerimizin kullanıldığı endüstriler', 'software.whereUsedDesc'),
    ('custom-software.html', 'Özel yazılım çözümlerimizin detaylı teknik özellikleri', 'software.techSpecsDesc'),

    # plc-programming
    ('plc-programming.html', 'PLC programlama sürecimiz ve adımları', 'plc.howItWorksDesc'),
    ('plc-programming.html', 'Neden PLC programlama için Lojikon\'u tercih etmelisiniz?', 'plc.whyLojikonDesc'),
    ('plc-programming.html', 'PLC programlama hizmetlerimizin kullanım alanları', 'plc.usageAreasDesc'),
    ('plc-programming.html', 'PLC programlama hizmetlerimizin detaylı teknik özellikleri', 'plc.techSpecsDesc'),

    # system-integration
    ('system-integration.html', 'Sistem entegrasyon sürecimiz ve adımları', 'integration.howItWorksDesc'),
    ('system-integration.html', 'Neden sistem entegrasyonu için Lojikon\'u tercih etmelisiniz?', 'integration.whyLojikonDesc'),
    ('system-integration.html', 'Sistem entegrasyon hizmetlerimizin kullanım alanları', 'integration.usageAreasDesc'),
    ('system-integration.html', 'Sistem entegrasyon hizmetlerimizin detaylı teknik özellikleri', 'integration.techSpecsDesc'),
]

SUB_PAGES = [
    'sorter.html', 'pallet-elevator.html', 'miniload-shuttle.html', 'pick-to-light.html',
    'scada.html', 'production-tracking.html', 'data-collection.html',
    'custom-software.html', 'plc-programming.html', 'system-integration.html',
]

# ── 1. Section h2 titles in all 10 sub-pages ──────────────────────────────
for filename in SUB_PAGES:
    path = os.path.join(BASE, filename)
    if not os.path.exists(path):
        print(f'  SKIP (not found): {filename}')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in SECTION_H2:
        content = content.replace(old, new)
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  h2 OK: {filename}')
    else:
        print(f'  h2 NO CHANGE: {filename}')

# ── 2. Per-page section subtitles ─────────────────────────────────────────
# Group by file to avoid re-reading repeatedly
from collections import defaultdict
file_subs = defaultdict(list)
for filename, old_text, key in PAGE_SUBTITLES:
    file_subs[filename].append((old_text, key))

for filename, subs in file_subs.items():
    path = os.path.join(BASE, filename)
    if not os.path.exists(path):
        print(f'  SKIP (not found): {filename}')
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old_text, key in subs:
        old_tag = f'<p>{old_text}</p>'
        new_tag = f'<p data-i18n="{key}">{old_text}</p>'
        content = content.replace(old_tag, new_tag)
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  subtitle OK: {filename}')
    else:
        print(f'  subtitle NO CHANGE: {filename}')

# ── 3. About section in index.html ────────────────────────────────────────
index_path = os.path.join(BASE, 'index.html')
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()
original = content

# h2
content = content.replace(
    '<h2>Hakkımızda</h2>',
    '<h2 data-i18n="about.title">Hakkımızda</h2>',
)
# subtitle p
content = content.replace(
    '<p>2014\'ten beri endüstriyel otomasyon alanında hizmet veriyoruz</p>',
    '<p data-i18n="about.subtitle">2014\'ten beri endüstriyel otomasyon alanında hizmet veriyoruz</p>',
)
# first h3 (Lojikon Otomasyon)
content = content.replace(
    '<h3>Lojikon Otomasyon</h3>',
    '<h3 data-i18n="about.h3">Lojikon Otomasyon</h3>',
    1
)
# body paragraph (multiline — use regex)
content = re.sub(
    r'(<h3 data-i18n="about\.h3">Lojikon Otomasyon</h3>\s*<p>)\s*\n\s*Lojikon.*?operasyonel verimliliği artırıyoruz\.\s*\n(\s*</p>)',
    r'<h3 data-i18n="about.h3">Lojikon Otomasyon</h3>\n                    <p data-i18n="about.desc">\n                        Lojikon, endüstriyel otomasyon ve intralogistics çözümleri konusunda uzmanlaşmış \n                        bir şirkettir. Müşterilerimizin ihtiyaçlarına özel çözümler geliştirerek, \n                        operasyonel verimliliği artırıyoruz.\n                    </p>',
    content,
    flags=re.DOTALL
)
# "Neden Biz?" h3
content = content.replace(
    '<h3>Neden Biz?</h3>',
    '<h3 data-i18n="about.whyUs">Neden Biz?</h3>',
)
# li items
li_map = [
    ('10+ yıl deneyim',         'about.li1'),
    ('500+ başarılı proje',     'about.li2'),
    ('%99.9 başarı oranı',      'about.li3'),
    ('7/24 teknik destek',      'about.li4'),
    ('PLC ve SCADA uzmanlığı',  'about.li5'),
    ('Endüstri 4.0 çözümleri',  'about.li6'),
]
for text, key in li_map:
    content = content.replace(
        f'<li>{text}</li>',
        f'<li data-i18n="{key}">{text}</li>',
    )

if content != original:
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  about OK: index.html')
else:
    print('  about NO CHANGE: index.html')

print('\nDone.')
