// ===== SİSTEM ENTEGRASYONU ANİMASYONU =====

class SistemEntegrasyonuAnimation {
    constructor() {
        this.isRunning = true;
        this.latency   = 15;
        this.uptime    = 99.9;

        this.nodes = [
            { id: 0, thr: 1.2, unit: 'MB/s', min: 0.5, max: 3.0, step: 0.15 },
            { id: 1, thr: 0.8, unit: 'MB/s', min: 0.3, max: 2.0, step: 0.1  },
            { id: 2, thr: 0.5, unit: 'MB/s', min: 0.2, max: 1.5, step: 0.08 },
            { id: 3, thr: 2.1, unit: 'MB/s', min: 0.8, max: 4.0, step: 0.2  },
        ];

        document.getElementById('si-start')?.addEventListener('click', () => this.start());
        document.getElementById('si-stop')?.addEventListener('click',  () => this.stop());
        document.getElementById('si-reset')?.addEventListener('click', () => this.reset());

        this._updateAll();
        this._startLoop();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._setDots(true);
        this._startLoop();
    }

    stop() {
        this.isRunning = false;
        clearInterval(this._timer);
        this._setDots(false);
        this.nodes.forEach(n => {
            this._set(`si-stat-${n.id}`, 'KAPALI');
            const stat = document.getElementById(`si-stat-${n.id}`);
            if (stat) { stat.className = 'si-node-stat off'; }
        });
        this._set('si-conn',    '0/4');
        this._set('si-hub-val', '0.0 MB/s');
    }

    reset() {
        this.stop();
        this.nodes[0].thr = 1.2;
        this.nodes[1].thr = 0.8;
        this.nodes[2].thr = 0.5;
        this.nodes[3].thr = 2.1;
        this.latency = 15;
        this.uptime  = 99.9;
        this._updateAll();
        this._setDots(true);
    }

    _startLoop() {
        this._timer = setInterval(() => {
            if (!this.isRunning) return;
            this.nodes.forEach(n => {
                n.thr = Math.max(n.min, Math.min(n.max, n.thr + (Math.random() - 0.5) * n.step * 2));
                this._set(`si-thr-${n.id}`, n.thr.toFixed(1) + ' ' + n.unit);
                if (Math.random() < 0.07) {
                    const dot  = document.getElementById(`si-dot-${n.id}`);
                    const stat = document.getElementById(`si-stat-${n.id}`);
                    if (dot && stat) {
                        dot.classList.remove('active'); dot.classList.add('warn');
                        stat.textContent = 'YAVAŞ'; stat.className = 'si-node-stat warn';
                        setTimeout(() => {
                            dot.classList.remove('warn'); dot.classList.add('active');
                            stat.textContent = 'BAĞLI'; stat.className = 'si-node-stat ok';
                        }, 1200);
                    }
                }
            });
            this.latency = Math.max(5, Math.min(50, this.latency + (Math.random() - 0.5) * 4));
            this.uptime  = Math.max(99.0, Math.min(100, this.uptime + (Math.random() - 0.5) * 0.05));
            const total = this.nodes.reduce((s, n) => s + n.thr, 0);
            this._set('si-hub-val', total.toFixed(1) + ' MB/s');
            this._set('si-latency', Math.round(this.latency) + ' ms');
            this._set('si-uptime',  this.uptime.toFixed(1) + '%');
            this._set('si-conn',    '4/4');
        }, 1800);
    }

    _updateAll() {
        this.nodes.forEach(n => {
            this._set(`si-thr-${n.id}`, n.thr.toFixed(1) + ' ' + n.unit);
            this._set(`si-stat-${n.id}`, 'BAĞLI');
            const stat = document.getElementById(`si-stat-${n.id}`);
            if (stat) stat.className = 'si-node-stat ok';
        });
        const total = this.nodes.reduce((s, n) => s + n.thr, 0);
        this._set('si-hub-val', total.toFixed(1) + ' MB/s');
        this._set('si-latency', Math.round(this.latency) + ' ms');
        this._set('si-uptime',  this.uptime.toFixed(1) + '%');
        this._set('si-conn',    '4/4');
        this._setDots(true);
    }

    _setDots(active) {
        [0, 1, 2, 3].forEach(i => {
            const dot = document.getElementById(`si-dot-${i}`);
            if (!dot) return;
            dot.classList.remove('active', 'warn');
            if (active) dot.classList.add('active');
        });
    }

    _set(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.integration-hero-animation')) new SistemEntegrasyonuAnimation();
});
