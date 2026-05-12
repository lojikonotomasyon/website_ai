# Lojikon Website — Claude için Proje Notları

## Proje Türü
Tamamen statik HTML/CSS/JS sitesi. Build adımı gerektirir (sunucu yok, framework yok).

---

## Kritik: Build Sistemi

### `build.py` — Her Partial Değişikliğinde Çalıştırılmalı

```bash
python3 build.py
```

**Ne yapar:** `partials/` klasöründeki dosyaları tüm HTML sayfalarına otomatik enjekte eder.

**Neden gerekli:** Ortak bileşenler (header, footer, çözümler, hizmetler, iletişim) her HTML dosyasında
`<!-- PARTIAL:xxx:START -->` / `<!-- PARTIAL:xxx:END -->` marker'ları arasına yazılır.
Partial dosyası değişince bu marker'lar arasındaki içerik güncellenir.

**Kurallar:**
- Bir partial dosyasını düzenlediğinde → hemen `python3 build.py` çalıştır
- HTML dosyalarındaki marker blokları arasına doğrudan yazma — bir sonraki build'de üzerine yazılır
- Tüm içerik değişiklikleri için `partials/` klasörünü düzenle

---

## Dosya Yapısı

```
website_ai/
├── partials/                    ← TEK KAYNAK — buradan değiştir
│   ├── header.html              ← Menü, logo, sosyal linkler
│   ├── footer.html              ← Alt bilgi, linkler, copyright
│   ├── solutions-section.html   ← Çözümler kartları (4 ürün)
│   ├── services-section.html    ← Hizmetler kartları (6 hizmet)
│   └── contact-section.html     ← İletişim formu + bilgileri
│
├── build.py                     ← Partial'ları tüm sayfalara enjekte eder
├── build.js                     ← Node.js alternatifi (Node yüklüyse)
│
├── style.css                    ← Ana CSS (tüm sayfalar)
├── script.js                    ← Ana JS (mobile menu, form, slider)
│
├── index.html                   ← Ana sayfa
├── sorter.html                  ← Çözüm sayfası
├── pallet-elevator.html         ← Çözüm sayfası
├── miniload-shuttle.html        ← Çözüm sayfası
├── pick-to-light.html           ← Çözüm sayfası
├── scada.html                   ← Hizmet sayfası
├── production-tracking.html     ← Hizmet sayfası
├── data-collection.html         ← Hizmet sayfası
├── custom-software.html         ← Hizmet sayfası
├── plc-programming.html         ← Hizmet sayfası
└── system-integration.html      ← Hizmet sayfası
```

---

## Sayfa Yapısı (Her HTML Dosyası)

Her sayfa şu yapıya sahiptir:

```html
<body>
    <!-- PARTIAL:header:START -->
    <header>...</header>          ← build.py tarafından enjekte edilir
    <!-- PARTIAL:header:END -->

    <!-- Sayfa-özgü içerik (hero, animasyon, bölümler) -->

    <!-- PARTIAL:solutions-section:START -->
    <section id="solutions">...</section>
    <!-- PARTIAL:solutions-section:END -->

    <!-- PARTIAL:services-section:START -->
    <section id="services">...</section>
    <!-- PARTIAL:services-section:END -->

    <!-- PARTIAL:contact-section:START -->
    <section id="contact">...</section>
    <!-- PARTIAL:contact-section:END -->

    <!-- PARTIAL:footer:START -->
    <footer>...</footer>
    <!-- PARTIAL:footer:END -->

    <script src="script.js"></script>
    <script src="[sayfa]-animation.js"></script>
</body>
```

---

## Çözümler vs Hizmetler

| Kategori | Sayfalar |
|---|---|
| **Çözümler** | sorter.html, pallet-elevator.html, miniload-shuttle.html, pick-to-light.html |
| **Hizmetler** | scada.html, production-tracking.html, data-collection.html, custom-software.html, plc-programming.html, system-integration.html |

---

## SEO Notları

- `sitemap.xml` tüm sayfa URL'lerini içerir — yeni sayfa eklenince güncelle
- Her sayfada `<link rel="canonical">`, `og:url`, `og:title`, `og:description` mevcut
- Schema.org yapısal veri (JSON-LD) her sayfada tanımlı
- Tüm sayfa isimleri İngilizce (`plc-programming.html`, `system-integration.html`, vb.)

---

## i18n (Çok Dilli Destek)

Site TR/EN dil desteğine sahiptir. Sistem tamamen tarayıcı-taraflıdır.

### Nasıl çalışır
- `js/i18n.js` — Tüm çeviriler gömülü olarak bu dosyada (`TRANSLATIONS` nesnesi)
- `data-i18n="key.path"` — textContent güncelleme (plain text)
- `data-i18n-html="key.path"` — innerHTML güncelleme (`<span>`, `<br>` içerenler için)
- `data-i18n-ph="key.path"` — input placeholder güncelleme
- `<button id="lang-toggle">` — header'daki dil geçiş butonu
- Seçilen dil `localStorage`'da `lojikon_lang` key'i ile saklanır

### Çeviri eklemek / düzenlemek
1. `js/i18n.js` içindeki `TRANSLATIONS.tr` ve `TRANSLATIONS.en` nesnelerini düzenle
2. Sayfa HTML'inde ilgili elemana `data-i18n` attribute'u ekle
3. Partial'larda değişiklik varsa `python3 build.py` çalıştır

### Kapsam
- ✅ Header (nav menüsü, dil butonu)
- ✅ Footer (başlıklar, linkler, copyright)
- ✅ Çözümler bölümü (4 kart)
- ✅ Hizmetler bölümü (6 kart)
- ✅ İletişim formu (etiketler, placeholder'lar)
- ✅ Hero bölümü (başlık, açıklama, butonlar, istatistikler) — tüm 11 sayfa

---

## Sık Kullanılan İşlemler

**Menüye link ekle:** `partials/header.html` → `python3 build.py`

**Footer'ı güncelle:** `partials/footer.html` → `python3 build.py`

**İletişim bilgilerini değiştir:** `partials/contact-section.html` → `python3 build.py`

**Yeni sayfa ekle:**
1. Mevcut bir sayfayı kopyala
2. PARTIAL marker'larını koru (içerik build.py tarafından doldurulur)
3. `sitemap.xml`'e ekle
4. `partials/solutions-section.html` veya `partials/services-section.html`'e kart ekle
5. `python3 build.py`
