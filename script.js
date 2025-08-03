// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Mobil menü toggle
    const hamburger = document.querySelector('.hamburger, .mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Menü linklerine tıklandığında mobil menüyü kapat
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Scroll animasyonları
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Animasyon için gözlemlenecek elementler
    const animateElements = document.querySelectorAll('.solution-card, .service-card, .project-card, .contact-item, .stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Header scroll efekti
    const header = document.querySelector('.header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = 'rgba(30, 58, 138, 0.98)';
            } else {
                header.style.background = 'rgba(30, 58, 138, 0.95)';
            }

            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Smooth scroll için
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // İletişim formu işlemleri
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Form gönderme animasyonu
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Gönderiliyor...';
            submitBtn.disabled = true;
            
            // Simüle edilmiş form gönderimi
            setTimeout(() => {
                // Başarı mesajı göster
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız.', 'success');
                
                // Formu temizle
                this.reset();
                
                // Butonu eski haline getir
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Çözüm kartları hover efektleri
    const solutionCards = document.querySelectorAll('.solution-card');
    if (solutionCards.length > 0) {
        solutionCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Hizmet kartları hover efektleri
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Proje kartları hover efektleri
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // İstatistik sayaç animasyonu
    const stats = document.querySelectorAll('.stat h3');
    if (stats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    // Sosyal medya linkleri hover efektleri
    const socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length > 0) {
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) rotate(5deg)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotate(0deg)';
            });
        });
    }

    // Sayfa yükleme animasyonu
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Sayaç animasyonu fonksiyonu
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 16);
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type = 'info') {
    // Mevcut bildirimleri temizle
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Bildirim stilleri
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Bildirimi sayfaya ekle
    document.body.appendChild(notification);
    
    // Animasyonla göster
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Kapatma butonu
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Otomatik kapatma
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Çözüm kartları için detay modalı
function showSolutionDetails(solutionType) {
    const solutions = {
        'sorter': {
            title: 'Sorter Sistemleri',
            description: 'Otomatik sınıflandırma ve yönlendirme sistemleri',
            features: [
                'Yüksek hızda sıralama (3000+ parça/saat)',
                'Doğru sınıflandırma oranı %99.9+',
                'Esnek konfigürasyon seçenekleri',
                'Entegre WMS bağlantısı',
                'Gerçek zamanlı izleme ve raporlama'
            ],
            benefits: [
                'Manuel sıralama maliyetlerini %80 azaltır',
                'Sıralama hatalarını minimize eder',
                'Depo verimliliğini artırır',
                '7/24 kesintisiz operasyon'
            ]
        },
        'palet-lift': {
            title: 'Palet Lift Sistemleri',
            description: 'Otomatik palet yükleme, boşaltma ve transfer',
            features: [
                'Güvenli palet yükleme/boşaltma',
                'Yüksek kapasite (1000+ palet/gün)',
                'Otomatik kontrol ve güvenlik',
                'Çoklu katman desteği',
                'Entegre güvenlik sistemleri'
            ],
            benefits: [
                'İşçi güvenliğini maksimize eder',
                'Palet hasarını önler',
                'Operasyon hızını artırır',
                'Enerji verimliliği sağlar'
            ]
        },
        'pick-to-light': {
            title: 'Pick to Light Sistemleri',
            description: 'Görsel yönlendirme ile hızlı toplama',
            features: [
                'LED ışık yönlendirmesi',
                'Sesli uyarı sistemi',
                'Hata önleme algoritmaları',
                'Mobil cihaz entegrasyonu',
                'Gerçek zamanlı performans takibi'
            ],
            benefits: [
                'Toplama hızını %60 artırır',
                'Hata oranını %90 azaltır',
                'Eğitim süresini kısaltır',
                'Esnek konfigürasyon'
            ]
        }
    };
    
    const solution = solutions[solutionType];
    if (!solution) return;
    
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'solution-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${solution.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-description">${solution.description}</p>
                    
                    <div class="modal-section">
                        <h4>Özellikler</h4>
                        <ul>
                            ${solution.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="modal-section">
                        <h4>Faydalar</h4>
                        <ul>
                            ${solution.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="contactUs('${solutionType}')">Teklif Alın</button>
                </div>
            </div>
        </div>
    `;
    
    // Modal stilleri
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
        background: white;
        border-radius: 16px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    // Modalı sayfaya ekle
    document.body.appendChild(modal);
    
    // Kapatma işlemleri
    const closeBtn = modal.querySelector('.modal-close');
    const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// İletişim formuna yönlendirme
function contactUs(solutionType) {
    const contactSection = document.getElementById('contact');
    const serviceSelect = document.getElementById('service');
    
    if (contactSection && serviceSelect) {
        // Servis seçimini ayarla
        serviceSelect.value = solutionType;
        
        // İletişim bölümüne scroll yap
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Modalı kapat
        const modal = document.querySelector('.solution-modal');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Çözüm kartlarına tıklama olayı ekle
document.addEventListener('click', function(e) {
    if (e.target.closest('.solution-card')) {
        const card = e.target.closest('.solution-card');
        const solutionType = card.dataset.solution;
        if (solutionType) {
            showSolutionDetails(solutionType);
        }
    }
});

// Sayfa yükleme performansı
window.addEventListener('load', function() {
    // Sayfa yüklendiğinde ek animasyonlar
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // İstatistikler için gecikme
    setTimeout(() => {
        const stats = document.querySelectorAll('.stat h3');
        if (stats.length > 0) {
            stats.forEach((stat, index) => {
                setTimeout(() => {
                    animateCounter(stat);
                }, index * 200);
            });
        }
    }, 1000);
});

// Responsive tasarım için ek kontroller
window.addEventListener('resize', function() {
    // Mobil menüyü kapat
    const hamburger = document.querySelector('.hamburger, .mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }
});

// Scroll to top butonu
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(button);
    
    // Scroll olayını dinle
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Tıklama olayı
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover efekti
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });
}

// Scroll to top butonunu oluştur
createScrollToTopButton(); 