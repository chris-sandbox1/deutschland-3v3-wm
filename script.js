/* ============================================================
   Team Deutschland – 3v3 Floorball WM 2026
   JavaScript – Interaktivität & Animationen
   ============================================================ */

/* ============================================================
   1. EIGENER CURSOR
   ============================================================ */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  // Nur auf Geräten mit echter Maus aktivieren
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let curX   = 0, curY   = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot folgt sofort
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Cursor folgt mit leichtem Lag (weicher Effekt)
  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover-Effekt auf klickbaren Elementen
  const hoverTargets = document.querySelectorAll('a, button, .player-card, .bracket-match, .th-sortable, .info-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
})();

/* ============================================================
   2. SCROLL-FORTSCHRITTSBALKEN
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct        = scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   3. NAVBAR – wird beim Scrollen solid
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Burger-Menü für Mobile
  const burger    = document.getElementById('navBurger');
  const navLinks  = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });

  // Menü schließen wenn auf Link geklickt
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    });
  });
})();

/* ============================================================
   4. TYPEWRITER-EFFEKT IM HERO
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const text    = 'WIR SIND DEUTSCHLAND';
  let   index   = 0;

  // Kurze Pause am Anfang, dann Buchstabe für Buchstabe
  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, index + 1);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 80); // 80ms pro Buchstabe
  }, 600);
})();

/* ============================================================
   5. COUNTDOWN – bis 12. Juni 2026, 08:00 Uhr (Turnierstart)
   ============================================================ */
(function initCountdown() {
  // Turnierbeginn: 12. Juni 2026, 08:00 Uhr Ortszeit El Escorial (CEST = UTC+2)
  const target = new Date('2026-06-12T08:00:00+02:00').getTime();

  const els = {
    days:    document.getElementById('cdDays'),
    hours:   document.getElementById('cdHours'),
    minutes: document.getElementById('cdMinutes'),
    seconds: document.getElementById('cdSeconds'),
  };
  if (!els.days) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      // Turnier hat begonnen!
      els.days.textContent    = '00';
      els.hours.textContent   = '00';
      els.minutes.textContent = '00';
      els.seconds.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    els.days.textContent    = pad(days);
    els.hours.textContent   = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
})();

/* ============================================================
   6. CANVAS-PARTIKEL IM HERO
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let   W, H;
  let   particles = [];

  // Farben: Rot, Gold, Weiß
  const COLORS = ['rgba(221,0,0,', 'rgba(255,215,0,', 'rgba(255,255,255,'];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Partikel-Klasse
  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 2.5 + 0.5;   // 0.5 – 3px
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha  = Math.random() * 0.5 + 0.1;
      this.maxAlpha = this.alpha;
      this.life   = 0;
      this.maxLife = Math.random() * 400 + 200;
    }

    update() {
      this.x    += this.speedX;
      this.y    += this.speedY;
      this.life++;

      // Sanftes Ein-/Ausblenden
      const progress = this.life / this.maxLife;
      if (progress < 0.2) {
        this.alpha = this.maxAlpha * (progress / 0.2);
      } else if (progress > 0.8) {
        this.alpha = this.maxAlpha * ((1 - progress) / 0.2);
      } else {
        this.alpha = this.maxAlpha;
      }

      if (this.life >= this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  // 120 Partikel erzeugen
  const COUNT = 120;
  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife); // Verschiedene Startphasen
    particles.push(p);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   7. SCROLL-REVEAL ANIMATION (Intersection Observer)
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Fortschrittsbalken animieren wenn sichtbar
        const fill = entry.target.querySelector('.progress-bar-fill');
        if (fill) {
          const target = fill.style.getPropertyValue('--target-pct') || '0%';
          fill.style.width = target;
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ============================================================
   8. 3D-TILT-EFFEKT AUF SPIELER-KARTEN
   ============================================================ */
(function initTilt() {
  // Nur auf Geräten mit Maus
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const inner = card.querySelector('.player-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;  // Mausposition in der Karte
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX =  ((y - cy) / cy) * -8; // Max ±8 Grad
      const rotateY = ((x - cx) / cx) *  8;

      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      inner.style.transition = 'transform 0.5s ease';
      setTimeout(() => { inner.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'none';
    });
  });
})();

/* ============================================================
   9. ERGEBNISTABELLE – Daten & Sortierung
   ============================================================ */
