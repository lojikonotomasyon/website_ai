# Template System Documentation

Bu dokümantasyon, Lojikon website'inde kullanılan HTML template sistemini açıklar.

## Dosya Yapısı

```
website_ai/
├── header.htm              # Header template
├── footer.htm              # Footer template
├── contact-info.htm        # Contact information template
├── include-templates.js    # Template loader JavaScript
├── template-example.html   # Template kullanım örneği
└── TEMPLATE_SYSTEM.md      # Bu dokümantasyon
```

## Template Dosyaları

### 1. header.htm
- **Açıklama:** Website'in header kısmı için template
- **İçerik:** Logo, navigasyon menüsü, sosyal medya linkleri
- **Kullanım:** Tüm sayfalarda ortak header

### 2. footer.htm
- **Açıklama:** Website'in footer kısmı için template
- **İçerik:** Şirket bilgileri, çözüm linkleri, hizmet linkleri, iletişim bilgileri
- **Kullanım:** Tüm sayfalarda ortak footer

### 3. contact-info.htm
- **Açıklama:** İletişim bilgileri için template
- **İçerik:** Adres, telefon, mobil, WhatsApp, e-posta, çalışma saatleri
- **Kullanım:** Contact section'larda ortak iletişim bilgileri

## Kullanım

### 1. HTML Sayfasında Template Kullanımı

```html
<!DOCTYPE html>
<html>
<head>
    <title>Sayfa Başlığı</title>
    <!-- Diğer head içerikleri -->
</head>
<body>
    <!-- Header Template Container -->
    <div id="header-container"></div>
    
    <!-- Sayfa içeriği -->
    <main>
        <!-- Ana sayfa içeriği buraya -->
    </main>
    
    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <div class="contact-content">
                <!-- Contact Info Template Container -->
                <div id="contact-info-container"></div>
                
                <!-- Contact form buraya -->
                <div class="contact-form">
                    <!-- Form içeriği -->
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer Template Container -->
    <div id="footer-container"></div>
    
    <!-- Scripts -->
    <script src="include-templates.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### 2. JavaScript Template Loader

`include-templates.js` dosyası otomatik olarak:
- Header template'ini `#header-container` elementine yükler
- Footer template'ini `#footer-container` elementine yükler
- Contact info template'ini `#contact-info-container` elementine yükler

## Avantajlar

### 1. **Merkezi Yönetim**
- Header, footer ve iletişim bilgileri tek yerden yönetilir
- Değişiklikler tüm sayfalara otomatik yansır

### 2. **Tutarlılık**
- Tüm sayfalarda aynı header, footer ve iletişim bilgileri
- Marka tutarlılığı sağlanır

### 3. **Bakım Kolaylığı**
- Tek dosyada değişiklik yaparak tüm sayfaları güncelleme
- Kod tekrarını önleme

### 4. **Performans**
- Template'ler bir kez yüklenir ve cache'lenir
- Sayfa yükleme hızı artar

## Güncelleme Süreci

### İletişim Bilgilerini Güncelleme
1. `contact-info.htm` dosyasını düzenle
2. Değişiklikler tüm sayfalara otomatik yansır

### Header Güncelleme
1. `header.htm` dosyasını düzenle
2. Değişiklikler tüm sayfalara otomatik yansır

### Footer Güncelleme
1. `footer.htm` dosyasını düzenle
2. Değişiklikler tüm sayfalara otomatik yansır

## Gelecek Geliştirmeler

- [ ] Daha fazla template ekleme (hero section, navigation, vb.)
- [ ] Template caching optimizasyonu
- [ ] Dynamic content loading
- [ ] Template versioning sistemi

## Notlar

- Template'ler HTTP server üzerinden çalışır (CORS policy nedeniyle)
- `python -m http.server 8000` komutu ile local server başlatın
- `http://localhost:8000` adresinden siteye erişin 