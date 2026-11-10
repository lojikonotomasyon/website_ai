const EMAILJS_PUBLIC_KEY  = 'pMn_T_QHghVJklt3q';
const EMAILJS_SERVICE_ID  = 'service_93y8btr';
const EMAILJS_TEMPLATE_ID = 'template_j48q9zh';
const CONTACT_EMAIL = 'info@lojikon.com';
const CONTACT_PHONE = '+90 212 657 18 03';

if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            const open = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
        });
        
        const menuLinks = document.querySelectorAll('.nav-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.length < 2) return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

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
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
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
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));
        
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].classList.add('active');
        }
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('active');
        }
        
        this.updateButtonStates();
    }
    
    updateButtonStates() {}
    
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

function initializeSloganAnimation() {
    const var1Element = document.getElementById('var1');
    const var2Element = document.getElementById('var2');

    if (!var1Element || !var2Element) return;

    const sloganWords = {
        tr: [
            { var1: 'Sistemler',     var2: 'Yarın'      },
            { var1: 'Çözümler',      var2: 'Dönüşüm'    },
            { var1: 'Teknolojiler',  var2: 'Vizyon'      },
            { var1: 'Endüstri',      var2: 'Gelişim'     },
            { var1: 'Projeler',      var2: 'Süreç'       },
            { var1: 'Altyapılar',    var2: 'Hedef'       },
            { var1: 'Yatırım',       var2: 'Gelecek'     },
            { var1: 'Entegrasyonlar',var2: 'Zaman'       },
            { var1: 'Hizmetler',     var2: 'Yaşam'       },
        ],
        en: [
            { var1: 'Systems',       var2: 'Tomorrow'    },
            { var1: 'Solutions',     var2: 'Transformation' },
            { var1: 'Technologies',  var2: 'Vision'      },
            { var1: 'Industry',      var2: 'Growth'      },
            { var1: 'Projects',      var2: 'Process'     },
            { var1: 'Infrastructures', var2: 'Goals'     },
            { var1: 'Investment',    var2: 'Future'      },
            { var1: 'Integrations',  var2: 'Time'        },
            { var1: 'Services',      var2: 'Life'        },
        ],
    };

    let currentIndex = 0;

    function getLang() {
        return localStorage.getItem('lojikon_lang') || 'tr';
    }

    function changeWords() {
        var1Element.classList.add('fade-out');
        var2Element.classList.add('fade-out');

        setTimeout(() => {
            const data = sloganWords[getLang()];
            var1Element.textContent = data[currentIndex].var1;
            var2Element.textContent = data[currentIndex].var2;

            var1Element.classList.remove('fade-out');
            var2Element.classList.remove('fade-out');
            var1Element.classList.add('fade-in');
            var2Element.classList.add('fade-in');

            currentIndex = (currentIndex + 1) % data.length;

            setTimeout(() => {
                var1Element.classList.remove('fade-in');
                var2Element.classList.remove('fade-in');
            }, 500);
        }, 300);
    }

    changeWords();
    setInterval(changeWords, 3000);
}

const FORM_MESSAGES = {
    tr: {
        required: 'Lütfen adınızı, email adresinizi ve mesajınızı yazın.',
        email:    'Geçerli bir email adresi giriniz.',
        sending:  'Gönderiliyor...',
        success:  'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
        error:    'Mesajınız şu anda iletilemedi. Lütfen ' + CONTACT_EMAIL + ' adresine yazın veya ' + CONTACT_PHONE + ' numarasını arayın.',
        mailto:   'Mesajı email ile gönder',
    },
    en: {
        required: 'Please enter your name, email address and message.',
        email:    'Please enter a valid email address.',
        sending:  'Sending...',
        success:  'Your message has been sent! We will get back to you shortly.',
        error:    'Your message could not be delivered right now. Please email ' + CONTACT_EMAIL + ' or call ' + CONTACT_PHONE + '.',
        mailto:   'Send the message by email',
    },
};