(function initTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  // ⚠️ PLATZHALTER-DATEN — mit echten Gruppenphase-Ergebnissen ersetzen!
  const data = [
    { flag: '🇩🇪', team: 'Deutschland', germany: true,  sp: 3, s: 3, u: 0, n: 0, tore: '12:4',  pts: 9  },
    { flag: '🇸🇪', team: 'Schweden',    germany: false, sp: 3, s: 2, u: 1, n: 0, tore: '10:6',  pts: 7  },
    { flag: '🇫🇮', team: 'Finnland',    germany: false, sp: 3, s: 2, u: 0, n: 1, tore: '8:7',   pts: 6  },
    { flag: '🇨🇭', team: 'Schweiz',     germany: false, sp: 3, s: 1, u: 1, n: 1, tore: '7:8',   pts: 4  },
    { flag: '🇨🇿', team: 'Tschechien',  germany: false, sp: 3, s: 1, u: 0, n: 2, tore: '6:10',  pts: 3  },
    { flag: '🇨🇦', team: 'Kanada',      germany: false, sp: 3, s: 0, u: 1, n: 2, tore: '5:9',   pts: 1  },
    { flag: '🇳🇴', team: 'Norwegen',    germany: false, sp: 3, s: 0, u: 0, n: 3, tore: '3:11',  pts: 0  },
    { flag: '🇺🇸', team: 'USA',         germany: false, sp: 3, s: 1, u: 0, n: 2, tore: '5:11',  pts: 3  },
  ];

  let sortCol = 'pts';
  let sortAsc = false; // Absteigend als Standard

  function renderTable(rows) {
    tbody.innerHTML = '';
    rows.forEach((row, idx) => {
      const tr = document.createElement('tr');
      if (row.germany) tr.classList.add('row--germany');
      tr.innerHTML = `
        <td class="td-pos">${idx + 1}</td>
        <td class="td-team"><span class="td-flag">${row.flag}</span>${row.team}</td>
        <td>${row.sp}</td>
        <td>${row.s}</td>
        <td>${row.u}</td>
        <td>${row.n}</td>
        <td>${row.tore}</td>
        <td class="td-pts">${row.pts}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function sortData(col, asc) {
    return [...data].sort((a, b) => {
      let valA = a[col];
      let valB = b[col];
      // "Tore" ist ein String wie "12:4" — wir sortieren nach Differenz
      if (col === 'tore') {
        const [gA, gAg] = a.tore.split(':').map(Number);
        const [gB, gBg] = b.tore.split(':').map(Number);
        valA = gA - gAg;
        valB = gB - gBg;
      }
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ?  1 : -1;
      return 0;
    });
  }

  // Ersten Render
  renderTable(sortData(sortCol, sortAsc));

  // Spalten-Sortierung
  const headers = document.querySelectorAll('.th-sortable');
  headers.forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = false;
      }
      // Pfeile aktualisieren
      headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      th.classList.add(sortAsc ? 'sort-asc' : 'sort-desc');

      renderTable(sortData(sortCol, sortAsc));
    });
  });

  // Punkte-Spalte initial als sortiert markieren
  const ptsHeader = document.querySelector('[data-col="pts"]');
  if (ptsHeader) ptsHeader.classList.add('sort-desc');
})();

/* ============================================================
   10. BRACKET – Klick-Interaktion (Tooltip/Highlight)
   ============================================================ */
(function initBracket() {
  const matches = document.querySelectorAll('.bracket-match');
  if (!matches.length) return;

  matches.forEach(match => {
    match.addEventListener('click', () => {
      // Alle anderen deaktivieren
      matches.forEach(m => m.classList.remove('bracket-match--active'));
      match.classList.toggle('bracket-match--active');
    });
  });
})();

/* ============================================================
   11. PROGRESS-BALKEN – beim Scrollen animieren
   ============================================================ */
(function initProgressBar() {
  // Wird vom Intersection Observer (Punkt 7) ausgelöst,
  // wenn das donate-Reveal-Element sichtbar wird.
  // Hier als Fallback direkt ansteuern:
  const fill = document.querySelector('.progress-bar-fill');
  if (!fill) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = fill.style.getPropertyValue('--target-pct') || '73%';
        fill.style.width = target;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(fill.closest('.donate-inner') || fill);
})();

/* ============================================================
   12. SMOOTH-SCROLL für Anker-Links (Fallback für ältere Browser)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
