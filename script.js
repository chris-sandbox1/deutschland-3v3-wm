/* ============================================================
   Team Deutschland – 3v3 Floorball WM 2026
   JavaScript – Interaktivität & Animationen (Runde 2)
   ============================================================ */

/* ============================================================
   1. EIGENER CURSOR
   ============================================================ */
(function initCursor() {
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .player-card, .bracket-match, .info-card, .coach-card, .insta-card');
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
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollMax = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0) + '%';
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

  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });

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

  const text  = 'WIR SIND TEAM DEUTSCHLAND';
  let   index = 0;

  setTimeout(() => {
    const interval = setInterval(() => {
      el.textContent = text.slice(0, index + 1);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 70);
  }, 600);
})();

/* ============================================================
   5. COUNTDOWN – bis 12. Juni 2026, 08:00 CEST
   ============================================================ */
(function initCountdown() {
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
    const diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = els.hours.textContent = els.minutes.textContent = els.seconds.textContent = '00';
      return;
    }
    els.days.textContent    = pad(Math.floor(diff / 86400000));
    els.hours.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    els.minutes.textContent = pad(Math.floor((diff % 3600000) / 60000));
    els.seconds.textContent = pad(Math.floor((diff % 60000) / 1000));
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
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLORS = ['rgba(221,0,0,', 'rgba(255,215,0,', 'rgba(255,255,255,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.maxAlpha = Math.random() * 0.5 + 0.1;
      this.alpha  = this.maxAlpha;
      this.life   = 0;
      this.maxLife = Math.random() * 400 + 200;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY; this.life++;
      const p = this.life / this.maxLife;
      if      (p < 0.2) this.alpha = this.maxAlpha * (p / 0.2);
      else if (p > 0.8) this.alpha = this.maxAlpha * ((1 - p) / 0.2);
      else              this.alpha = this.maxAlpha;
      if (this.life >= this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 120 }, () => {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife);
    return p;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   7. SCROLL-REVEAL (Intersection Observer)
   ============================================================ */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Spendenbalken animieren wenn sichtbar
        const fill = entry.target.querySelector('.progress-bar-fill');
        if (fill) fill.style.width = fill.style.getPropertyValue('--target-pct') || '0%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   8. 3D-TILT-EFFEKT AUF SPIELER-KARTEN
   ============================================================ */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const inner = card.querySelector('.player-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX =  ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -8;
      const rotateY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  8;
      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transition = 'transform 0.5s ease';
      inner.style.transform = '';
      setTimeout(() => { inner.style.transition = ''; }, 500);
    });
    card.addEventListener('mouseenter', () => { inner.style.transition = 'none'; });
  });
})();

/* ============================================================
   9. BRACKET – Klick-Highlight
   ============================================================ */
(function initBracket() {
  const matches = document.querySelectorAll('.bracket-match');
  matches.forEach(match => {
    match.addEventListener('click', () => {
      matches.forEach(m => m.classList.remove('bracket-match--active'));
      match.classList.toggle('bracket-match--active');
    });
  });
})();

/* ============================================================
   10. SMOOTH-SCROLL für ältere Browser
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   11. FAN-VOTING mit localStorage
   Jeder Browser kann pro Poll einmal abstimmen.
   Ergebnisse werden lokal gespeichert und als Balken angezeigt.
   ============================================================ */
