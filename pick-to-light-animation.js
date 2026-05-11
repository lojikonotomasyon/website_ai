// ===== PICK-TO-LIGHT ANİMASYONU =====

class PickToLightAnimation {
    constructor() {
        this.BAYS      = 4;
        this.PICK_DELAY = 2000;
        this.hero      = document.getElementById('ptl-hero');
        this.cart      = document.getElementById('ptl-cart');
        this.cartScreen = document.getElementById('ptl-cart-screen');
        this.leds      = Array.from({length: this.BAYS}, (_, i) => document.getElementById(`ptl-led-${i}`));
        this.qtys      = Array.from({length: this.BAYS}, (_, i) => document.getElementById(`ptl-qty-${i}`));
        this.bays      = Array.from(document.querySelectorAll('[data-bay]'));
        this.statusEl  = document.getElementById('ptl-status');
        this.pickedEl  = document.getElementById('ptl-picked');

        this.isRunning = false;
        this.totalPicked = 0;
        this.orderCount  = 0;
        this.timer = null;

        document.getElementById('ptl-start')?.addEventListener('click', () => this.start());
        document.getElementById('ptl-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('ptl-reset')?.addEventListener('click', () => this.reset());

        this._placeCart(0);
        this.start();
    }

    _bayCenter(idx) {
        const heroRect = this.hero.getBoundingClientRect();
        const bayRect  = this.bays[idx].getBoundingClientRect();
        return bayRect.left - heroRect.left + bayRect.width / 2;
    }

    _placeCart(bayIdx) {
        const center = this._bayCenter(bayIdx);
        this.cart.style.left = `${center - 35}px`;
    }

    _deactivateAll() {
        this.leds.forEach(l => l.classList.remove('active'));
        this.bays.forEach(b => b.classList.remove('active'));
        this.qtys.forEach(q => { q.textContent = '—'; });
    }

    _activateBay(bayIdx, qty) {
        this.leds[bayIdx].classList.add('active');
        this.bays[bayIdx].classList.add('active');
        this.qtys[bayIdx].textContent = qty;
        this._placeCart(bayIdx);
        this.cartScreen.textContent = `A${bayIdx + 1}  ×${qty}`;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._setStatus('ÇALIŞIYOR');
        this._runCycle();
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timer);
        this._deactivateAll();
        this._setStatus('DURDURULDU');
        this.cartScreen.textContent = 'STOP';
    }

    reset() {
        this.stop();
        this.totalPicked = 0;
        this.orderCount  = 0;
        this.pickedEl.textContent = '0';
        this._setStatus('HAZIR');
        this.cartScreen.textContent = 'SİPARİŞ';
        this._placeCart(0);
    }

    _runCycle() {
        if (!this.isRunning) return;
        this.orderCount++;
        const numPicks = Math.floor(Math.random() * 3) + 2;
        const picks = Array.from({length: numPicks}, () => ({
            bay: Math.floor(Math.random() * this.BAYS),
            qty: Math.floor(Math.random() * 5) + 1
        }));

        this.cartScreen.textContent = `SİP #${this.orderCount}`;
        let idx = 0;

        const next = () => {
            if (!this.isRunning) return;
            if (idx >= picks.length) {
                this._deactivateAll();
                this.cartScreen.textContent = `✓ #${this.orderCount}`;
                this.timer = setTimeout(() => this._runCycle(), 900);
                return;
            }
            const { bay, qty } = picks[idx++];
            this._deactivateAll();
            this._activateBay(bay, qty);
            this.totalPicked++;
            this.pickedEl.textContent = this.totalPicked;
            this.timer = setTimeout(next, this.PICK_DELAY);
        };
        next();
    }

    _setStatus(txt) {
        if (this.statusEl) this.statusEl.textContent = txt;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ptl-hero')) new PickToLightAnimation();
});
