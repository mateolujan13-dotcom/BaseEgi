// main.js — punto de entrada, inicializa todo en orden

function initSchemaGrid() {
  const container = document.getElementById('schema-grid-container');
  if (!container || typeof DB_TABLES === 'undefined') return;

  function getColorClass(type) {
    if (type.includes('PK')) return 'text-[#E8FF00] border-[#E8FF00]/20 bg-[#E8FF00]/10';
    if (type.includes('FK')) return 'text-[#00E5FF] border-[#00E5FF]/20 bg-[#00E5FF]/10';
    if (type.includes('INT') || type.includes('DECIMAL')) return 'text-[#FF8A00] border-[#FF8A00]/20 bg-[#FF8A00]/10';
    return 'text-[#00FF66] border-[#00FF66]/20 bg-[#00FF66]/10';
  }

  const gridHtml = DB_TABLES.map(table => `
    <div class="bg-[#111118]/80 border border-white/10 p-4 transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-sm hover:border-[#E8FF00]/40 group rounded-md">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
                <h3 class="font-mono text-sm text-[#E8FF00] font-bold">${table.name}</h3>
            </div>
        </div>
        <div class="space-y-2">
            ${table.cols.map(col => `
                <div class="flex items-center justify-between py-1 border-b border-white/5 last:border-0 group/col">
                    <span class="font-mono text-[11px] text-[#F0F0F8] group-hover/col:text-[#00E5FF] transition-colors">${col.n}</span>
                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-sm border ${getColorClass(col.t)}">${col.t}</span>
                </div>
            `).join('')}
        </div>
    </div>
  `).join('');

  container.innerHTML = gridHtml;
}

window.addEventListener('load', () => {
  // 0. Schema grid (antes que ScrollTrigger para evitar race condition)
  initSchemaGrid();

  // 1. Verificar dependencias críticas
  const checks = {
    gsap: typeof gsap !== 'undefined',
    ScrollTrigger: typeof ScrollTrigger !== 'undefined',
    Lenis: typeof Lenis !== 'undefined',
    Chart: typeof Chart !== 'undefined',
    d3: typeof d3 !== 'undefined',
    Splitting: typeof Splitting !== 'undefined',
  };

  Object.entries(checks).forEach(([lib, ok]) => {
    if (!ok) console.warn(`⚠️ NexoSport: ${lib} no cargó. Verificar CDN.`);
  });

  // 2. Smooth scroll con Lenis
  if (checks.Lenis) {
    if (typeof initLenis === 'function') initLenis();
  }

  // 3. Registrar plugin GSAP
  if (checks.gsap && checks.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (typeof initRevealAnimations === 'function') initRevealAnimations();
    if (typeof initHeroParallax === 'function') initHeroParallax();
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // 4. Features individuales
  if (typeof initNavScroll === 'function') initNavScroll();
  if (typeof initNavActiveSection === 'function') initNavActiveSection();
  if (typeof initCounters === 'function') initCounters();
  if (typeof initTypewriter === 'function') initTypewriter();
  if (typeof initHeroSplitting === 'function' && checks.Splitting) initHeroSplitting();
  if (typeof initCursor === 'function') initCursor();
  if (typeof initCopyButtons === 'function') initCopyButtons();
  if (typeof initCodeCardToggles === 'function') initCodeCardToggles();
  if (typeof initNormalizacionTabs === 'function') initNormalizacionTabs();
  if (checks.Chart && typeof initCharts === 'function') initCharts();
  if (checks.d3 && typeof initD3Graph === 'function') initD3Graph();

  console.log('✓ NexoSport v2 — IRONDEV\'S — EGI 2025B — Todas las features inicializadas.');
});

function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initNavActiveSection() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  const sections = [...links].map(a => {
    const id = a.getAttribute('href');
    return id ? document.querySelector(id) : null;
  }).filter(Boolean);

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top < 300) current = '#' + section.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === current);
    });
  });
}

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
  });

  // Conectar Lenis con GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Guardar referencia global para usar en transiciones
  window._lenis = lenis;
}

function initHeroSplitting() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  Splitting({ target: '.hero-title', by: 'chars' });

  gsap.from('.hero-title .char', {
    opacity: 0,
    y: 60,
    rotationX: -90,
    stagger: 0.025,
    duration: 0.8,
    ease: 'Power3.out',
    delay: 0.3
  });
}

function initCounters() {
  const options = { duration: 2, useEasing: true, useGrouping: false };

  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      if (document.getElementById('counter-tablas')) {
        new countUp.CountUp('counter-tablas', 23, options).start();
      }
      if (document.getElementById('counter-vistas')) {
        new countUp.CountUp('counter-vistas', 5, options).start();
      }
      if (document.getElementById('counter-triggers')) {
        new countUp.CountUp('counter-triggers', 5, options).start();
      }
      if (document.getElementById('counter-procs')) {
        new countUp.CountUp('counter-procs', 5, options).start();
      }
    }
  });
}

function initTypewriter() {
  new Typed('.hero-sub', {
    strings: [
      'Sistema de base de datos relacional para un e-commerce deportivo. Diseñado, normalizado e implementado por IRONDEV\'S.',
    ],
    typeSpeed: 30,
    showCursor: true,
    cursorChar: '|',
    onComplete: (self) => {}
  });
}



