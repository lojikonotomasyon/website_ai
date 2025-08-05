// Mobile menu initialization function
function initializeMobileMenu() {
    // Önceki event listener'ları temizle
    const existingHamburger = document.querySelector('.hamburger');
    if (existingHamburger) {
        const newHamburger = existingHamburger.cloneNode(true);
        existingHamburger.parentNode.replaceChild(newHamburger, existingHamburger);
    }
    
    // Mobil menü toggle - çoklu fallback yöntemi
    let hamburger = document.querySelector('.hamburger');
    let navMenu = document.querySelector('.nav-menu');
    
    // Fallback selectors
    if (!hamburger) {
        hamburger = document.querySelector('[class*="hamburger"]');
    }
    if (!hamburger) {
        hamburger = document.querySelector('div[class*="hamburger"]');
    }
    
    if (!navMenu) {
        navMenu = document.querySelector('ul[class*="nav-menu"]');
    }
    if (!navMenu) {
        navMenu = document.querySelector('[class*="nav-menu"]');
    }
    
    // Mobile menu function
    function toggleMobileMenu() {
        if (hamburger && navMenu) {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        }
    }
    
    if (hamburger && navMenu) {
        // Event listener'ları temizle ve yeniden ekle
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        hamburger = newHamburger;
        
        // Primary click handler
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Menü linklerine tıklandığında mobil menüyü kapat
        const menuLinks = document.querySelectorAll('.nav-menu a');
        
        menuLinks.forEach(link => {
            // Önceki event listener'ları temizle
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', () => {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });
        
        // Menü dışına tıklandığında menüyü kapat - global handler
        const closeMenuOnOutsideClick = (e) => {
            if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        };
        
        // Önceki global handler'ı kaldır
        document.removeEventListener('click', closeMenuOnOutsideClick);
        document.addEventListener('click', closeMenuOnOutsideClick);
        
    } else {
        // Alternative approach - global click handler
        const globalClickHandler = function(e) {
            const clickedElement = e.target;
            const hamburgerElement = clickedElement.closest('.hamburger') || 
                                   clickedElement.closest('[class*="hamburger"]');
            
            if (hamburgerElement) {
                e.preventDefault();
                e.stopPropagation();
                
                const navElement = document.querySelector('.nav-menu') || 
                                 document.querySelector('[class*="nav-menu"]');
                
                if (navElement) {
                    hamburgerElement.classList.toggle('active');
                    navElement.classList.toggle('active');
                }
            }
        };
        
        // Önceki global handler'ı kaldır
        document.removeEventListener('click', globalClickHandler);
        document.addEventListener('click', globalClickHandler);
    }
    
    // Test function
    window.testMobileMenu = function() {
        toggleMobileMenu();
    };
}

// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    // Header yüklendikten sonra mobile menu'yu başlat
    const checkHeaderLoaded = setInterval(() => {
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            clearInterval(checkHeaderLoaded);
            initializeMobileMenu();
        }
    }, 100);
    
    // 10 saniye sonra timeout
    setTimeout(() => {
        clearInterval(checkHeaderLoaded);
        initializeMobileMenu();
    }, 10000);

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
    const animateElements = document.querySelectorAll('.solution-card, .service-card, .project-card, .contact-item');
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
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.send('service_myv14au', 'template_j48q9zh', {
                to_email: 'yusuf@lojikon.com',
                from_name: formData.name,
                from_email: formData.email,
                from_phone: formData.phone,
                from_company: formData.company,
                service_type: formData.service,
                message: formData.message
            })
            .then(function(response) {
                // Success
                alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
                contactForm.reset();
            })
            .catch(function(error) {
                // Error
                alert('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
                console.error('EmailJS Error:', error);
            })
            .finally(function() {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
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
    if (stats.length > 0 && !window.statsAnimated) {
        window.statsAnimated = true;
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
    // Eğer animasyon zaten çalıştıysa tekrar çalıştırma
    if (element.dataset.animated === 'true') {
        return;
    }
    
    // Animasyon çalıştı olarak işaretle
    element.dataset.animated = 'true';
    
    const target = parseInt(element.textContent.replace(/\D/g, '')) || 10;
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
    
    // Animasyon tamamlandığında final değeri garanti et
    setTimeout(() => {
        element.textContent = target + '+';
    }, duration + 100);
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

// Scroll to top ve WhatsApp butonları
function createScrollToTopButton() {
    // Container oluştur
    const container = document.createElement('div');
    container.className = 'floating-buttons';
    container.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    // Scroll to top butonu
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    // WhatsApp butonu
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/902126571803?text=Merhaba! Lojikon hakkında bilgi almak istiyorum.';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.className = 'whatsapp-button';
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappButton.style.cssText = `
        width: 50px;
        height: 50px;
        background: #25D366;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
    `;
    
    container.appendChild(scrollButton);
    container.appendChild(whatsappButton);
    document.body.appendChild(container);
    
    // Scroll olayını dinle
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            container.style.opacity = '1';
            container.style.visibility = 'visible';
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            // WhatsApp butonu her zaman görünür, sadece scroll-to-top butonu gizlenir
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
            // Container'ın opacity'sini 1'de tut ki WhatsApp butonu görünsün
            container.style.opacity = '1';
            container.style.visibility = 'visible';
        }
    });
    
    // Scroll to top tıklama olayı
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Scroll to top hover efekti
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'translateY(-3px)';
        scrollButton.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    });
    
    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'translateY(0)';
        scrollButton.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    });
    
    // WhatsApp hover efekti
    whatsappButton.addEventListener('mouseenter', () => {
        whatsappButton.style.transform = 'translateY(-3px)';
        whatsappButton.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.4)';
        whatsappButton.style.background = '#128C7E';
    });
    
    whatsappButton.addEventListener('mouseleave', () => {
        whatsappButton.style.transform = 'translateY(0)';
        whatsappButton.style.boxShadow = '0 5px 15px rgba(37, 211, 102, 0.3)';
        whatsappButton.style.background = '#25D366';
    });
}

