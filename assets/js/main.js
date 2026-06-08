// main.js — punto de entrada, inicializa todo en orden

window.addEventListener('load', () => {
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
    // Fallback CSS puro
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // 4. Features individuales
  if (typeof initNavScroll === 'function') initNavScroll();
  if (typeof initNavActiveSection === 'function') initNavActiveSection();
  if (typeof initCounters === 'function') initCounters();
  if (typeof initTypewriter === 'function') initTypewriter();
  if (typeof initHeroSplitting === 'function' && checks.Splitting) initHeroSplitting();
  if (typeof initTiltCards === 'function') initTiltCards();
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

function initTiltCards() {
  const cards = document.querySelectorAll('.glass-card');
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
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
        new countUp.CountUp('counter-tablas', 21, options).start();
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

// STITCH BENTO GRID GENERATOR
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('schema-grid-container');
  if (!container) return;

  const dbTables = [
    { name: 'roles', cols: [{n:'id_rol', t:'PK INT'}, {n:'nombre', t:'VARCHAR'}, {n:'descripcion', t:'TEXT'}, {n:'fecha_creacion', t:'TS'}] },
    { name: 'usuarios', cols: [{n:'id_usuario', t:'PK INT'}, {n:'nombre / apellido', t:'VARCHAR'}, {n:'email', t:'UNIQUE'}, {n:'password', t:'VARCHAR'}, {n:'telefono', t:'VARCHAR'}, {n:'id_rol', t:'FK INT'}, {n:'estado', t:'CHECK'}] },
    { name: 'clientes', cols: [{n:'id_cliente', t:'PK FK'}, {n:'tipo_cliente', t:'CHECK'}, {n:'cuit', t:'VARCHAR'}, {n:'limite_credito', t:'DECIMAL'}] },
    { name: 'vendedores', cols: [{n:'id_vendedor', t:'PK FK'}, {n:'sucursal', t:'VARCHAR'}, {n:'comision', t:'DECIMAL'}] },
    { name: 'administradores', cols: [{n:'id_admin', t:'PK FK'}, {n:'nivel_acceso', t:'CHECK'}] },
    { name: 'categorias', cols: [{n:'id_categoria', t:'PK INT'}, {n:'nombre', t:'UNIQUE'}, {n:'descripcion', t:'TEXT'}, {n:'activo', t:'BOOL'}] },
    { name: 'proveedores', cols: [{n:'id_proveedor', t:'PK INT'}, {n:'nombre', t:'VARCHAR'}, {n:'cuit', t:'VARCHAR'}, {n:'telefono', t:'VARCHAR'}, {n:'email', t:'VARCHAR'}, {n:'direccion', t:'TEXT'}, {n:'estado', t:'CHECK'}] },
    { name: 'productos', cols: [{n:'id_producto', t:'PK INT'}, {n:'nombre', t:'VARCHAR'}, {n:'descripcion', t:'TEXT'}, {n:'precio_base', t:'DECIMAL'}, {n:'id_categoria', t:'FK INT'}, {n:'id_proveedor', t:'FK INT'}, {n:'estado', t:'CHECK'}] },
    { name: 'inventario', cols: [{n:'id_inventario', t:'PK INT'}, {n:'id_producto', t:'FK UNIQUE'}, {n:'stock_actual', t:'INT'}, {n:'stock_minimo', t:'INT'}, {n:'ubicacion', t:'VARCHAR'}, {n:'ultima_actualizacion', t:'TS'}] },
    { name: 'movimientos_stock', cols: [{n:'id_movimiento', t:'PK INT'}, {n:'id_producto', t:'FK INT'}, {n:'id_usuario', t:'FK INT'}, {n:'tipo_movimiento', t:'CHECK'}, {n:'cantidad', t:'INT'}, {n:'stock_anterior', t:'INT'}, {n:'stock_posterior', t:'INT'}, {n:'motivo', t:'VARCHAR'}, {n:'fecha_movimiento', t:'TS'}] },
    { name: 'pedidos', cols: [{n:'id_pedido', t:'PK INT'}, {n:'numero_pedido', t:'UNIQUE'}, {n:'id_cliente', t:'FK INT'}, {n:'id_vendedor', t:'FK INT'}, {n:'fecha_pedido', t:'TS'}, {n:'estado', t:'CHECK'}, {n:'total', t:'DECIMAL'}, {n:'direccion_envio', t:'TEXT'}] },
    { name: 'detalle_pedido', cols: [{n:'id_detalle', t:'PK INT'}, {n:'id_pedido', t:'FK INT'}, {n:'id_producto', t:'FK INT'}, {n:'cantidad', t:'INT'}, {n:'precio_unitario', t:'DECIMAL'}, {n:'subtotal', t:'DECIMAL'}] },
    { name: 'metodos_pago', cols: [{n:'id_metodo', t:'PK INT'}, {n:'nombre', t:'UNIQUE'}, {n:'descripcion', t:'TEXT'}, {n:'activo', t:'BOOL'}] },
    { name: 'pagos', cols: [{n:'id_pago', t:'PK INT'}, {n:'id_pedido', t:'FK INT'}, {n:'id_metodo', t:'FK INT'}, {n:'monto', t:'DECIMAL'}, {n:'fecha_pago', t:'TS'}, {n:'estado', t:'CHECK'}, {n:'datos_extra', t:'JSON'}] },
    { name: 'carritos', cols: [{n:'id_carrito', t:'PK INT'}, {n:'id_usuario', t:'FK INT'}, {n:'fecha_creacion', t:'TS'}, {n:'estado', t:'CHECK'}] },
    { name: 'items_carrito', cols: [{n:'id_item', t:'PK INT'}, {n:'id_carrito', t:'FK INT'}, {n:'id_producto', t:'FK INT'}, {n:'cantidad', t:'INT'}, {n:'precio_unitario', t:'DECIMAL'}] },
    { name: 'cupones_descuento', cols: [{n:'id_cupon', t:'PK INT'}, {n:'codigo_promocional', t:'UNIQUE'}, {n:'descripcion', t:'TEXT'}, {n:'porcentaje', t:'CHECK'}, {n:'fecha_inicio', t:'DATE'}, {n:'fecha_vencimiento', t:'DATE'}, {n:'activo', t:'BOOL'}] },
    { name: 'uso_cupones', cols: [{n:'id_uso', t:'PK INT'}, {n:'id_cupon', t:'FK INT'}, {n:'id_pedido', t:'FK INT'}, {n:'id_cliente', t:'FK INT'}, {n:'fecha_uso', t:'TS'}] },
    { name: 'opiniones', cols: [{n:'id_opinion', t:'PK INT'}, {n:'id_producto', t:'FK INT'}, {n:'id_usuario', t:'FK INT'}, {n:'calificacion', t:'INT'}, {n:'comentario', t:'TEXT'}, {n:'fecha_opinion', t:'TS'}] },
    { name: 'empresas_transporte', cols: [{n:'id_empresa', t:'PK INT'}, {n:'nombre', t:'UNIQUE'}, {n:'telefono', t:'VARCHAR'}, {n:'email', t:'VARCHAR'}, {n:'sitio_web', t:'VARCHAR'}, {n:'estado', t:'CHECK'}] },
    { name: 'seguimiento_envios', cols: [{n:'id_seguimiento', t:'PK INT'}, {n:'id_pedido', t:'FK INT'}, {n:'id_empresa', t:'FK INT'}, {n:'codigo_tracking', t:'UNIQUE'}, {n:'estado_envio', t:'CHECK'}, {n:'fecha_actualizacion', t:'TS'}] },
    { name: 'cuenta_corriente', cols: [{n:'id_movimiento', t:'PK INT'}, {n:'id_cliente', t:'FK INT'}, {n:'tipo_movimiento', t:'CHECK'}, {n:'monto', t:'DECIMAL'}, {n:'saldo_anterior', t:'DECIMAL'}, {n:'saldo_posterior', t:'DECIMAL'}, {n:'descripcion', t:'TEXT'}, {n:'fecha_movimiento', t:'TS'}] },
    { name: 'precios_por_tipo', cols: [{n:'id_precio', t:'PK INT'}, {n:'id_producto', t:'FK INT'}, {n:'tipo_cliente', t:'CHECK'}, {n:'precio', t:'DECIMAL'}, {n:'cantidad_minima', t:'INT'}] }
  ];

  function getColorClass(type) {
    if (type.includes('PK')) return 'text-[#E8FF00] border-[#E8FF00]/20 bg-[#E8FF00]/10';
    if (type.includes('FK')) return 'text-[#00E5FF] border-[#00E5FF]/20 bg-[#00E5FF]/10';
    if (type.includes('INT') || type.includes('DECIMAL')) return 'text-[#FF8A00] border-[#FF8A00]/20 bg-[#FF8A00]/10';
    return 'text-[#00FF66] border-[#00FF66]/20 bg-[#00FF66]/10';
  }

  const gridHtml = dbTables.map(table => `
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
});
// STITCH CODE VIEWER TOGGLE
window.toggleCard = function(cardElement) {
  const content = cardElement.querySelector('.code-body-content');
  const icon = cardElement.querySelector('.chevron-icon');
  const isCollapsed = cardElement.getAttribute('data-state') === 'collapsed';

  if (isCollapsed) {
      content.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
      cardElement.setAttribute('data-state', 'expanded');
      cardElement.classList.add('border-[#E8FF00]/50');
  } else {
      content.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
      cardElement.setAttribute('data-state', 'collapsed');
      cardElement.classList.remove('border-[#E8FF00]/50');
  }
};
