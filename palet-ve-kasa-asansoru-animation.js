// ===== PALET VE KASA ASANSÖRÜ ANİMASYONU =====

class PalletLiftAnimation {
    constructor() {
        this.currentFloor  = 1;
        this.isMoving      = false;
        this.isAutoMode    = true;
        this.autoInterval  = null;

        // Her kattaki platform "bottom" değerleri (px) — .lift-structure içinde
        this.floorPos = { 1: 8, 2: 118, 3: 228, 4: 338 };

        // Platform yüksekliği = 85px → palet platformun üstüne oturur
        this.platformH = 85;

        this.init();
    }

    init() {
        this.setupControls();
        this.snapToFloor(1);      // başlangıç konumu (transition yok)
        this.updateDisplay(1);
        this.updateFloorButtons(1);

        setTimeout(() => {
            this.startAutoMode();
        }, 1500);
    }

    /* Transition olmadan anında konumlandır (ilk yükleme için) */
    snapToFloor(floor) {
        const platform     = document.getElementById('lift-platform');
        const pallet       = document.getElementById('pallet');
        const counterweight = document.getElementById('counterweight');
        if (!platform || !pallet || !counterweight) return;

        const disableTransition = (el) => {
            el.style.transition = 'none';
        };
        [platform, pallet, counterweight].forEach(disableTransition);

        this._applyPosition(floor);

        // Sonraki frame'de transition'ı geri aç
        requestAnimationFrame(() => requestAnimationFrame(() => {
            platform.style.transition     = '';
            pallet.style.transition       = '';
            counterweight.style.transition = '';
        }));
    }

    _applyPosition(floor) {
        const platform      = document.getElementById('lift-platform');
        const pallet        = document.getElementById('pallet');
        const counterweight = document.getElementById('counterweight');
        if (!platform || !pallet || !counterweight) return;

        const pos    = this.floorPos[floor];
        const maxPos = this.floorPos[4];
        const minPos = this.floorPos[1];

        platform.style.bottom      = pos + 'px';
        pallet.style.bottom        = (pos + this.platformH - 4) + 'px';  // paleti platforma oturtur
        counterweight.style.bottom = (maxPos + minPos - pos) + 'px';     // ters yönde hareket
    }

    goToFloor(floor) {
        if (this.isMoving || floor === this.currentFloor) return;

        const direction = floor > this.currentFloor ? 'up' : 'down';
        this.isMoving = true;

        this.updateStatus(direction === 'up' ? '▲ Yükseliyor' : '▼ İniyor');
        this.setStatusLight('moving');
        this.updateFloorButtons(floor);
        this._applyPosition(floor);

        // CSS transition süresi: 2.0s + küçük buffer
        const duration = 2150;

        setTimeout(() => {
            this.currentFloor = floor;
            this.isMoving     = false;
            this.setStatusLight('ready');
            this.updateStatus('Hazır');
            this.updateDisplay(floor);
            this.openDoors(floor);
        }, duration);
    }

    openDoors(floor) {
        const floorEl = document.querySelector(`.floor[data-floor="${floor}"]`);
        if (!floorEl) return;

        floorEl.classList.add('active');
        floorEl.querySelector('.left-door')?.classList.add('open');
        floorEl.querySelector('.right-door')?.classList.add('open');

        setTimeout(() => {
            floorEl.querySelector('.left-door')?.classList.remove('open');
            floorEl.querySelector('.right-door')?.classList.remove('open');
            setTimeout(() => floorEl.classList.remove('active'), 400);
        }, 1800);
    }

    updateFloorButtons(floor) {
        document.querySelectorAll('.floor-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.floor) === floor);
        });
    }

    updateDisplay(floor) {
        const el = document.getElementById('current-floor');
        if (el) el.textContent = floor;
    }

    updateStatus(text) {
        const el = document.getElementById('lift-status');
        if (el) el.textContent = text;
    }

    setStatusLight(state) {
        const platform = document.getElementById('lift-platform');
        if (platform) {
            platform.dataset.state = state;
        }
    }

    emergencyStop() {
        this.isAutoMode = false;
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
        // Mevcut konuma geri sabitle
        this.isMoving = false;
        this.snapToFloor(this.currentFloor);
        this.updateStatus('DURDURULDU');
        this.setStatusLight('stopped');

        const autoBtn = document.getElementById('auto-mode');
        if (autoBtn) autoBtn.classList.remove('active');
    }

    toggleAutoMode() {
        this.isAutoMode = !this.isAutoMode;
        const autoBtn = document.getElementById('auto-mode');
        if (autoBtn) autoBtn.classList.toggle('active', this.isAutoMode);

        if (this.isAutoMode) {
            this.startAutoMode();
        } else {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
            this.updateStatus('Manuel');
        }
    }

    startAutoMode() {
        if (!this.isAutoMode) return;
        clearInterval(this.autoInterval);

        // Sıralı kat sekansı: 1→3→2→4→1→…
        const sequence = [1, 3, 2, 4];
        let idx = sequence.indexOf(this.currentFloor);
        if (idx === -1) idx = 0;

        this.autoInterval = setInterval(() => {
            if (this.isMoving) return;
            idx = (idx + 1) % sequence.length;
            this.goToFloor(sequence[idx]);
        }, 4200);
    }

    setupControls() {
        document.querySelectorAll('.floor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isAutoMode) this.toggleAutoMode();
                this.goToFloor(parseInt(btn.dataset.floor));
            });
        });

        document.getElementById('emergency-stop')
            ?.addEventListener('click', () => this.emergencyStop());

        document.getElementById('auto-mode')
            ?.addEventListener('click', () => this.toggleAutoMode());
    }

    startPerformanceUpdates() {
        const update = () => {
            const speedEl = document.getElementById('lift-speed');
            if (speedEl) speedEl.textContent = this.isMoving ? '2.5' : '0.0';

            const capEl = document.getElementById('lift-capacity');
            if (capEl && !this.isMoving) {
                capEl.textContent = (1800 + Math.floor(Math.random() * 400));
            }

            const effEl = document.getElementById('lift-efficiency');
            if (effEl) effEl.textContent = (98.5 + Math.random() * 1.4).toFixed(1);

            const weightEl = document.getElementById('load-weight');
            if (weightEl && !this.isMoving) {
                weightEl.textContent = (1200 + Math.floor(Math.random() * 800)) + ' kg';
            }
        };

        update();
        setInterval(update, 1800);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const anim = new PalletLiftAnimation();
    anim.startPerformanceUpdates();

    // Auto mode başlangıçta aktif göster
    const autoBtn = document.getElementById('auto-mode');
    if (autoBtn) autoBtn.classList.add('active');
});
