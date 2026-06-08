// er-diagram.js — Diagrama ER estático (SVG/Canvas) y helpers de nav

function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

function initNavActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function initTiltCards() {
  const cards = document.querySelectorAll('#equipo .group, .norm-grid .group');
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 600,
        ease: 'Power1.out',
        duration: 0.25
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0,
        ease: 'Elastic.out(1, 0.5)',
        duration: 0.6
      });
    });
  });
}

function initNormalizacionTabs() {
  const tabs = document.querySelectorAll('.tab-btn[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;

  // 1. Ocultar todos los panels por JS (override al CSS inicial)
  panels.forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  // 2. Activar la primera tab de cada grupo
  //    (puede haber varios sets de tabs en la misma página)
  const activated = new Set();

  tabs.forEach(tab => {
    const targetId = tab.dataset.tab;
    const target = document.getElementById(targetId);
    if (!target) return;

    // Si es la primera tab única que apunta a este grupo, activarla
    const siblings = document.querySelectorAll(`.tab-btn[data-tab]`);
    const firstOfGroup = [...siblings].find(t => {
      const tgt = document.getElementById(t.dataset.tab);
      return tgt && tgt.parentElement === target.parentElement;
    });

    if (firstOfGroup === tab && !activated.has(target.parentElement)) {
      activated.add(target.parentElement);
      tab.classList.add('active');
      target.style.display = 'block';
      target.classList.add('active');
    } else {
      tab.classList.remove('active');
    }

    tab.addEventListener('click', () => {
      // Desactivar todas las tabs y panels del mismo contenedor
      const container = tab.closest('section') || document.body;
      container.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      // Activar la seleccionada
      tab.classList.add('active');
      const dest = document.getElementById(tab.dataset.tab);
      if (dest) {
        dest.style.display = 'block';
        dest.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(dest,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'Power2.out' }
          );
        }
      }
    });
  });
}