function formMsg(key) {
    const lang = (window.I18N && I18N.currentLang) || localStorage.getItem('lojikon_lang') || 'tr';
    return (FORM_MESSAGES[lang] || FORM_MESSAGES.tr)[key];
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name    = (formData.get('name') || '').trim();
        const email   = (formData.get('email') || '').trim();
        const message = (formData.get('message') || '').trim();
        const phone   = (formData.get('phone') || '').trim();
        const company = (formData.get('company') || '').trim();
        const topic   = formData.get('service_type') || 'Genel İletişim';

        if (!name || !email || !message) {
            showNotification(formMsg('required'), 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showNotification(formMsg('email'), 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ' + formMsg('sending');
        submitBtn.disabled = true;

        const senderDetails =
            'Ad: ' + name + '\nEmail: ' + email + '\nTelefon: ' + (phone || '-') +
            '\nFirma: ' + (company || '-') + '\nKonu: ' + topic;
        const templateParams = {
            from_name: name,
            from_email: email,
            from_phone: phone || 'Belirtilmemiş',
            service_type: topic,
            company: company || 'Belirtilmemiş',
            message: senderDetails + '\n\nMesaj:\n' + message,
            to_name: 'Lojikon Ekibi',
            name: name,
            email: email,
            phone: phone || 'Belirtilmemiş',
            title: topic,
            reply_to: email
        };

        const mailtoHref = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent('Web sitesi iletişim formu - ' + topic) +
            '&body=' + encodeURIComponent(senderDetails + '\n\n' + message);

        const restore = () => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        };

        const onError = (error) => {
            console.error('EmailJS gönderim hatası:', error);
            showNotification(formMsg('error'), 'error', { href: mailtoHref, label: formMsg('mailto') }, 15000);
            restore();
        };

        if (!window.emailjs) {
            onError('EmailJS kütüphanesi yüklenemedi');
            return;
        }

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function() {
                showNotification(formMsg('success'), 'success');
                contactForm.reset();
                restore();
            }, onError);
    });
}

function showNotification(message, type = 'info', action = null, duration = 5000) {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const content = document.createElement('div');
    content.className = 'notification-content';
    const text = document.createElement('span');
    text.className = 'notification-message';
    text.textContent = message;
    content.appendChild(text);

    if (action) {
        const link = document.createElement('a');
        link.className = 'notification-action';
        link.href = action.href;
        link.textContent = action.label;
        content.appendChild(link);
    }

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'notification-close';
    closeBtn.setAttribute('aria-label', 'Kapat');
    closeBtn.innerHTML = '&times;';
    content.appendChild(closeBtn);
    notification.appendChild(content);

    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));

    const hide = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };
    closeBtn.addEventListener('click', hide);
    setTimeout(() => { if (notification.parentNode) hide(); }, duration);
}

function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.type = 'button';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Sayfanın başına dön');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(scrollToTopBtn);

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return scrollToTopBtn;
}

function initializeScrollState(scrollToTopBtn) {
    const header = document.querySelector('.header');
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('scrolled', y > 20);
        if (scrollToTopBtn) scrollToTopBtn.classList.toggle('visible', y > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initializeReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll(
        '.section-header, .solution-card, .process-step, .project-item, ' +
        '.industries-grid li, .faq-item, .about-content, .contact-content, ' +
        '.step-card, .benefit-card, .application-card, .spec-card'
    );
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

function initializeLightbox() {
    const links = document.querySelectorAll('.project-link');
    if (!links.length) return;

    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button type="button" class="lightbox-close" aria-label="Kapat">&times;</button>' +
                    '<img alt=""><p class="lightbox-caption"></p>';
    document.body.appendChild(box);

    const img = box.querySelector('img');
    const caption = box.querySelector('.lightbox-caption');
    const close = () => { box.classList.remove('open'); document.body.style.overflow = ''; };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const thumb = link.querySelector('img');
            const fig = link.closest('figure');
            img.src = link.href;
            img.alt = thumb ? thumb.alt : '';
            caption.textContent = fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '';
            box.classList.add('open');
            document.body.style.overflow = 'hidden';
            box.querySelector('.lightbox-close').focus();
        });
    });
    box.addEventListener('click', (e) => { if (e.target !== img) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

function setupPageVisibilityHandling() {
    let isPageVisible = true;
    
    function handleVisibilityChange() {
        if (document.hidden) {
            isPageVisible = false;
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(element => {
                element.style.animationPlayState = 'paused';
            });
        } else {
            isPageVisible = true;
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(element => {
                element.style.animationPlayState = 'running';
            });
        }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeSmoothScrolling();

    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) new HeroSlider();

    initializeSloganAnimation();
    initializeContactForm();
    initializeScrollState(initializeScrollToTop());
    initializeReveal();
    initializeLightbox();
    setupPageVisibilityHandling();
});