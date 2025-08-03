# Lojikon - Endüstriyel Otomasyon ve Intralogistics Website

Modern, responsive ve SEO dostu HTML/CSS/JS website'ı. Endüstriyel otomasyon ve intralogistics çözümleri için tasarlanmıştır.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](VERSION)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production-green.svg)](https://lojikon.com)

## 📋 Versiyon Bilgisi

**Mevcut Versiyon:** `1.0.0`  
**Son Güncelleme:** 19 Aralık 2024  
**Durum:** Production Ready

### 🚀 Versiyon Yönetimi

Bu proje [Semantic Versioning](https://semver.org/) standardını kullanır:

- **MAJOR** (1.0.0): Büyük değişiklikler, geriye uyumsuz güncellemeler
- **MINOR** (1.1.0): Yeni özellikler, geriye uyumlu
- **PATCH** (1.0.1): Hata düzeltmeleri, küçük iyileştirmeler

### 📝 Versiyon Güncelleme

Versiyon güncellemeleri için `version.sh` scriptini kullanın:

```bash
# Patch güncelleme (hata düzeltmesi)
./version.sh patch "Hero slider animasyon düzeltmesi"

# Minor güncelleme (yeni özellik)
./version.sh minor "Yeni intralogistics animasyonu eklendi"

# Major güncelleme (büyük değişiklik)
./version.sh major "Website tamamen yeniden tasarlandı"
```

### 📚 Changelog

Tüm değişiklikler [CHANGELOG.md](CHANGELOG.md) dosyasında takip edilir.

## 🎯 Özellikler

### 📱 Responsive Tasarım
- Mobil, tablet ve desktop uyumlu
- Modern CSS Grid ve Flexbox kullanımı
- Tüm cihazlarda mükemmel görünüm

### 🎨 Modern Tasarım
- Lacivert tonlarında profesyonel renk paleti
- Turuncu vurgu renkleri ile canlı detaylar
- Smooth animasyonlar ve geçişler
- Modern tipografi (Inter font)

### 🚀 Performans
- Vanilla HTML/CSS/JS (framework yok)
- Hızlı yükleme süreleri
- Optimize edilmiş kod yapısı
- SEO dostu yapı

### 📊 SEO Optimizasyonu
- Semantic HTML yapısı
- Meta etiketleri
- Structured data hazır
- Hızlı sayfa yükleme

## 🛠️ Teknolojiler

- **HTML5** - Semantic markup
- **CSS3** - Modern styling ve animasyonlar
- **Vanilla JavaScript** - Etkileşimler ve animasyonlar
- **Font Awesome** - İkonlar
- **Google Fonts** - Inter font ailesi

## 📁 Proje Yapısı

```
lojikon-website/
├── index.html          # Ana sayfa
├── style.css           # Stil dosyası
├── script.js           # JavaScript dosyası
└── README.md           # Proje dokümantasyonu
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary Dark**: `#1e3a8a` (Koyu lacivert)
- **Primary**: `#2563eb` (Lacivert)
- **Primary Light**: `#3b82f6` (Açık lacivert)
- **Accent**: `#f59e0b` (Turuncu vurgu)
- **Accent Light**: `#fbbf24` (Açık turuncu)

### Tipografi
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 📱 Sayfa Bölümleri

### 1. Header
- Sabit navigasyon menüsü
- Responsive hamburger menü
- Smooth scroll efektleri

### 2. Hero Section
- Etkileyici başlık ve açıklama
- Call-to-action butonları
- İstatistik sayaçları
- Animasyonlu alt çizgi efekti

### 3. Hakkımızda
- Misyon, vizyon ve değerler
- Şirket bilgileri
- Modern layout tasarımı

### 4. İntralogistics Çözümler
- **Sorter Sistemleri**
- **Palet Lift Sistemleri**
- **Kasa Lift Sistemleri**
- **Continuous Lift**
- **Pick to Light**
- **Miniload Shuttle**

### 5. Müşteriye Özel Çözümler
- **Veri Toplama Sistemleri**
- **SCADA Sistemleri**
- **Üretim Takip Sistemleri**
- **Özel Makine Yazılımları**

### 6. Projeler
- Tamamlanan proje örnekleri
- Teknoloji etiketleri
- Hover efektleri

### 7. İletişim
- İletişim bilgileri
- İnteraktif form
- Form validasyonu
- Başarı bildirimleri

### 8. Footer
- Sosyal medya linkleri
- Hızlı erişim linkleri
- İletişim bilgileri

## 🎭 Animasyonlar ve Efektler

### Scroll Animasyonları
- Fade-in-up efektleri
- Intersection Observer API
- Staggered animasyonlar

### Hover Efektleri
- Kart yükseltme efektleri
- Scale transformasyonları
- Smooth geçişler

### İnteraktif Elementler
- Modal pencereler
- Form validasyonu
- Bildirim sistemi
- Scroll to top butonu

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Kurulum ve Kullanım

### Basit Kullanım
1. Dosyaları web sunucusuna yükleyin
2. `index.html` dosyasını açın
3. Website hazır!

### Yerel Geliştirme
1. Dosyaları bilgisayarınıza indirin
2. `index.html` dosyasını tarayıcıda açın
3. Live Server kullanarak geliştirme yapabilirsiniz

## 🔧 Özelleştirme

### Renkleri Değiştirme
`style.css` dosyasındaki CSS değişkenlerini düzenleyin:

```css
:root {
    --primary-dark: #1e3a8a;
    --primary: #2563eb;
    --accent: #f59e0b;
    /* Diğer renkler... */
}
```

### İçerik Güncelleme
- `index.html` dosyasında metinleri değiştirin
- İkonları Font Awesome'dan seçin
- Görselleri ekleyin

### Animasyon Ayarları
`script.js` dosyasında animasyon sürelerini ayarlayabilirsiniz.

## 📊 SEO Özellikleri

- Semantic HTML yapısı
- Meta description ve keywords
- Open Graph etiketleri
- Structured data hazır
- Hızlı yükleme optimizasyonu

## 🌐 Tarayıcı Desteği

- Chrome (önerilen)
- Firefox
- Safari
- Edge
- IE11+ (sınırlı destek)

## 📈 Performans

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Güvenlik

- XSS koruması
- Form validasyonu
- Güvenli link yapısı
- HTTPS uyumlu

## 📞 Destek

Website ile ilgili sorularınız için:
- **E-posta**: info@lojikon.com
- **Telefon**: +90 (212) 123 45 67

## 📄 Lisans

Bu proje Lojikon için özel olarak geliştirilmiştir.

---

**Lojikon** - Endüstriyel Otomasyon ve Intralogistics Çözümleri 