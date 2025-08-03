# Template Sistemi Kullanım Kılavuzu

## Genel Bakış

Bu template sistemi, header ve footer gibi tekrar eden HTML kısımlarını ayrı dosyalarda tutarak, bakım ve güncellemeleri kolaylaştırır.

## Dosya Yapısı

```
├── header.htm              # Header şablonu
├── footer.htm              # Footer şablonu
├── include-templates.js    # Template yükleme sistemi
├── template-example.html   # Kullanım örneği
└── TEMPLATE_SYSTEM.md      # Bu dosya
```

## Nasıl Kullanılır?

### 1. Yeni Sayfa Oluşturma

Yeni bir sayfa oluştururken şu yapıyı kullanın:

```html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sayfa Başlığı - Lojikon</title>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header Template Container -->
    <div id="header-container"></div>

    <!-- Sayfa İçeriği Buraya -->
    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="highlight">Sayfa</span> Başlığı
                </h1>
                <p class="hero-slogan">Akıllı Çözümler, Akıllı Gelecek</p>
                <p class="hero-description">
                    Sayfa açıklaması buraya gelecek.
                </p>
            </div>
        </div>
    </section>

    <!-- Footer Template Container -->
    <div id="footer-container"></div>

    <!-- Scripts -->
    <script src="include-templates.js"></script>
    <script src="script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script>
        (function() {
            emailjs.init("pMn_T_QHghVJklt3q");
        })();
    </script>
</body>
</html>
```

### 2. Template Güncelleme

Header veya footer'da değişiklik yapmak için:

1. `header.htm` veya `footer.htm` dosyasını düzenleyin
2. Değişiklik otomatik olarak tüm sayfalarda görünecek

### 3. Yeni Template Ekleme

Yeni bir template eklemek için:

1. Yeni template dosyası oluşturun (örn: `contact-form.htm`)
2. `include-templates.js` dosyasında yeni template'i yükleyin
3. Sayfalarda kullanın

## Avantajlar

✅ **Kolay Bakım**: Bir değişiklik tüm sayfalarda otomatik güncellenir
✅ **Tutarlılık**: Tüm sayfalarda aynı header/footer
✅ **Hızlı Geliştirme**: Sadece içerik kısmına odaklanın
✅ **Kod Tekrarını Önleme**: Aynı HTML'i tekrar yazmayın

## Örnek Kullanım

`template-example.html` dosyasını inceleyerek sistemin nasıl çalıştığını görebilirsiniz.

## Notlar

- Template dosyaları HTTP sunucusu üzerinden çalışır (file:// protokolü ile çalışmaz)
- Local development için basit bir HTTP sunucusu kullanın
- Production'da normal web sunucusu kullanın

## Gelecek Geliştirmeler

- [ ] PHP include sistemi
- [ ] Server-side rendering
- [ ] Template değişkenleri sistemi
- [ ] Conditional rendering 