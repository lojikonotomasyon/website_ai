// ===== VERİ TOPLAMA ANİMASYONU =====

class DataCollectionAnimation {
    constructor() {
        this.isRunning = true;
        this.rate      = 1247;
        this.uptime    = 99.9;

        this.sensors = [
            { id: 0, val: 24.5, min: 20,  max: 30,  step: 0.3, fmt: v => v.toFixed(1) + '°C',   bar: (v,a,b) => (v-a)/(b-a) },
            { id: 1, val: 2.3,  min: 1,   max: 5,   step: 0.1, fmt: v => v.toFixed(1) + ' bar',  bar: (v,a,b) => (v-a)/(b-a) },
            { id: 2, val: 150,  min: 80,  max: 200, step: 5,   fmt: v => Math.round(v) + ' L/m', bar: (v,a,b) => (v-a)/(b-a) },
            { id: 3, val: 75,   min: 10,  max: 100, step: 2,   fmt: v => Math.round(v) + '%',    bar: (v,a,b) => (v-a)/(b-a) },
        ];

        document.getElementById('dc-start')?.addEventListener('click', () => this.start());
        document.getElementById('dc-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('dc-reset')?.addEventListener('click', () => this.reset());

        this._set('dc-status', 'ÇALIŞIYOR');
        this._startLoop();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._set('dc-status', 'ÇALIŞIYOR');
        this._setDots(true);
        this._startLoop();
    }

    stop() {
        this.isRunning = false;
        this._set('dc-status', 'DURDURULDU');
        this._setDots(false);
        clearInterval(this._timer);
    }

    reset() {
        this.stop();
        this.sensors[0].val = 24.5;
        this.sensors[1].val = 2.3;
        this.sensors[2].val = 150;
        this.sensors[3].val = 75;
        this.rate   = 1247;
        this.uptime = 99.9;
        this._updateAll();
        this._set('dc-status', 'HAZIR');
    }

    _startLoop() {
        this._timer = setInterval(() => {
            if (!this.isRunning) return;
            this.sensors.forEach(s => {
                s.val = Math.max(s.min, Math.min(s.max, s.val + (Math.random() - 0.5) * s.step * 2));
                this._updateSensor(s);
            });
            this.rate   = Math.max(800,  Math.min(1800, this.rate   + (Math.random() - 0.5) * 50));
            this.uptime = Math.max(99.0, Math.min(100,  this.uptime + (Math.random() - 0.5) * 0.05));
            this._set('dc-rate',     Math.round(this.rate));
            this._set('dc-hub-rate', Math.round(this.rate) + '/s');
            this._set('dc-uptime',   this.uptime.toFixed(1) + '%');
        }, 1500);
    }

    _updateSensor(s) {
        const el = document.getElementById(`dc-val-${s.id}`);
        if (el) el.textContent = s.fmt(s.val);
        const bar = document.getElementById(`dc-bar-${s.id}`);
        if (bar) bar.style.width = (s.bar(s.val, s.min, s.max) * 100).toFixed(0) + '%';
        if (Math.random() < 0.12) {
            const dot = document.getElementById(`dc-dot-${s.id}`);
            if (dot) {
                dot.classList.remove('active');
                dot.classList.add('warn');
                setTimeout(() => { dot.classList.remove('warn'); dot.classList.add('active'); }, 400);
            }
        }
    }

    _updateAll() {
        this.sensors.forEach(s => this._updateSensor(s));
        this._set('dc-rate',     Math.round(this.rate));
        this._set('dc-hub-rate', Math.round(this.rate) + '/s');
        this._set('dc-uptime',   this.uptime.toFixed(1) + '%');
    }

    _setDots(active) {
        [0, 1, 2, 3].forEach(i => {
            const dot = document.getElementById(`dc-dot-${i}`);
            if (!dot) return;
            dot.classList.remove('active', 'warn');
            if (active) dot.classList.add('active');
        });
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.data-collection-hero-animation')) new DataCollectionAnimation();
});
