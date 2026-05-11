# 📧 EMAILJS KURULUM REHBERİ - LOJIKON WEBSITE

## 🚀 EmailJS Hesabı Oluşturma

### 1. EmailJS'e Kayıt Olun
- [EmailJS.com](https://www.emailjs.com) adresine gidin
- "Sign Up" butonuna tıklayın
- Email ve şifre ile hesap oluşturun

### 2. Email Servisi Ekleme
1. **Dashboard** > **Email Services** > **Add New Service**
2. **Gmail** seçin (önerilen)
3. Gmail hesabınızla bağlayın
4. **Service ID**: `service_lojikon` olarak kaydedin

### 3. Email Template Oluşturma
1. **Email Templates** > **Create New Template**
2. **Template ID**: `template_contact`
3. **Template Name**: "Lojikon Contact Form"

#### Template İçeriği:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Lojikon - Yeni İletişim Mesajı</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            🚀 Lojikon - Yeni İletişim Mesajı
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">📋 Mesaj Detayları</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">👤 Ad Soyad:</td>
                    <td style="padding: 8px 0;">{{from_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">📧 Email:</td>
                    <td style="padding: 8px 0;">{{from_email}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">📞 Telefon:</td>
                    <td style="padding: 8px 0;">{{from_phone}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #475569;">🎯 Hizmet Türü:</td>
                    <td style="padding: 8px 0;">{{service_type}}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">💬 Mesaj</h3>
            <p style="margin: 0; white-space: pre-wrap;">{{message}}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>📅 Tarih:</strong> {{date}}<br>
                <strong>⏰ Saat:</strong> {{time}}
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px;">
                Bu email Lojikon websitesi iletişim formu üzerinden gönderilmiştir.<br>
                Lütfen müşteriye en kısa sürede dönüş yapınız.
            </p>
        </div>
    </div>
</body>
</html>
```

### 4. User ID Alma
1. **Account** > **API Keys**
2. **Public Key**'i kopyalayın
3. `script.js` dosyasında `YOUR_EMAILJS_USER_ID` yerine yapıştırın

## 🔧 Kod Güncellemeleri

### script.js Dosyasında:
```javascript
// EmailJS Configuration
(function() {
    emailjs.init("YOUR_ACTUAL_USER_ID_HERE"); // Buraya gerçek User ID'nizi ekleyin
})();
```

### Tüm HTML Dosyalarında:
```html
<!-- EmailJS Script -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script src="script.js"></script>
```

## 📋 Test Etme

### 1. Test Mesajı Gönderin
- Website'deki iletişim formunu doldurun
- "Gönder" butonuna tıklayın
- Console'da başarı mesajını kontrol edin

### 2. Email Kontrolü
- Gmail hesabınızda yeni email'i kontrol edin
- Spam klasörünü de kontrol edin

## 🛠️ Sorun Giderme

### Yaygın Hatalar:
1. **"EmailJS is not defined"**
   - EmailJS script'inin HTML'de yüklendiğinden emin olun
   - Script sırasını kontrol edin (EmailJS önce, script.js sonra)

2. **"Service not found"**
   - Service ID'nin doğru olduğundan emin olun
   - EmailJS dashboard'da servisi kontrol edin

3. **"Template not found"**
   - Template ID'nin doğru olduğundan emin olun
   - Template'in aktif olduğundan emin olun

4. **"User ID not found"**
   - User ID'nin doğru kopyalandığından emin olun
   - API Keys sayfasından tekrar kontrol edin

## 📊 EmailJS Planları

### Free Plan (Önerilen Başlangıç):
- ✅ 200 email/ay
- ✅ Gmail desteği
- ✅ Template desteği
- ✅ API erişimi

### Paid Plans:
- **Starter**: $15/ay - 1,000 email
- **Professional**: $35/ay - 10,000 email
- **Enterprise**: Özel fiyatlandırma

## 🔒 Güvenlik

### Öneriler:
1. **Rate Limiting**: Form gönderimlerini sınırlayın
2. **Validation**: Client-side ve server-side validation
3. **Spam Protection**: reCAPTCHA ekleyin
4. **Monitoring**: Email gönderimlerini takip edin

## 📞 Destek

### EmailJS Destek:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Community](https://community.emailjs.com/)
- [EmailJS Support](https://www.emailjs.com/support/)

### Lojikon Teknik Destek:
- Email: yusuf@lojikon.com
- Telefon: +90 533 388 33 92

---

**🎉 Tebrikler! EmailJS entegrasyonu tamamlandı!** 