// er-diagram.js — Tabs de normalización (DDL/DML)

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
