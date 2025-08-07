// ===== ANA JAVASCRIPT - LOJIKON WEBSITE =====

// EmailJS Configuration
(function() {
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Buraya EmailJS User ID'nizi ekleyin
})();

// Mobile menu initialization
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const menuLinks = document.querySelectorAll('.nav-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Hero Slider for main page
class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.dot');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        if (this.totalSlides > 0) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.updateSlide();
        this.startAutoPlay();
    }
    
    bindEvents() {
        // Previous/Next buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause on hover
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.pauseAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlide();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlide();
    }
    
    goToSlide(slideNumber) {
        this.currentSlide = slideNumber;
        this.updateSlide();
    }
    
    updateSlide() {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
        
        this.updateButtonStates();
    }
    
    updateButtonStates() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            prevBtn.style.pointerEvents = this.currentSlide === 0 ? 'none' : 'auto';
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.5' : '1';
            nextBtn.style.pointerEvents = this.currentSlide === this.totalSlides - 1 ? 'none' : 'auto';
        }
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Slogan animation
function initializeSloganAnimation() {
    const var1Element = document.getElementById('var1');
    const var2Element = document.getElementById('var2');
    
    if (!var1Element || !var2Element) return;
    
    // Slogan verileri
    const sloganData = [
        { var1: "Sistemler", var2: "Yarın" },
        { var1: "Çözümler", var2: "Dönüşüm" },
        { var1: "Teknolojiler", var2: "Vizyon" },
        { var1: "Endüstri", var2: "Gelişim" },
        { var1: "Projeler", var2: "Süreç" },
        { var1: "Altyapılar", var2: "Hedef" },
        { var1: "Entegrasyonlar", var2: "Zaman" },
        { var1: "Hizmetler", var2: "Yaşam" }
    ];

    let currentIndex = 0;

    // Değişken kelimeleri değiştiren fonksiyon
    function changeWords() {
        // Fade out efekti
        var1Element.classList.add('fade-out');
        var2Element.classList.add('fade-out');

        setTimeout(() => {
            // Kelimeleri değiştir
            var1Element.textContent = sloganData[currentIndex].var1;
            var2Element.textContent = sloganData[currentIndex].var2;
            
            // Fade in efekti
            var1Element.classList.remove('fade-out');
            var2Element.classList.remove('fade-out');
            var1Element.classList.add('fade-in');
            var2Element.classList.add('fade-in');

            // Bir sonraki indekse geç
            currentIndex = (currentIndex + 1) % sloganData.length;

            // Fade in sınıfını kaldır
            setTimeout(() => {
                var1Element.classList.remove('fade-in');
                var2Element.classList.remove('fade-in');
            }, 500);

        }, 300);
    }

    // İlk değişimi hemen yap
    changeWords();
    
    // Her 3 saniyede bir değiştir
    setInterval(changeWords, 3000);
}

// Contact form initialization with EmailJS
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const formData = new FormData(this);
            const requiredFields = ['name', 'email', 'message'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const value = formData.get(field);
                if (!value || value.trim() === '') {
                    isValid = false;
                    showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} alanı zorunludur.`, 'error');
                }
            });
            
            if (!isValid) return;
            
            // Email validation
            const email = formData.get('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Geçerli bir email adresi giriniz.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            // EmailJS Template Parameters
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                from_phone: formData.get('phone') || 'Belirtilmemiş',
                service_type: formData.get('service_type') || 'Genel İletişim',
                message: formData.get('message'),
                to_name: 'Lojikon Ekibi'
            };
            
            // Send email using EmailJS
            emailjs.send('service_lojikon', 'template_contact', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px)';
        scrollToTopBtn.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 5px 15px rgba(59, 130, 246, 0.3)';
    });
}

// Page visibility handling
function setupPageVisibilityHandling() {
    let isPageVisible = true;
    
    function handleVisibilityChange() {
        if (document.hidden) {
            isPageVisible = false;
            // Pause animations when page is hidden
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(element => {
                element.style.animationPlayState = 'paused';
            });
        } else {
            isPageVisible = true;
            // Resume animations when page is visible
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize hero slider (only on main page)
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        new HeroSlider();
    }
    
    // Initialize slogan animation
    initializeSloganAnimation();
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize scroll to top
    initializeScrollToTop();
    
    // Setup page visibility handling
    setupPageVisibilityHandling();
}); 