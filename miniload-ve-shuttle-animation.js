// ===== MİNİLOAD VE SHUTTLE ANİMASYONU =====
// 4×5 raf ızgarası, 2 eksenli vinç (crosshair), getBoundingClientRect ile
// piksel hassasiyetli konumlama.

class MiniloadAnimation {
    constructor() {
        this.ROWS = 4;
        this.COLS = 5;
        this.MOVE_T = 1500; // ms, vinç seyahat süresi

        this.isRunning = false;
        this.opTimer   = null;
        this.opCount   = 0;

        this.TOTE_COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#a78bfa'];
        this.grid = [];  // [row][col] = renk string | null

        this._initGrid();
        this._buildDOM();
        this._setupControls();
        this._setupVisibility();
        this._startInfoUpdates();

        // DOM boyutları yerleştikten sonra vinç başlangıç pozisyonu
        requestAnimationFrame(() => requestAnimationFrame(() => {
            this._initCranePos();
            setTimeout(() => this.start(), 400);
        }));
    }

    // ─── RAF IZGARA DURUMU ────────────────────────────────────────
    _initGrid() {
        this.grid = [];
        for (let r = 0; r < this.ROWS; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.COLS; c++) {
                this.grid[r][c] = Math.random() > 0.28
                    ? this.TOTE_COLORS[Math.floor(Math.random() * this.TOTE_COLORS.length)]
                    : null;
            }
        }
    }

    // ─── DOM OLUŞTURMA ────────────────────────────────────────────
    _buildDOM() {
        const grid = document.getElementById('rack-grid');
        if (!grid) return;
        grid.innerHTML = '';

        // Üst fiziksel sıradan (ROWS-1) alt sıraya (0) doğru ekle
        for (let r = this.ROWS - 1; r >= 0; r--) {
            for (let c = 0; c < this.COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'rack-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;

                if (this.grid[r][c]) {
                    const tote = document.createElement('div');
                    tote.className = 'rack-tote';
                    tote.style.setProperty('--tc', this.grid[r][c]);
                    cell.appendChild(tote);
                }
                grid.appendChild(cell);
            }
        }
    }

    // ─── POZİSYON HESAPLAMA ───────────────────────────────────────
    _container() { return document.querySelector('.miniload-hero-animation'); }

    _cellPos(row, col) {
        const cont = this._container();
        const cell = document.querySelector(`.rack-cell[data-row="${row}"][data-col="${col}"]`);
        if (!cont || !cell) return null;
        const cr = cont.getBoundingClientRect();
        const tr = cell.getBoundingClientRect();
        return {
            x: tr.left - cr.left + tr.width  / 2,
            y: tr.top  - cr.top  + tr.height / 2
        };
    }

    _outputPos() {
        const cont   = this._container();
        const output = document.getElementById('output-station');
        if (!cont || !output) return null;
        const cr = cont.getBoundingClientRect();
        const or = output.getBoundingClientRect();
        return {
            x: or.left - cr.left + or.width  / 2,
            y: or.top  - cr.top  + or.height / 2
        };
    }

    // ─── VİNÇ HAREKETİ ───────────────────────────────────────────
    _moveCrane(pos, instant = false) {
        const hBar = document.getElementById('crane-h-bar');
        const vBar = document.getElementById('crane-v-bar');
        const head = document.getElementById('crane-head');
        if (!hBar || !vBar || !head || !pos) return;

        if (instant) {
            hBar.style.transition = 'none';
            vBar.style.transition = 'none';
            head.style.transition = 'none';
        } else {
            const ease = `${this.MOVE_T}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
            hBar.style.transition = `top ${ease}`;
            vBar.style.transition = `left ${ease}`;
            head.style.transition = `top ${ease}, left ${ease}`;
        }

        hBar.style.top  = pos.y + 'px';
        vBar.style.left = pos.x + 'px';
        head.style.top  = pos.y + 'px';
        head.style.left = pos.x + 'px';

        if (instant) {
            requestAnimationFrame(() => requestAnimationFrame(() => {
                hBar.style.transition = '';
                vBar.style.transition = '';
                head.style.transition = '';
            }));
        }
    }

    _initCranePos() {
        const pos = this._cellPos(this.ROWS - 1, 0);
        if (pos) this._moveCrane(pos, true);
    }

    // ─── RAF OPERASYONLARI ────────────────────────────────────────
    _getOccupied() {
        const cells = [];
        for (let r = 0; r < this.ROWS; r++)
            for (let c = 0; c < this.COLS; c++)
                if (this.grid[r][c]) cells.push([r, c]);
        return cells;
    }

    _pickTote(row, col) {
        const color = this.grid[row][col];
        this.grid[row][col] = null;

        const cell = document.querySelector(`.rack-cell[data-row="${row}"][data-col="${col}"]`);
        const tote = cell?.querySelector('.rack-tote');
        if (tote) {
            tote.style.transition = 'transform 0.32s ease, opacity 0.32s ease';
            tote.style.transform  = 'scale(0)';
            tote.style.opacity    = '0';
            setTimeout(() => tote.remove(), 340);
        }
        cell?.classList.add('active');
        setTimeout(() => cell?.classList.remove('active'), 700);

        return color;
    }

    _refillRandom(count = 1) {
        const empty = [];
        for (let r = 0; r < this.ROWS; r++)
            for (let c = 0; c < this.COLS; c++)
                if (!this.grid[r][c]) empty.push([r, c]);

        empty.sort(() => Math.random() - 0.5).slice(0, count).forEach(([r, c]) => {
            const color = this.TOTE_COLORS[Math.floor(Math.random() * this.TOTE_COLORS.length)];
            this.grid[r][c] = color;

            const cell = document.querySelector(`.rack-cell[data-row="${r}"][data-col="${c}"]`);
            if (!cell) return;
            const tote = document.createElement('div');
            tote.className = 'rack-tote';
            tote.style.setProperty('--tc', color);
            tote.style.transform = 'scale(0)';
            tote.style.opacity   = '0';
            cell.appendChild(tote);
            requestAnimationFrame(() => {
                tote.style.transition = 'transform 0.35s ease, opacity 0.35s ease';
                tote.style.transform  = '';
                tote.style.opacity    = '';
            });
        });
    }

    _showOutputTote(color) {
        const el = document.getElementById('output-tote');
        if (!el) return;
        el.style.setProperty('--tc', color);
        el.classList.add('visible');
        setTimeout(() => el.classList.remove('visible'), 2000);
    }

    // ─── ANA DÖNGÜ ────────────────────────────────────────────────
    _runCycle() {
        if (!this.isRunning) return;

        let occupied = this._getOccupied();
        if (occupied.length < 3) {
            this._refillRandom(this.COLS);
            occupied = this._getOccupied();
        }
        if (occupied.length === 0) {
            this.opTimer = setTimeout(() => this._runCycle(), 800);
            return;
        }

        const [row, col] = occupied[Math.floor(Math.random() * occupied.length)];

        this._setStatus('Hedefe Gidiyor');
        this._moveCrane(this._cellPos(row, col));

        this.opTimer = setTimeout(() => {
            if (!this.isRunning) return;

            this._setStatus('Ürün Alınıyor');
            const color = this._pickTote(row, col);

            setTimeout(() => {
                if (!this.isRunning) return;

                this._setStatus('Çıkışa Taşınıyor');
                this._moveCrane(this._outputPos());

                this.opTimer = setTimeout(() => {
                    if (!this.isRunning) return;

                    this._setStatus('Teslim Edildi');
                    this._showOutputTote(color);
                    this.opCount++;
                    this._updateStats();

                    if (Math.random() > 0.35) this._refillRandom(1);

                    this.opTimer = setTimeout(() => this._runCycle(), 1800);
                }, this.MOVE_T + 100);

            }, 650);

        }, this.MOVE_T + 100);
    }

    // ─── KONTROL ──────────────────────────────────────────────────
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._setStatus('Çalışıyor');
        this._runCycle();
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.opTimer);
        this._setStatus('Durduruldu');
    }

    reset() {
        this.stop();
        this.opCount = 0;
        this._initGrid();
        this._buildDOM();
        this._updateStats();
        this._setStatus('Sıfırlandı');
        requestAnimationFrame(() => requestAnimationFrame(() => this._initCranePos()));
    }

    _setupControls() {
        document.getElementById('start-btn')?.addEventListener('click', () => this.start());
        document.getElementById('stop-btn')?.addEventListener('click', () => this.stop());
        document.getElementById('reset-btn')?.addEventListener('click', () => this.reset());
    }

    _setupVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stop();
            else if (!this.isRunning) this.start();
        });
    }

    // ─── EKRAN GÜNCELLEMELERİ ────────────────────────────────────
    _setStatus(text) {
        const el = document.getElementById('crane-status');
        if (el) el.textContent = text;
    }

    _updateStats() {
        const el = document.getElementById('retrieved-value');
        if (el) el.textContent = this.opCount;
    }

    _startInfoUpdates() {
        const tick = () => {
            const eff = document.getElementById('efficiency-value');
            if (eff) eff.textContent = (97.6 + Math.random() * 2.0).toFixed(1) + '%';

            const spd = document.getElementById('speed-value');
            if (spd) spd.textContent = this.isRunning
                ? (2.6 + Math.random() * 0.8).toFixed(1) + ' m/s'
                : '0.0 m/s';
        };
        tick();
        setInterval(tick, 1800);
    }
}

document.addEventListener('DOMContentLoaded', () => new MiniloadAnimation());
