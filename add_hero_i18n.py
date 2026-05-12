#!/usr/bin/env python3
"""Adds data-i18n attributes to hero sections of all HTML pages."""

import re, os

BASE = os.path.dirname(os.path.abspath(__file__))

PAGE_CONFIG = {
    'index.html':               'index',
    'sorter.html':              'sorter',
    'pallet-elevator.html':     'pallet',
    'miniload-shuttle.html':    'miniload',
    'pick-to-light.html':       'picktolight',
    'scada.html':               'scada',
    'production-tracking.html': 'production',
    'data-collection.html':     'datacollection',
    'custom-software.html':     'software',
    'plc-programming.html':     'plc',
    'system-integration.html':  'integration',
}

def add_stat_i18n(stats_block, prefix):
    """Add data-i18n to the 3 stat <p> labels inside hero-stats div."""
    count = [0]
    def repl(m):
        count[0] += 1
        if count[0] > 3:
            return m.group(0)
        return f'<p data-i18n="{prefix}.stat{count[0]}">{m.group(1)}</p>'
    return re.sub(r'<p>([^<]+)</p>', repl, stats_block)

for filename, prefix in PAGE_CONFIG.items():
    path = os.path.join(BASE, filename)
    if not os.path.exists(path):
        print(f'  SKIP (not found): {filename}')
        continue

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # ── 1. h1.hero-title → add data-i18n-html (only first occurrence) ──
    content = content.replace(
        '<h1 class="hero-title">',
        f'<h1 class="hero-title" data-i18n-html="{prefix}.heroTitleHTML">',
        1
    )

    # ── 2. p.hero-description → add data-i18n ──
    content = content.replace(
        '<p class="hero-description">',
        f'<p class="hero-description" data-i18n="{prefix}.heroDesc">',
        1
    )

    # ── 3. Button texts → wrap in <span data-i18n> ──
    # "Nasıl Çalışır?" (after fa-cogs icon)
    content = re.sub(
        r'(<i class="fas fa-cogs"></i>)\s*\n(\s*)Nasıl Çalışır\?',
        r'\1\n\2<span data-i18n="btn.howItWorks">Nasıl Çalışır?</span>',
        content, count=1
    )
    # "İletişim" (after fa-phone icon, hero only)
    content = re.sub(
        r'(<i class="fas fa-phone"></i>)\s*\n(\s*)İletişim',
        r'\1\n\2<span data-i18n="btn.contact">İletişim</span>',
        content, count=1
    )
    # "Teklif Al" (after fa-paper-plane icon, hero only)
    content = re.sub(
        r'(<i class="fas fa-paper-plane"></i>)\s*\n(\s*)Teklif Al',
        r'\1\n\2<span data-i18n="btn.quote">Teklif Al</span>',
        content, count=1
    )
    # Index-specific: "Çözümlerimiz" (after fa-cogs icon)
    if filename == 'index.html':
        content = re.sub(
            r'(<i class="fas fa-cogs"></i>)\s*\n(\s*)Çözümlerimiz',
            r'\1\n\2<span data-i18n="btn.ourSolutions">Çözümlerimiz</span>',
            content, count=1
        )

    # ── 4. hero-stats → add data-i18n to stat <p> labels ──
    hero_stats_start = content.find('<div class="hero-stats">')
    if hero_stats_start >= 0:
        # Walk forward counting div depth to find the closing </div>
        depth = 0
        i = hero_stats_start
        hero_stats_end = -1
        while i < len(content):
            if content[i:i+4] == '<div':
                depth += 1
            elif content[i:i+6] == '</div>':
                depth -= 1
                if depth == 0:
                    hero_stats_end = i + 6
                    break
            i += 1

        if hero_stats_end > 0:
            stats_block = content[hero_stats_start:hero_stats_end]
            new_stats_block = add_stat_i18n(stats_block, prefix)
            content = content[:hero_stats_start] + new_stats_block + content[hero_stats_end:]

    # ── 5. Add <script src="js/i18n.js"> before emailjs script ──
    emailjs_tag = '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>'
    i18n_tag    = '<script src="js/i18n.js"></script>'
    if i18n_tag not in content and emailjs_tag in content:
        content = content.replace(emailjs_tag, i18n_tag + '\n                ' + emailjs_tag, 1)

    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  OK: {filename}')
    else:
        print(f'  NO CHANGE: {filename}')

print('\nDone.')
