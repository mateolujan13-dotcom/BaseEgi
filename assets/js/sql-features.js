// sql-features.js

function initCopyButtons() {
  document.querySelectorAll('.glass-card').forEach(card => {
    if (!card.querySelector('code')) return;
    const header = card.querySelector('.flex.items-center.justify-between.p-6');
    if (!header) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<span class="copy-icon">⎘</span> Copiar';
    
    Object.assign(btn.style, {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#7A7A95',
      padding: '4px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.7rem',
      fontWeight: '600',
      transition: 'all 0.2s',
      marginLeft: 'auto',
      flexShrink: '0'
    });

    header.appendChild(btn);

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const codeElement = card.querySelector('code');
      if (!codeElement) return;
      const code = codeElement.innerText;
      
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML = '✓ Copiado';
        btn.style.color = '#00FF66';
        btn.style.borderColor = '#00FF66';
        
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            boxShadow: '0 0 0 1px #00FF66',
            duration: 0.1,
            yoyo: true, repeat: 3
          });
        }
        
        setTimeout(() => {
          btn.innerHTML = '<span class="copy-icon">⎘</span> Copiar';
          btn.style.color = '#7A7A95';
          btn.style.borderColor = 'rgba(255,255,255,0.1)';
          if (typeof gsap !== 'undefined') {
            gsap.set(card, { clearProps: 'boxShadow' });
          }
        }, 2000);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    });
  });
}

function initDMLFilters() {
  const filterBtns = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.glass-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      cards.forEach(card => {
        const inPanel = card.closest('.tab-panel');
        const show = !targetId || (inPanel && inPanel.id === targetId) || !inPanel;
        if (typeof gsap !== 'undefined') {
          gsap.to(card, {
            opacity: show ? 1 : 0.15,
            scale: show ? 1 : 0.97,
            duration: 0.3,
            ease: 'Power2.out'
          });
        }
        card.style.pointerEvents = show ? 'all' : 'none';
      });
    });
  });
}

function initCodeCardToggles() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) return;
      const body = card.querySelector('.code-body-content');
      if (!body) return;
      const icon = card.querySelector('.chevron-icon');
      const isCollapsed = card.getAttribute('data-state') !== 'expanded';
      if (isCollapsed) {
        body.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
        card.setAttribute('data-state', 'expanded');
        card.classList.add('border-[#E8FF00]/50');
        if (typeof gsap !== 'undefined') {
          gsap.from(body, { opacity: 0, y: -10, duration: 0.2 });
        }
      } else {
        body.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
        card.setAttribute('data-state', 'collapsed');
        card.classList.remove('border-[#E8FF00]/50');
      }
    });
  });
}
