// ===== ÜRETİM TAKİBİ ANİMASYONU =====

class ProductionTrackingAnimation {
    constructor() {
        this.isRunning  = false;
        this.rate       = 125;
        this.quality    = 99.5;
        this.efficiency = 87.3;
        this.total      = 2847;
        this.produced   = 0;
        this.timer      = null;

        this.procStates = [
            { dot: 'pt-dot-0', st: 'pt-sts-0', state: 'run',  label: 'Hazır' },
            { dot: 'pt-dot-1', st: 'pt-sts-1', state: 'run',  label: 'Çalışıyor' },
            { dot: 'pt-dot-2', st: 'pt-sts-2', state: 'run',  label: 'Kontrol' },
            { dot: 'pt-dot-3', st: 'pt-sts-3', state: 'idle', label: 'Hazır' },
        ];

        document.getElementById('pt-start')?.addEventListener('click', () => this.start());
        document.getElementById('pt-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('pt-reset')?.addEventListener('click', () => this.reset());

        this._startMetricLoop();
        this.start();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._set('pt-status', 'ÇALIŞIYOR');
        this._renderProcs();
        this._spawnLoop();
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timer);
        this._set('pt-status', 'DURDURULDU');
        this.procStates.forEach((p, i) => {
            this._setProc(i, 'off', 'Durduruldu');
        });
        this._setQC(null);
    }

    reset() {
        this.stop();
        this.produced   = 0;
        this.rate       = 125;
        this.quality    = 99.5;
        this.efficiency = 87.3;
        this.total      = 2847;
        this._set('pt-status', 'HAZIR');
        this._set('pt-produced', '0');
        this._updateMetrics();
        document.getElementById('pt-products').innerHTML = '';
        this.procStates = [
            { dot: 'pt-dot-0', st: 'pt-sts-0', state: 'run',  label: 'Hazır' },
            { dot: 'pt-dot-1', st: 'pt-sts-1', state: 'run',  label: 'Çalışıyor' },
            { dot: 'pt-dot-2', st: 'pt-sts-2', state: 'run',  label: 'Kontrol' },
            { dot: 'pt-dot-3', st: 'pt-sts-3', state: 'idle', label: 'Hazır' },
        ];
        this._renderProcs();
    }

    _spawnLoop() {
        if (!this.isRunning) return;
        this._spawnProduct();
        const interval = Math.max(500, (60 / this.rate) * 1000);
        this.timer = setTimeout(() => this._spawnLoop(), interval);
    }

    _spawnProduct() {
        const belt = document.getElementById('pt-products');
        if (!belt) return;

        const r = Math.random();
        const type = r < 0.05 ? 'defect' : r < 0.25 ? 'ok' : 'normal';

        const p = document.createElement('div');
        p.className = `pt-product ${type}`;
        p.style.left = '-30px';
        belt.appendChild(p);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            p.style.left = (belt.clientWidth + 30) + 'px';
        }));

        this.produced++;
        this.total++;
        this._set('pt-produced', this.produced);
        this._set('pt-total',    this.total.toLocaleString('tr-TR'));
        this._setQC(type);

        setTimeout(() => p.parentNode?.removeChild(p), 4200);
    }

    _setQC(type) {
        document.getElementById('pt-light-g')?.classList.remove('green-on');
        document.getElementById('pt-light-y')?.classList.remove('yellow-on');
        document.getElementById('pt-light-r')?.classList.remove('red-on');
        if (type === 'ok')     document.getElementById('pt-light-g')?.classList.add('green-on');
        else if (type === 'defect') document.getElementById('pt-light-r')?.classList.add('red-on');
        else if (type === 'normal') document.getElementById('pt-light-y')?.classList.add('yellow-on');
        if (type) setTimeout(() => {
            document.getElementById('pt-light-g')?.classList.remove('green-on');
            document.getElementById('pt-light-y')?.classList.remove('yellow-on');
            document.getElementById('pt-light-r')?.classList.remove('red-on');
        }, 800);
    }

    _startMetricLoop() {
        setInterval(() => {
            if (!this.isRunning) return;
            this.rate       = Math.max(100, Math.min(150, this.rate + (Math.random()-0.5)*8));
            this.quality    = Math.max(98,  Math.min(100, this.quality + (Math.random()-0.5)*0.4));
            this.efficiency = Math.max(80,  Math.min(95,  this.efficiency + (Math.random()-0.5)*1.5));
            this._updateMetrics();
            // Random proc state change
            if (Math.random() < 0.3) {
                const idx = Math.floor(Math.random() * 4);
                const opts = [
                    { state: 'run',  label: 'Çalışıyor' },
                    { state: 'idle', label: 'Hazır' },
                    { state: 'warn', label: 'Beklemede' },
                ];
                const o = opts[Math.floor(Math.random() * opts.length)];
                this._setProc(idx, o.state, o.label);
            }
        }, 2500);
    }

    _updateMetrics() {
        this._set('pt-rate',    Math.round(this.rate));
        this._set('pt-quality', `${this.quality.toFixed(1)}%`);
        this._set('pt-eff',     `${this.efficiency.toFixed(1)}%`);
        this._set('pt-total',   this.total.toLocaleString('tr-TR'));
    }

    _setProc(idx, state, label) {
        this.procStates[idx].state = state;
        this.procStates[idx].label = label;
        const dot = document.getElementById(this.procStates[idx].dot);
        const st  = document.getElementById(this.procStates[idx].st);
        if (dot) dot.dataset.state = state;
        if (st)  st.textContent    = label;
    }

    _renderProcs() {
        this.procStates.forEach((p, i) => this._setProc(i, p.state, p.label));
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.production-hero-animation')) new ProductionTrackingAnimation();
});
