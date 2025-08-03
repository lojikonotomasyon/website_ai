# Version Management Guide

Bu rehber, Lojikon website projesinin versiyon yönetimi için hazırlanmıştır.

## 🚀 Versiyon Sistemi

Proje [Semantic Versioning](https://semver.org/) standardını kullanır:

- **MAJOR** (1.0.0): Büyük değişiklikler, geriye uyumsuz güncellemeler
- **MINOR** (1.1.0): Yeni özellikler, geriye uyumlu
- **PATCH** (1.0.1): Hata düzeltmeleri, küçük iyileştirmeler

## 📝 Versiyon Güncelleme

### Windows PowerShell Kullanımı

```powershell
# Patch güncelleme (hata düzeltmesi)
.\version-simple.ps1 patch "Hero slider animasyon düzeltmesi"

# Minor güncelleme (yeni özellik)
.\version-simple.ps1 minor "Yeni intralogistics animasyonu eklendi"

# Major güncelleme (büyük değişiklik)
.\version-simple.ps1 major "Website tamamen yeniden tasarlandı"
```

### Linux/Mac Kullanımı

```bash
# Patch güncelleme
./version.sh patch "Hero slider animasyon düzeltmesi"

# Minor güncelleme
./version.sh minor "Yeni intralogistics animasyonu eklendi"

# Major güncelleme
./version.sh major "Website tamamen yeniden tasarlandı"
```

## 📋 Versiyon Dosyaları

- **VERSION**: Mevcut versiyon numarası
- **CHANGELOG.md**: Tüm değişikliklerin detaylı listesi
- **version-simple.ps1**: Windows PowerShell versiyon scripti
- **version.sh**: Linux/Mac bash versiyon scripti

## 🔄 Otomatik İşlemler

Versiyon scripti şu işlemleri otomatik olarak yapar:

1. ✅ Versiyon numarasını artırır
2. ✅ VERSION dosyasını günceller
3. ✅ CHANGELOG.md dosyasını günceller
4. ✅ Tüm değişiklikleri Git'e ekler
5. ✅ Versiyonlu commit oluşturur
6. ✅ Git tag oluşturur
7. ✅ GitHub'a push komutlarını gösterir

## 📚 Örnek Kullanım Senaryoları

### Yeni Özellik Ekleme
```powershell
.\version-simple.ps1 minor "Yeni hero slider animasyonu eklendi"
```

### Hata Düzeltmesi
```powershell
.\version-simple.ps1 patch "Mobile responsive düzeltmesi"
```

### Büyük Güncelleme
```powershell
.\version-simple.ps1 major "Website tamamen yeniden tasarlandı"
```

## 🌐 GitHub Entegrasyonu

Versiyon scripti çalıştıktan sonra:

```powershell
# Ana branch'i push et
git push origin main

# Versiyon tag'ini push et
git push origin v1.1.0
```

## 📊 Versiyon Geçmişi

Tüm versiyon geçmişi [CHANGELOG.md](CHANGELOG.md) dosyasında tutulur.

### Mevcut Versiyonlar:
- **v1.0.0**: İlk sürüm (19 Aralık 2024)
- **v1.1.0**: Hero slider ve intralogistics animasyonu (19 Aralık 2024)

## ⚠️ Önemli Notlar

1. **Commit Mesajları**: Açıklayıcı ve Türkçe olmalı
2. **Versiyon Numaraları**: Semantic versioning standardına uygun olmalı
3. **Changelog**: Her değişiklik mutlaka CHANGELOG.md'ye eklenmeli
4. **Git Tags**: Her versiyon için Git tag oluşturulmalı

## 🆘 Sorun Giderme

### Script Çalışmıyor
- PowerShell execution policy kontrol edin
- Git'in yüklü olduğundan emin olun
- Dosya izinlerini kontrol edin

### Versiyon Çakışması
- VERSION dosyasını manuel olarak kontrol edin
- Git log'u kontrol edin
- Gerekirse manuel versiyon ayarlayın

---

**Son Güncelleme**: 19 Aralık 2024  
**Versiyon**: 1.1.0 