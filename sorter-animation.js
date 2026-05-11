// ===== SORTER ANİMASYONU =====
// Düşme hizalama: ürün belt'ten çıkarılıp .sorter-hero-animation'a
// kopyalanır; sepet koordinatı getBoundingClientRect ile px hassasiyetle alınır.

class SorterAnimation {
    constructor() {
        this.isRunning      = true;
        this.animationSpeed = 1;
        this.totalProducts  = 0;
        this.basketCounts   = { box: 0, envelope: 0, tote: 0, package: 0 };
        this.spawnTimer     = null;

        // Ürün boyutları (CSS ile eşleşmeli)
        this.PRODUCT_W = 28;
        this.PRODUCT_H = 28;
        // Tam bant boyunu katetme süresi (1x hızda, saniye)
        this.TRAVEL_T  = 4.5;

        this.init();
    }

    init() {
        this.setupControls();
        this.setupVisibility();
        this.startSpawning();
        this.startDashboard();
    }

    // ─── KONTROLLER ──────────────────────────────────────────────
    setupControls() {
        document.getElementById('pause-btn')
            ?.addEventListener('click', () => this.togglePause());

        const slider  = document.getElementById('speed-slider');
        const display = document.getElementById('speed-display');
        slider?.addEventListener('input', e => {
            this.animationSpeed = parseFloat(e.target.value);
            if (display) display.textContent = e.target.value + 'x';
        });
    }

    setupVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isRunning = false;
                clearTimeout(this.spawnTimer);
            } else {
                this.isRunning = true;
                this.startSpawning();
            }
        });
    }

    togglePause() {
        this.isRunning = !this.isRunning;
        const btn = document.getElementById('pause-btn');
        if (!btn) return;
        btn.innerHTML = this.isRunning
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play"></i>';
        btn.classList.toggle('paused', !this.isRunning);
        if (this.isRunning) this.startSpawning();
        else clearTimeout(this.spawnTimer);
    }

    // ─── ÜRÜN ÜRETME ─────────────────────────────────────────────
    startSpawning() {
        if (!this.isRunning) return;
        clearTimeout(this.spawnTimer);

        const spawn = () => {
            if (!this.isRunning) return;
            this.createProduct();
            const interval = (1600 + Math.random() * 900) / this.animationSpeed;
            this.spawnTimer = setTimeout(spawn, interval);
        };

        this.spawnTimer = setTimeout(spawn, 200);
    }

    createProduct() {
        const belt = document.querySelector('.conveyor-belt');
        if (!belt) return;

        const types = ['box', 'envelope', 'tote', 'package'];
        const type  = types[Math.floor(Math.random() * types.length)];
        const icons = {
            box: 'fa-box', envelope: 'fa-envelope',
            tote: 'fa-shopping-bag', package: 'fa-archive'
        };

        const product = document.createElement('div');
        product.className    = `product ${type}`;
        product.dataset.type = type;
        product.innerHTML    = `<i class="fas ${icons[type]}"></i>`;

        const travelT = this.TRAVEL_T / this.animationSpeed;

        // Ürün başlangıç pozisyonu: bant solunun dışında
        product.style.cssText = `
            position: absolute;
            left: -${this.PRODUCT_W}px;
            top: 50%;
            transform: translateY(-50%);
            width: ${this.PRODUCT_W}px;
            height: ${this.PRODUCT_H}px;
            z-index: 10;
            transition: left ${travelT}s linear;
        `;

        belt.appendChild(product);

        // Hareketi başlat (iki frame bekle: DOM'a eklenmesi + transition'ın aktifleşmesi)
        requestAnimationFrame(() => requestAnimationFrame(() => {
            const beltW = belt.clientWidth;
            product.style.left = (beltW + this.PRODUCT_W) + 'px';
        }));

        // Düşme zamanlamasını hesapla
        this._scheduleDropOrCleanup(product, type, travelT, belt);
    }

    _scheduleDropOrCleanup(product, type, travelT, belt) {
        const divertor = document.querySelector(`.divertor[data-type="${type}"]`);

        if (!divertor) {
            // Divertor yok: bant bittikten sonra temizle
            setTimeout(() => product.parentNode?.removeChild(product),
                       travelT * 1000 + 300);
            return;
        }

        // Divertor merkezi (bantın sol kenarına göre px cinsinden)
        const beltRect = belt.getBoundingClientRect();
        const dvRect   = divertor.getBoundingClientRect();
        const dvCenterX = dvRect.left - beltRect.left + dvRect.width / 2;
        const beltW     = beltRect.width;

        // Ürün merkezi -PRODUCT_W/2'den başlar, beltW+PRODUCT_W/2'de biter
        // fraction = (dvCenterX - (-PW/2)) / (beltW + PW)
        const fraction  = (dvCenterX + this.PRODUCT_W / 2) / (beltW + this.PRODUCT_W);
        const dropDelay = Math.max(0, travelT * 1000 * fraction - 60); // 60ms buffer

        const dropTimer = setTimeout(() => {
            if (product.parentNode) this.dropProduct(product, type);
        }, dropDelay);

        // Güvenlik temizleyici: ürün divertora ulaşmadan biterse
        const cleanTimer = setTimeout(() => {
            clearTimeout(dropTimer);
            product.parentNode?.removeChild(product);
        }, travelT * 1000 + 400);

        // dropProduct çalışırsa cleanTimer'ı iptal et
        product._cleanTimer = cleanTimer;
    }

    // ─── DÜŞME (HIZALAMA DÜZELTMESİ) ────────────────────────────
    dropProduct(product, type) {
        if (!product.parentNode) return;

        const container = document.querySelector('.sorter-hero-animation');
        const basket    = document.querySelector(`.drop-basket[data-type="${type}"]`);
        if (!container || !basket) return;

        // Temizleme timer'ını iptal et
        clearTimeout(product._cleanTimer);

        const contRect    = container.getBoundingClientRect();
        const productRect = product.getBoundingClientRect();
        const basketRect  = basket.getBoundingClientRect();

        // Ürünün anlık konumu (container'a göre px)
        const startX = productRect.left - contRect.left;
        const startY = productRect.top  - contRect.top;

        // Hedef: sepet içinde yatayda ortalı, sepetin üst kısmına
        const targetX = basketRect.left - contRect.left + (basketRect.width  - this.PRODUCT_W) / 2;
        const targetY = basketRect.top  - contRect.top  + 6;

        // Divertoru aktifleştir
        const divertor = document.querySelector(`.divertor[data-type="${type}"]`);
        divertor?.classList.add('active');
        setTimeout(() => divertor?.classList.remove('active'),
                   450 / this.animationSpeed);

        // Ürünü banttan kaldır
        product.parentNode.removeChild(product);

        // Belt'in dışında özgürce hareket edebilecek düşen klon oluştur
        const falling = document.createElement('div');
        falling.className = `product ${type} falling`;
        falling.innerHTML = product.innerHTML;
        Object.assign(falling.style, {
            position:       'absolute',
            left:           startX + 'px',
            top:            startY + 'px',
            width:          this.PRODUCT_W + 'px',
            height:         this.PRODUCT_H + 'px',
            zIndex:         '100',
            pointerEvents:  'none',
            transition:     'none',
        });
        container.appendChild(falling);

        // Sonraki frame'de geçiş başlat (startX/Y yerleşmiş olsun)
        requestAnimationFrame(() => {
            const ft = 0.42 / this.animationSpeed; // fall time
            falling.style.transition = [
                `left    ${(ft * 0.7).toFixed(3)}s ease-in-out`,
                `top     ${ft.toFixed(3)}s cubic-bezier(0.55,0,1,1)`,
                `opacity ${(ft * 0.5).toFixed(3)}s ease-in ${(ft * 0.55).toFixed(3)}s`,
                `transform ${ft.toFixed(3)}s ease-in`,
            ].join(', ');
            falling.style.left      = targetX + 'px';
            falling.style.top       = targetY + 'px';
            falling.style.opacity   = '0';
            falling.style.transform = 'translateY(-50%) scale(0.35)';
        });

        // Sayaçları güncelle
        this.basketCounts[type]++;
        this.totalProducts++;
        this.updateBasketCount(type);

        // Sepet flash efekti
        basket.classList.add('receiving');
        setTimeout(() => basket.classList.remove('receiving'),
                   380 / this.animationSpeed);

        // Klonu temizle
        const cleanDelay = ((0.55 / this.animationSpeed) * 1000) + 50;
        setTimeout(() => falling.parentNode?.removeChild(falling), cleanDelay);
    }

    updateBasketCount(type) {
        const el = document.querySelector(`.drop-basket[data-type="${type}"] .basket-count`);
        if (el) el.textContent = this.basketCounts[type];
    }

    // ─── DASHBOARD ───────────────────────────────────────────────
    startDashboard() {
        const tick = () => {
            const s = document.getElementById('speed-value');
            if (s) s.textContent = Math.round(60 * this.animationSpeed);

            const c = document.getElementById('capacity-value');
            if (c) c.textContent = Math.round(1200 * this.animationSpeed);

            const e = document.getElementById('efficiency-value');
            if (e) e.textContent = (98.5 + Math.random() * 1.2).toFixed(1);

            const t = document.getElementById('total-value');
            if (t) t.textContent = this.totalProducts;
        };
        tick();
        setInterval(tick, 1400);
    }
}

document.addEventListener('DOMContentLoaded', () => new SorterAnimation());
