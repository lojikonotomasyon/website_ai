(function () {
    const root = document.getElementById("sorter3d");
    if (!root) return;
    if (!window.THREE) {
        root.classList.add("is-fallback");
        return;
    }
    const coarsePointer = matchMedia("(pointer: coarse)").matches,
        reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPD = 3,
        L = 6,
        R = 1.6,
        A = Math.PI * R,
        P = 2 * L + 2 * A,
        H = 1.4,
        W = 0.35,
        FEEDH = 0.8,
        FSP = 0.48,
        BSPD = 0.5;
    const wrap = document.getElementById("sr3d-stage");
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
        root.classList.add("is-fallback");
        throw err;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarsePointer ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    wrap.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, 1, 0.05, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa0a8, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(6, 12, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
    scene.add(sun);
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const M = (c, o = {}) =>
        new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.5, metalness: 0.2 }, o));
    function pos(s) {
        s = ((s % P) + P) % P;
        if (s < L) return { x: -L / 2 + s, z: -R, dx: 1, dz: 0, c: false };
        s -= L;
        if (s < A) {
            const f = s / R;
            return {
                x: L / 2 + R * Math.sin(f),
                z: -R * Math.cos(f),
                dx: Math.cos(f),
                dz: Math.sin(f),
                c: true,
            };
        }
        s -= A;
        if (s < L) return { x: L / 2 - s, z: R, dx: -1, dz: 0, c: false };
        s -= L;
        const f = s / R;
        return {
            x: -L / 2 - R * Math.sin(f),
            z: R * Math.cos(f),
            dx: -Math.cos(f),
            dz: -Math.sin(f),
            c: true,
        };
    }
    function stadium(r) {
        const sh = new THREE.Shape();
        sh.moveTo(-L / 2, -r);
        sh.lineTo(L / 2, -r);
        sh.absarc(L / 2, 0, r, -Math.PI / 2, Math.PI / 2, false);
        sh.lineTo(-L / 2, r);
        sh.absarc(-L / 2, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
        return sh;
    }
    function ring(r0, r1, h, mat, y) {
        const sh = stadium(r1);
        const hole = new THREE.Path();
        const hs = stadium(r0);
        hole.setFromPoints(hs.getPoints(64).reverse());
        sh.holes.push(hole);
        const g = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 64 });
        const m = new THREE.Mesh(g, mat);
        m.rotation.x = -Math.PI / 2;
        m.position.y = y;
        scene.add(m);
        return m;
    }

    const glow = [];
    const inner = new THREE.Group();
    scene.add(inner);
    const NDOT = 110;
    const dotGeo = new THREE.BoxGeometry(0.06, 0.02, 0.06);
    const dotMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
    });
    const dots = new THREE.InstancedMesh(dotGeo, dotMat, NDOT);
    dots.renderOrder = 8;
    inner.add(dots);
    const dum = new THREE.Object3D(),
        col = new THREE.Color();
    for (let i = 0; i < NDOT; i++) {
        const p = pos((i * P) / NDOT);
        dum.position.set(p.x, H * 0.5 - 0.06, p.z);
        dum.rotation.y = -Math.atan2(p.dz, p.dx);
        dum.updateMatrix();
        dots.setMatrixAt(i, dum.matrix);
        dots.setColorAt(i, col.set(0x0b3d3a));
    }
    const pulseGeo = new THREE.BoxGeometry(0.6, 0.05, 0.09);
    const pulses = [];
    function makePulses(n) {
        pulses.forEach((p) => inner.remove(p.m));
        pulses.length = 0;
        for (let i = 0; i < n; i++) {
            const s0 = (i * P) / n;
            const hue = i % 3 === 0 ? 0x6ff3ff : i % 3 === 1 ? 0x2de2c0 : 0x8aa8ff;
            const m = new THREE.Mesh(
                pulseGeo,
                new THREE.MeshBasicMaterial({
                    color: hue,
                    transparent: true,
                    opacity: 0.95,
                    depthWrite: false,
                }),
            );
            m.renderOrder = 8;
            inner.add(m);
            pulses.push({ m, s: s0, y: H * 0.5, v: 0, off: 0, ph: Math.random() * 10 });
        }
    }

    const glass = new THREE.MeshPhysicalMaterial({
        color: 0x10151f,
        transparent: true,
        opacity: 0.58,
        roughness: 0.06,
        metalness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const shell = ring(R - W, R + W, H, glass, 0);
    shell.renderOrder = 5;
    shell.castShadow = true;
    const alu = M(0xc9ccd1, { metalness: 0.85, roughness: 0.28 });
    ring(R - W - 0.01, R + W + 0.01, 0.05, M(0x1b1f27, { metalness: 0.5, roughness: 0.4 }), -0.0);
    ring(R + W - 0.012, R + W + 0.012, 0.022, alu, H);
    ring(R - W - 0.012, R - W + 0.012, 0.022, alu, H);
    const accent = new THREE.MeshBasicMaterial({ color: 0x2de2c0 });
    [[-1], [1]].forEach(([zs]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(L, 0.012, 0.004), accent);
        b.position.set(0, 0.1, zs * (R + W + 0.016));
        scene.add(b);
    });

    function logoTex() {
        const c = document.createElement("canvas");
        c.width = 2048;
        c.height = 400;
        const g = c.getContext("2d");
        const parts = [
            ["Loji", "#ffffff"],
            ["k", "#d4a017"],
            ["On", "#ffffff"],
        ];
        const draw = () => {
            g.clearRect(0, 0, c.width, c.height);
            g.font = '800 250px Inter,"Helvetica Neue",Arial,sans-serif';
            g.textAlign = "left";
            g.textBaseline = "middle";
            let x = (c.width - parts.reduce((sum, [text]) => sum + g.measureText(text).width, 0)) / 2;
            for (const [text, color] of parts) {
                g.fillStyle = color;
                g.fillText(text, x, c.height / 2 + 10);
                x += g.measureText(text).width;
            }
        };
        draw();
        const t = new THREE.CanvasTexture(c);
        t.anisotropy = 8;
        document.fonts.ready.then(() => {
            draw();
            t.needsUpdate = true;
        });
        return t;
    }
    const lt = logoTex();
    const logoMats = [];
    [-1, 1].forEach((zs) => {
        const mat = new THREE.MeshBasicMaterial({ map: lt, transparent: true, depthWrite: false });
        logoMats.push(mat);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.55), mat);
        m.position.set(0, H * 0.56, zs * (R + W + 0.02));
        if (zs < 0) m.rotation.y = Math.PI;
        m.renderOrder = 10;
        scene.add(m);
    });

    const bookGeo = new THREE.BoxGeometry(0.22, 0.04, 0.16);
    const bookCols = [0xd85a30, 0x639922, 0xd4537e, 0xba7517, 0x534ab7, 0x0f6e56, 0xa32d2d, 0x185fa5].map(
        (c) => M(c, { roughness: 0.7, metalness: 0 }),
    );
    const feedGroup = new THREE.Group();
    scene.add(feedGroup);
    let feeds = [];
    function buildFeeds(nf) {
        while (feedGroup.children.length) feedGroup.remove(feedGroup.children[0]);
        feeds = [];
        const mFrame = M(0x7f77dd, { metalness: 0.3 }),
            mBelt = M(0x22252b, { roughness: 0.9 }),
            mLeg = M(0xb4b2a9, { metalness: 0.6 }),
            mPortal = new THREE.MeshBasicMaterial({ color: 0x2de2c0 });
        [
            [L / 2, 1],
            [-L / 2, -1],
        ].forEach(([cx, sg]) => {
            for (let i = 0; i < nf; i++) {
                const f = (0.35 + i * FSP) / R;
                const ox = sg * Math.sin(f),
                    oz = -sg * Math.cos(f);
                const g = new THREE.Group();
                g.position.set(cx, 0, 0);
                g.rotation.y = -Math.atan2(oz, ox);
                const r0 = R + W + 0.02,
                    r1 = R + W + 2.1,
                    len = r1 - r0,
                    mid = (r0 + r1) / 2;
                const fr = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.38), mFrame);
                fr.position.set(mid, FEEDH - 0.04, 0);
                fr.castShadow = true;
                g.add(fr);
                const bt = new THREE.Mesh(new THREE.BoxGeometry(len, 0.01, 0.32), mBelt);
                bt.position.set(mid, FEEDH - 0.002, 0);
                g.add(bt);
                [-0.18, 0.18].forEach((z) => {
                    const gd = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.012), mFrame);
                    gd.position.set(mid, FEEDH + 0.025, z);
                    g.add(gd);
                });
                [r0 + 0.15, mid, r1 - 0.08].forEach((x) =>
                    [-0.16, 0.16].forEach((z) => {
                        const lg = new THREE.Mesh(new THREE.BoxGeometry(0.04, FEEDH - 0.08, 0.04), mLeg);
                        lg.position.set(x, (FEEDH - 0.08) / 2, z);
                        lg.castShadow = true;
                        g.add(lg);
                    }),
                );
                const pf = new THREE.Group();
                pf.position.set(R + W + 0.012, FEEDH + 0.1, 0);
                [
                    [0, 0.17, 0.42, 0.012],
                    [0, -0.17, 0.42, 0.012],
                ].forEach(([y0, z0, h, w]) => {
                    const e = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.26, w), mPortal);
                    e.position.set(0, y0, z0);
                    pf.add(e);
                });
                const top = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.012, 0.35), mPortal);
                top.position.set(0, 0.13, 0);
                pf.add(top);
                g.add(pf);
                feedGroup.add(g);
                const books = [];
                for (let k = 0; k < 6; k++) {
                    const b = new THREE.Mesh(
                        bookGeo,
                        bookCols[(k + i * 3 + (sg > 0 ? 0 : 5)) % bookCols.length],
                    );
                    b.castShadow = true;
                    b.visible = false;
                    feedGroup.add(b);
                    books.push({ m: b, d: -1 });
                }
                feeds.push({ g, ox, oz, cx, books, t: Math.random() });
            }
        });
    }
    function bookPos(f, d) {
        const r = R + W + 0.02 + d;
        return new THREE.Vector3(f.cx + f.ox * r, FEEDH + 0.026, f.oz * r);
    }

    buildFeeds(4);
    makePulses(8);

    let th = 0.65,
        ph = 1.05,
        rad = 13,
        auto = true,
        lastUser = 0;
    const tg = new THREE.Vector3(0, 0.55, 0);
    const pts = new Map();
    let pd = 0;
    const cv = renderer.domElement;
    cv.style.touchAction = "pan-y";
    cv.addEventListener("pointerdown", (e) => {
        cv.setPointerCapture(e.pointerId);
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        lastUser = performance.now();
    });
    cv.addEventListener("pointermove", (e) => {
        if (!pts.has(e.pointerId)) return;
        const o = pts.get(e.pointerId);
        lastUser = performance.now();
        if (pts.size === 1) {
            th += (e.clientX - o.x) * 0.007;
            ph = Math.max(0.25, Math.min(1.45, ph - (e.clientY - o.y) * 0.007));
        }
        pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pts.size === 2) {
            const [a, b] = [...pts.values()];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (pd) rad = Math.max(4, Math.min(60, (rad * pd) / d));
            pd = d;
        }
    });
    const up = (e) => {
        pts.delete(e.pointerId);
        pd = 0;
    };
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    function size() {
        const w = wrap.clientWidth,
            h = wrap.clientHeight;
        renderer.setSize(w, h);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
        rad = cam.aspect < 1.4 ? (13 * 1.4 * 1.15) / Math.max(0.4, cam.aspect) : 13;
    }
    size();
    new ResizeObserver(size).observe(wrap);

    let last = performance.now(),
        T = 0;
    const c1 = new THREE.Color(0x0b3d3a),
        c2 = new THREE.Color(0x6ff3ff);
    let paused = reducedMotion;
    function loop(t) {
        const dt = paused ? 0 : Math.max(0, Math.min(0.05, (t - last) / 1000));
        last = t;
        T += dt;
        const k = 2;
        feeds.forEach((f) => {
            f.t += dt;
            if (f.t >= 1) {
                f.t -= 1;
                const b = f.books.find((x) => x.d < 0);
                if (b) {
                    b.d = 1.95;
                    b.m.visible = true;
                }
            }
            f.books.forEach((b) => {
                if (b.d < 0) return;
                b.d -= BSPD * dt;
                if (b.d <= 0) {
                    b.d = -1;
                    b.m.visible = false;
                    return;
                }
                b.m.position.copy(bookPos(f, b.d));
                b.m.rotation.y = f.g.rotation.y;
            });
        });
        pulses.forEach((p) => {
            const q = pos(p.s);
            p.s = (p.s + SPD * dt) % P;
            const nx = q.dz,
                nz = -q.dx;
            p.m.position.set(q.x + nx * p.off, p.y, q.z + nz * p.off);
            p.m.rotation.y = -Math.atan2(q.dz, q.dx);
            p.m.material.opacity = 0.7 + 0.3 * Math.sin(T * 6 + p.ph);
        });
        for (let i = 0; i < NDOT; i++) {
            const w = 0.5 + 0.5 * Math.sin(i * 0.28 - T * SPD * 1.6);
            col.copy(c1).lerp(c2, Math.pow(w, 8));
            dots.setColorAt(i, col);
        }
        dots.instanceColor.needsUpdate = true;
        if (performance.now() - lastUser > 4000) th += dt * 0.08;
        cam.position.set(
            tg.x + rad * Math.sin(ph) * Math.cos(th),
            tg.y + rad * Math.cos(ph),
            tg.z + rad * Math.sin(ph) * Math.sin(th),
        );
        cam.lookAt(tg);
        renderer.render(scene, cam);
    }
    const playBtn = document.getElementById("sr3d-play");
    function syncPlay() {
        const label = playBtn.querySelector("span"),
            key = paused ? "resume" : "pause";
        label.dataset.i18n = "sorter.sim." + key;
        label.textContent = I18N.t("sorter.sim." + key);
        playBtn.querySelector("i").className = "fas " + (paused ? "fa-play" : "fa-pause");
    }
    playBtn.onclick = () => {
        paused = !paused;
        syncPlay();
    };
    syncPlay();
    let inView = true;
    const syncLoop = () => renderer.setAnimationLoop(inView && !document.hidden ? loop : null);
    new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting;
            syncLoop();
        },
        { rootMargin: "100px" },
    ).observe(wrap);
    document.addEventListener("visibilitychange", syncLoop);
    syncLoop();
})();
