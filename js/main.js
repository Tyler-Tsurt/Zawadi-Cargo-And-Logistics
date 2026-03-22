/* ============================================================
   ZAWADI CARGO & LOGISTICS — main.js  v5
   Mobile menu rebuilt as a separate fixed overlay element
   so it works correctly at any scroll position.
   ============================================================ */
'use strict';

/* ── NAVBAR + MOBILE MENU ────────────────────────────────── */
(function () {
  const navbar   = document.getElementById('navbar');
  const burger   = document.getElementById('hamburger');
  const overlay  = document.getElementById('mobileMenu');   // separate fixed div
  const hero     = document.getElementById('hero');
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[data-section]');       // desktop
  const mLinks   = overlay ? overlay.querySelectorAll('a[data-section]') : [];    // mobile

  /* ── scroll state ── */
  function onScroll () {
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
    const pastHero   = window.scrollY + 10 >= heroBottom - 100;

    navbar.classList.toggle('over-hero', !pastHero);
    navbar.classList.toggle('sticky',     pastHero);

    // Active link — desktop
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 110) current = sec.id;
    });
    links.forEach(a => a.classList.toggle('active', a.dataset.section === current));
    mLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));

    // Floating buttons
    const fb = document.getElementById('floatBtns');
    if (fb) fb.classList.toggle('show', window.scrollY > 460);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── hamburger: toggle the overlay ── */
  function openMenu () {
    burger.classList.add('open');
    // Force hamburger spans dark while overlay is open
    burger.querySelectorAll('span').forEach(s => s.style.background = '#0f1a2e');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu () {
    burger.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.background = '');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  // Close on overlay link click
  if (overlay) {
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    // Close on backdrop tap (clicking the overlay bg itself)
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeMenu();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ── HERO MORPHING TYPEWRITER ────────────────────────────── */
(function () {
  const el = document.getElementById('heroMorphWord');
  if (!el) return;

  const words = [
    { text: 'Cargo.',    style: 'style-gold'    },
    { text: 'Goods.',    style: 'style-blue'    },
    { text: 'Commerce.', style: 'style-outline' },
    { text: 'Dreams.',   style: 'style-white'   },
    { text: 'Business.', style: 'style-gold'    },
    { text: 'Progress.', style: 'style-blue'    },
  ];

  let idx = 0;

  function morphTo (next) {
    el.classList.remove('in');
    el.classList.add('out');
    setTimeout(() => {
      el.textContent = next.text;
      el.className   = 'morph-word ' + next.style;
      el.classList.add('in');
    }, 430);
  }

  el.textContent = words[0].text;
  el.className   = 'morph-word ' + words[0].style;

  setInterval(() => {
    idx = (idx + 1) % words.length;
    morphTo(words[idx]);
  }, 2800);
})();


/* ── REVEAL ON SCROLL ────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .stagger');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => entry.target.classList.add('on'), delay * 100);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

  els.forEach(el => obs.observe(el));
})();


/* ── COUNTER ANIMATION ───────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function run (el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    const start  = performance.now();
    const isInt  = Number.isInteger(target);
    (function step (now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (isInt ? Math.floor(target * e) : (target * e).toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ── MAP SWITCHER ────────────────────────────────────────── */
(function () {
  const items   = document.querySelectorAll('.loc-item');
  const frame   = document.getElementById('mapFrame');
  const extLink = document.getElementById('mapExtLink');
  if (!items.length || !frame) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const src = item.dataset.map;
      const ext = item.dataset.ext;
      if (src) {
        frame.style.opacity    = '0';
        frame.style.transition = 'opacity 0.28s';
        setTimeout(() => {
          frame.src    = src;
          frame.onload = () => { frame.style.opacity = '1'; };
        }, 280);
      }
      if (extLink && ext) extLink.href = ext;
    });
  });
})();


/* ── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    }
  });
});


/* ── SERVICE CARD 3D TILT (desktop only) ────────────────── */
if (!window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}


/* ── CONTACT FORM ────────────────────────────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('#fname').value.trim();
    const email   = form.querySelector('#femail').value.trim();
    const message = form.querySelector('#fmessage').value.trim();
    if (!name || !email || !message) { alert('Please fill in your name, email address, and message.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
    const service = form.querySelector('#fservice').value;
    const phone   = form.querySelector('#fphone').value.trim();
    const subj    = encodeURIComponent(`Enquiry: ${service || 'General'} — ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`);
    window.location.href = `mailto:Operations@zawadicargoandlogistics.com?subject=${subj}&body=${body}`;
    if (success) { success.style.display = 'block'; success.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
    form.reset();
  });
})();


/* ── CURRENT YEAR ────────────────────────────────────────── */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});


/* ── PARALLAX HERO OVERLAY ───────────────────────────────── */
(function () {
  const overlay = document.querySelector('.hero-overlay');
  if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      overlay.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });
})();
