#!/usr/bin/env python3
"""Adds data-i18n to section subtitle <p> tags using the exact HTML text."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

# (filename, old_text, i18n_key)
SUBS = [
    # sorter — 3 remaining (howItWorksDesc was already done)
    ('sorter.html', 'Sorter sistemlerinin avantajları ve faydaları', 'sorter.whyUseDesc'),
    ('sorter.html', 'Sorter sistemlerinin kullanım alanları',         'sorter.whereUsedDesc'),
    ('sorter.html', 'Sorter sistemlerinin teknik detayları',          'sorter.techSpecsDesc'),

    # pallet-elevator
    ('pallet-elevator.html', 'Palet ve kasa asansörü sisteminin çalışma prensibi ve adımları', 'pallet.howItWorksDesc'),
    ('pallet-elevator.html', 'Palet ve kasa asansörü sistemlerinin avantajları ve faydaları',  'pallet.whyUseDesc'),
    ('pallet-elevator.html', 'Palet ve kasa asansörü sistemlerinin kullanım alanları',          'pallet.whereUsedDesc'),
    ('pallet-elevator.html', 'Palet ve kasa asansörü sistemlerinin teknik detayları',           'pallet.techSpecsDesc'),

    # miniload-shuttle
    ('miniload-shuttle.html', 'Miniload sisteminin çalışma prensibi ve adımları', 'miniload.howItWorksDesc'),
    ('miniload-shuttle.html', 'Miniload sistemlerinin avantajları ve faydaları',  'miniload.whyUseDesc'),
    ('miniload-shuttle.html', 'Miniload sistemlerinin kullanım alanları',          'miniload.whereUsedDesc'),
    ('miniload-shuttle.html', 'Miniload sistemlerinin teknik detayları',           'miniload.techSpecsDesc'),

    # pick-to-light
    ('pick-to-light.html', 'Pick-to-light sisteminin çalışma prensibi ve adımları', 'picktolight.howItWorksDesc'),
    ('pick-to-light.html', 'Pick-to-light sistemlerinin avantajları ve faydaları',  'picktolight.whyUseDesc'),
    ('pick-to-light.html', 'Pick-to-light sistemlerinin kullanım alanları',          'picktolight.whereUsedDesc'),
    ('pick-to-light.html', 'Pick-to-light sistemlerinin teknik detayları',           'picktolight.techSpecsDesc'),

    # scada — already partially done, add remaining
    ('scada.html', 'SCADA sistemlerinin avantajları ve faydaları', 'scada.whyUseDesc'),
    ('scada.html', 'SCADA sistemlerinin kullanım alanları',         'scada.whereUsedDesc'),
    ('scada.html', 'SCADA sistemlerinin teknik detayları',          'scada.techSpecsDesc'),

    # production-tracking
    ('production-tracking.html', 'Üretim takibi sisteminin çalışma prensibi ve adımları', 'production.howItWorksDesc'),
    ('production-tracking.html', 'Üretim takibi sistemlerinin avantajları ve faydaları',  'production.whyUseDesc'),
    ('production-tracking.html', 'Üretim takibi sistemlerinin kullanım alanları',          'production.whereUsedDesc'),
    ('production-tracking.html', 'Üretim takibi sistemlerinin teknik detayları',           'production.techSpecsDesc'),

    # data-collection — already partially done, add remaining
    ('data-collection.html', 'Veri toplama sistemlerinin avantajları ve faydaları', 'datacollection.whyUseDesc'),
    ('data-collection.html', 'Veri toplama sistemlerinin kullanım alanları',         'datacollection.whereUsedDesc'),
    ('data-collection.html', 'Veri toplama sistemlerinin teknik detayları',          'datacollection.techSpecsDesc'),

    # custom-software
    ('custom-software.html', 'Özel yazılım geliştirme sürecinin adımları',  'software.howItWorksDesc'),
    ('custom-software.html', 'Özel yazılım geliştirmenin avantajları',      'software.whyUseDesc'),
    ('custom-software.html', 'Özel yazılım çözümlerinin kullanım alanları', 'software.whereUsedDesc'),
    ('custom-software.html', 'Özel yazılım geliştirme teknolojileri',       'software.techSpecsDesc'),

    # plc-programming
    ('plc-programming.html', 'PLC programlama sürecimiz',                                   'plc.howItWorksDesc'),
    ('plc-programming.html', 'PLC programlama hizmetlerimizi tercih etmenizin nedenleri',   'plc.whyLojikonDesc'),
    ('plc-programming.html', 'PLC programlama hizmetlerimizin kullanıldığı sektörler',      'plc.usageAreasDesc'),
    ('plc-programming.html', 'Desteklediğimiz PLC markaları ve programlama dilleri',        'plc.techSpecsDesc'),

    # system-integration
    ('system-integration.html', 'Sistem entegrasyonu sürecimiz',                                  'integration.howItWorksDesc'),
    ('system-integration.html', 'Sistem entegrasyonu hizmetlerimizi tercih etmenizin nedenleri',  'integration.whyLojikonDesc'),
    ('system-integration.html', 'Sistem entegrasyonu hizmetlerimizin kullanıldığı alanlar',       'integration.usageAreasDesc'),
    ('system-integration.html', 'Desteklediğimiz entegrasyon protokolleri ve sistemler',          'integration.techSpecsDesc'),
]

from collections import defaultdict
file_subs = defaultdict(list)
for fn, text, key in SUBS:
    file_subs[fn].append((text, key))

for filename, subs in file_subs.items():
    path = os.path.join(BASE, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old_text, key in subs:
        content = content.replace(f'<p>{old_text}</p>', f'<p data-i18n="{key}">{old_text}</p>')
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  OK: {filename}')
    else:
        print(f'  NO CHANGE: {filename}')

print('\nDone.')