// Scroll to top butonunu oluştur
createScrollToTopButton();

// Hero Slider Functionality
class HeroSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 4;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.updateSlide();
    }
    
    bindEvents() {
        // Previous button
        const prevBtn = document.getElementById('prevSlide');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Next button
        const nextBtn = document.getElementById('nextSlide');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Dot navigation
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Pause auto-play on hover
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    nextSlide() {
        this.currentSlide = this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
        this.updateSlide();
    }
    
    goToSlide(slideNumber) {
        this.currentSlide = slideNumber;
        this.updateSlide();
    }
    
    updateSlide() {
        // Hide all slides
        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index + 1 === this.currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update buttons
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        
        if (prevBtn) {
            prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
            prevBtn.disabled = this.currentSlide === 1;
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
            nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize hero slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage (has hero slider)
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slider = new HeroSlider();
        
        // Initialize pallet lift animation for homepage slider
        if (typeof ProfessionalElevator !== 'undefined') {
            // Wait for the pallet lift slide to be active, then initialize
            const initPalletLiftForSlider = () => {
                const palletLiftSlide = document.querySelector('[data-slide="4"]');
                if (palletLiftSlide && palletLiftSlide.classList.contains('active')) {
                    const elevatorContainer = palletLiftSlide.querySelector('.pallet-lift-animation');
                    if (elevatorContainer && !elevatorContainer.hasAttribute('data-initialized')) {
                        elevatorContainer.setAttribute('data-initialized', 'true');
                        
                        // Create a modified version for the slider
                        const sliderElevator = new (class {
                            constructor(container) {
                                this.container = container;
                                this.currentFloor = 1;
                                this.targetFloor = 1;
                                this.isMoving = false;
                                this.isDoorOpen = false;
                                this.totalFloors = 4;
                                this.floorHeight = this.calculateFloorHeight(); // Responsive floor height
                                this.moveSpeed = 2000; // ms per floor
                                this.doorSpeed = 500; // ms for door operation
                                this.demoInterval = null;
                                
                                this.init();
                            }
                            
                            calculateFloorHeight() {
                                const screenWidth = window.innerWidth;
                                const container = this.container;
                                const containerHeight = container.offsetHeight;
                                
                                // CSS'te her kat 25% yükseklik kullanıyor (4 kat toplam)
                                // Scale yaklaşımı kullandığımız için sabit değer kullanabiliriz
                                const baseFloorHeight = containerHeight * 0.25;
                                
                                // Scale faktörüne göre ayarlama
                                let scaleFactor = 1;
                                if (screenWidth <= 480) {
                                    scaleFactor = 0.6; // Mobile scale
                                } else if (screenWidth <= 768) {
                                    scaleFactor = 0.8; // Tablet scale
                                }
                                
                                return baseFloorHeight * scaleFactor;
                            }
                            
                            init() {
                                this.bindEvents();
                                
                                // Wait for container to be rendered, then calculate floor height
                                setTimeout(() => {
                                    this.floorHeight = this.calculateFloorHeight();
                                    this.updateDisplay();
                                    this.setElevatorPosition();
                                    this.setCounterweightPosition();
                                }, 100);
                                
                                // Add resize listener to recalculate floor height
                                window.addEventListener('resize', () => {
                                    this.floorHeight = this.calculateFloorHeight();
                                    this.setElevatorPosition();
                                    this.setCounterweightPosition();
                                });
                            }
                            
                            // Override methods to use container-specific selectors
                            bindEvents() {
                                // Floor buttons within this container
                                const floorButtons = this.container.querySelectorAll('.floor-btn');
                                floorButtons.forEach(btn => {
                                    btn.addEventListener('click', (e) => {
                                        const floor = parseInt(e.target.dataset.floor);
                                        this.callElevator(floor);
                                    });
                                });

                                // Emergency stop within this container
                                const emergencyStop = this.container.querySelector('.emergency-stop');
                                if (emergencyStop) {
                                    emergencyStop.addEventListener('click', () => this.emergencyStop());
                                }

                                // Pallet loading within this container
                                const pallets = this.container.querySelectorAll('.pallet');
                                pallets.forEach(pallet => {
                                    pallet.addEventListener('click', (e) => {
                                        this.loadPallet(pallet);
                                    });
                                });
                            }
                            
                            callElevator(targetFloor) {
                                if (this.isMoving || targetFloor === this.currentFloor) return;

                                this.targetFloor = targetFloor;
                                this.updateFloorButtons();
                                this.moveElevator();
                            }
                            
                            loadPallet(pallet) {
                                // Pallet loading logic
                                console.log('Loading pallet:', pallet.dataset.palletId);
                            }
                            
                            emergencyStop() {
                                this.isMoving = false;
                                this.updateStatus('ACİL DURDURMA');
                                console.log('Emergency stop activated');
                            }
                            
                            // Override all methods that use getElementById
                            moveElevator() {
                                if (this.isMoving) return;

                                console.log('moveElevator called - currentFloor:', this.currentFloor, 'targetFloor:', this.targetFloor);
                                this.isMoving = true;
                                this.updateStatus('HAREKET HALİNDE');
                                this.closeDoors();

                                const direction = this.targetFloor > this.currentFloor ? 'up' : 'down';
                                const floorsToMove = Math.abs(this.targetFloor - this.currentFloor);
                                const totalMoveTime = floorsToMove * this.moveSpeed;

                                // Calculate new positions
                                const newElevatorPosition = (this.totalFloors - this.targetFloor) * this.floorHeight;
                                const newCounterweightPosition = (this.targetFloor - 1) * this.floorHeight;

                                console.log('New elevator position:', newElevatorPosition, 'px');
                                console.log('New counterweight position:', newCounterweightPosition, 'px');

                                // Animate elevator car
                                const elevatorCar = this.container.querySelector('.elevator-car');
                                console.log('Elevator car element:', elevatorCar);
                                if (elevatorCar) {
                                    elevatorCar.style.transition = `bottom ${totalMoveTime}ms ease-in-out`;
                                    elevatorCar.style.bottom = `${newElevatorPosition}px`;
                                    console.log('Set elevator car bottom to:', newElevatorPosition, 'px');
                                }

                                // Animate counterweight (moves in opposite direction)
                                const counterweight = this.container.querySelector('.counterweight');
                                console.log('Counterweight element:', counterweight);
                                if (counterweight) {
                                    counterweight.style.transition = `bottom ${totalMoveTime}ms ease-in-out`;
                                    counterweight.style.bottom = `${newCounterweightPosition}px`;
                                    console.log('Set counterweight bottom to:', newCounterweightPosition, 'px');
                                }

                                // Update floor display during movement
                                this.animateFloorDisplay(totalMoveTime);

                                // Complete movement
                                setTimeout(() => {
                                    this.currentFloor = this.targetFloor;
                                    this.isMoving = false;
                                    this.updateStatus('HAZIR');
                                    this.openDoors();
                                    this.updateFloorButtons();
                                    console.log('Movement completed - currentFloor:', this.currentFloor);
                                }, totalMoveTime);
                            }
                            
                            updateStatus(status) {
                                const statusElement = this.container.querySelector('#elevatorStatus');
                                if (statusElement) {
                                    statusElement.textContent = status;
                                }
                            }
                            
                            updateFloorButtons() {
                                const floorButtons = this.container.querySelectorAll('.floor-btn');
                                floorButtons.forEach(btn => {
                                    const floor = parseInt(btn.dataset.floor);
                                    if (floor === this.currentFloor) {
                                        btn.classList.add('active');
                                    } else {
                                        btn.classList.remove('active');
                                    }
                                });
                            }
                            
                            updateDisplay() {
                                const currentFloorElement = this.container.querySelector('.current-floor');
                                if (currentFloorElement) {
                                    currentFloorElement.textContent = this.currentFloor;
                                }
                            }
                            
                            setElevatorPosition() {
                                const elevatorCar = this.container.querySelector('.elevator-car');
                                if (elevatorCar) {
                                    const position = (this.totalFloors - this.currentFloor) * this.floorHeight;
                                    elevatorCar.style.bottom = `${position}px`;
                                }
                            }
                            
                            setCounterweightPosition() {
                                const counterweight = this.container.querySelector('.counterweight');
                                if (counterweight) {
                                    const position = (this.currentFloor - 1) * this.floorHeight;
                                    counterweight.style.bottom = `${position}px`;
                                }
                            }
                            
                            openDoors() {
                                const leftDoor = this.container.querySelector('.left-door');
                                const rightDoor = this.container.querySelector('.right-door');
                                if (leftDoor && rightDoor) {
                                    leftDoor.classList.add('open');
                                    rightDoor.classList.add('open');
                                    this.isDoorOpen = true;
                                }
                            }
                            
                            closeDoors() {
                                const leftDoor = this.container.querySelector('.left-door');
                                const rightDoor = this.container.querySelector('.right-door');
                                if (leftDoor && rightDoor) {
                                    leftDoor.classList.remove('open');
                                    rightDoor.classList.remove('open');
                                    this.isDoorOpen = false;
                                }
                            }
                            
                            animateFloorDisplay(duration) {
                                const currentFloorElement = this.container.querySelector('.current-floor');
                                if (currentFloorElement) {
                                    const startFloor = this.currentFloor;
                                    const endFloor = this.targetFloor;
                                    const steps = 10;
                                    const stepTime = duration / steps;
                                    
                                    let currentStep = 0;
                                    const interval = setInterval(() => {
                                        currentStep++;
                                        const progress = currentStep / steps;
                                        const currentFloor = Math.round(startFloor + (endFloor - startFloor) * progress);
                                        currentFloorElement.textContent = currentFloor;
                                        
                                        if (currentStep >= steps) {
                                            clearInterval(interval);
                                            currentFloorElement.textContent = this.targetFloor;
                                        }
                                    }, stepTime);
                                }
                            }
                            
                            startDemo() {
                                console.log('Starting demo for slider elevator');
                                this.demoInterval = setInterval(() => {
                                    const randomFloor = Math.floor(Math.random() * this.totalFloors) + 1;
                                    if (randomFloor !== this.currentFloor && !this.isMoving) {
                                        console.log('Demo: Moving to floor', randomFloor);
                                        this.callElevator(randomFloor);
                                    }
                                }, 5000);
                            }
                            
                            stopDemo() {
                                if (this.demoInterval) {
                                    clearInterval(this.demoInterval);
                                    this.demoInterval = null;
                                }
                            }
                        })(elevatorContainer);
                        
                        // Start demo after a short delay
                        setTimeout(() => {
                            sliderElevator.startDemo();
                        }, 1000);
                    }
                }
            };
            
            // Check initially
            initPalletLiftForSlider();
            
            // Listen for slide changes
            const observer = new MutationObserver(() => {
                initPalletLiftForSlider();
            });
            
            observer.observe(heroSlider, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        }
    }
});

// Add page visibility handling for CSS animations
setupPageVisibilityHandling();

// Page visibility handling for CSS animations
function setupPageVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
        const animations = document.querySelectorAll('.conveyor-belt, .divertor-arm, .package, .shuttle-vehicle, .lift-car, .counterweight');
        
        if (document.hidden) {
            // Page is hidden, pause all CSS animations
            animations.forEach(animation => {
                animation.style.animationPlayState = 'paused';
            });
        } else {
            // Page is visible, resume all CSS animations
            animations.forEach(animation => {
                animation.style.animationPlayState = 'running';
            });
        }
    });
} 