(function initVoting() {

  // Alle Polls auf der Seite finden
  document.querySelectorAll('.poll').forEach(pollEl => {
    const pollKey = pollEl.dataset.poll;
    if (!pollKey) return;

    // Gespeicherte Daten aus localStorage laden
    const storageKey  = 'poll_votes_' + pollKey;
    const userVoteKey = 'poll_uservote_' + pollKey;
    const storedVotes = JSON.parse(localStorage.getItem(storageKey) || 'null');
    const userVote    = localStorage.getItem(userVoteKey);

    // Aktuellen Stimmenstand: nur echte abgegebene Stimmen, kein Seed
    let votes = storedVotes || {};

    // Alle Option-Buttons aufbauen (HTML-Struktur erweitern)
    const optionButtons = pollEl.querySelectorAll('.poll-option');
    optionButtons.forEach(btn => {
      const val = btn.dataset.value;
      if (votes[val] === undefined) votes[val] = 0;

      // Innere Struktur ergänzen
      const label = btn.textContent.trim();
      btn.innerHTML = `
        <div class="option-bar" data-bar="${val}"></div>
        <div class="option-content">
          <span class="option-label">${label}</span>
          <span class="my-vote-badge">Mein Vote</span>
          <span class="option-pct" data-pct="${val}">0%</span>
        </div>
      `;
    });

    const statusEl = pollEl.querySelector('.poll-status');

    function totalVotes() { return Object.values(votes).reduce((s, v) => s + v, 0); }

    function renderResults(animate) {
      const total = totalVotes();
      optionButtons.forEach(btn => {
        const val  = btn.dataset.value;
        const pct  = total > 0 ? Math.round((votes[val] / total) * 100) : 0;
        const bar  = btn.querySelector('.option-bar');
        const pctEl = btn.querySelector('.option-pct');
        if (pctEl) pctEl.textContent = pct + '%';
        if (bar) {
          // Balken setzen (mit kleiner Verzögerung für Animation)
          if (animate) {
            setTimeout(() => { bar.style.transform = `scaleX(${pct / 100})`; }, 80);
          } else {
            bar.style.transition = 'none';
            bar.style.transform  = `scaleX(${pct / 100})`;
          }
        }
      });
      if (statusEl) {
        statusEl.textContent = total + ' Stimme' + (total !== 1 ? 'n' : '') + ' abgegeben';
      }
    }

    function applyVotedState(votedVal) {
      pollEl.classList.add('voted');
      optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === votedVal) {
          btn.classList.add('my-vote');
        }
      });

      // "Stimme zurücknehmen"-Button einfügen falls noch nicht vorhanden
      if (!pollEl.querySelector('.poll-undo-btn')) {
        const undoBtn = document.createElement('button');
        undoBtn.className = 'poll-undo-btn';
        undoBtn.textContent = 'Stimme zurücknehmen';
        undoBtn.addEventListener('click', () => {
          // Stimme dekrementieren (min. 0)
          votes[votedVal] = Math.max(0, (votes[votedVal] || 1) - 1);

          // localStorage aktualisieren
          localStorage.setItem(storageKey, JSON.stringify(votes));
          localStorage.removeItem(userVoteKey);

          // Voted-Zustand aufheben
          pollEl.classList.remove('voted');
          optionButtons.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('my-vote');
          });

          // Balken zurücksetzen wenn keine Stimmen mehr
          if (totalVotes() === 0) {
            optionButtons.forEach(btn => {
              const bar   = btn.querySelector('.option-bar');
              const pctEl = btn.querySelector('.option-pct');
              if (bar)   { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; }
              if (pctEl) pctEl.textContent = '0%';
            });
            if (statusEl) statusEl.textContent = '0 Stimmen abgegeben';
          } else {
            renderResults(true);
            if (statusEl) statusEl.textContent = totalVotes() + ' Stimme' + (totalVotes() !== 1 ? 'n' : '') + ' abgegeben';
          }

          // Undo-Button entfernen
          undoBtn.remove();
        });
        pollEl.appendChild(undoBtn);
      }
    }

    // Falls bereits abgestimmt: Ergebnisse direkt zeigen
    if (userVote) {
      renderResults(false);
      applyVotedState(userVote);
      if (statusEl) statusEl.textContent += ' · Du hast bereits abgestimmt';
    }

    // Klick-Handler auf jeden Button
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (pollEl.classList.contains('voted')) return;
        const val = btn.dataset.value;

        // Stimme hinzufügen
        votes[val] = (votes[val] || 0) + 1;

        // In localStorage speichern
        localStorage.setItem(storageKey,  JSON.stringify(votes));
        localStorage.setItem(userVoteKey, val);

        // Ergebnisse animiert anzeigen
        renderResults(true);
        applyVotedState(val);
      });
    });
  });

})();
