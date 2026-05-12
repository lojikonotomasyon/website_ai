#!/usr/bin/env python3
"""
Replace hardcoded spec card content with an empty container div,
and inject <script> tags for config + spec-renderer before i18n.js.
"""
import re

pages = {
    'sorter.html':             ('grid',    'config/sorter.js'),
    'pallet-elevator.html':    ('grid',    'config/pallet-elevator.js'),
    'miniload-shuttle.html':   ('grid',    'config/miniload-shuttle.js'),
    'pick-to-light.html':      ('grid',    'config/pick-to-light.js'),
    'scada.html':              ('grid',    'config/scada.js'),
    'production-tracking.html':('grid',    'config/production-tracking.js'),
    'data-collection.html':    ('grid',    'config/data-collection.js'),
    'custom-software.html':    ('grid',    'config/custom-software.js'),
    'plc-programming.html':    ('columns', 'config/plc-programming.js'),
    'system-integration.html': ('columns', 'config/system-integration.js'),
}

for fname, (layout, cfg) in pages.items():
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    original = html

    # 1. Replace spec grid/columns content with empty container
    if layout == 'grid':
        pattern = r'(<div class="specs-grid">)\s*.*?(\s*</div>\s*</div>\s*</section>)'
        repl = r'<div class="specs-grid" id="specs-container"></div>\2'
    else:
        pattern = r'(<div class="specs-columns">)\s*.*?(\s*</div>\s*</div>\s*</section>)'
        repl = r'<div class="specs-columns" id="specs-container"></div>\2'

    html_new = re.sub(pattern, repl, html, count=1, flags=re.DOTALL)

    if html_new == html:
        print(f'WARNING: spec grid replacement failed for {fname}')
    else:
        html = html_new
        print(f'  {fname}: spec container replaced')

    # 2. Inject config + renderer scripts before i18n.js
    i18n_tag = '<script src="js/i18n.js"></script>'
    inject = f'<script src="{cfg}"></script>\n    <script src="js/spec-renderer.js"></script>\n    '
    if inject.strip() not in html and i18n_tag in html:
        html = html.replace(i18n_tag, inject + i18n_tag)
        print(f'  {fname}: script tags injected')
    elif inject.strip() in html:
        print(f'  {fname}: script tags already present')
    else:
        print(f'WARNING: i18n.js script tag not found in {fname}')

    if html != original:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  {fname}: saved')

print('\nDone.')
