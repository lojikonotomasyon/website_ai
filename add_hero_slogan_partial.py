#!/usr/bin/env python3
"""
Replace hero-slogan div in each HTML page with PARTIAL markers.
"""
import re

pages = [
    'sorter.html',
    'pallet-elevator.html',
    'miniload-shuttle.html',
    'pick-to-light.html',
    'scada.html',
    'production-tracking.html',
    'data-collection.html',
    'custom-software.html',
    'index.html',
]

marker_start = '<!-- PARTIAL:hero-slogan:START -->'
marker_end   = '<!-- PARTIAL:hero-slogan:END -->'

# Match the hero-slogan div (any variant of initial var1/var2 text)
pattern = re.compile(
    r'<div class="hero-slogan">.*?</div>\s*\n',
    re.DOTALL
)

for fname in pages:
    with open(fname, encoding='utf-8') as f:
        html = f.read()

    if marker_start in html:
        print(f'  {fname}: already has markers, skipping')
        continue

    def replace_slogan(m):
        return f'{marker_start}\n{m.group(0).rstrip()}\n{marker_end}\n'

    new_html, count = pattern.subn(replace_slogan, html, count=1)

    if count == 0:
        print(f'  WARNING: hero-slogan not found in {fname}')
        continue

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'  {fname}: markers added')

print('\nDone. Run python3 build.py to inject the partial.')
