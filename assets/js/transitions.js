// transitions.js

class NexoTransition {
  constructor() {
    this.overlay = this.buildOverlay();
    this.busy = false;
    this.bindLinks();
  }

  buildOverlay() {
    const el = document.createElement('div');
    el.id = 'transition-overlay';
    Object.assign(el.style, {
      position: 'fixed', inset: '0', zIndex: '9999',
      background: 'var(--bg)', opacity: '0', pointerEvents: 'none'
    });
    document.body.appendChild(el);
    return el;
  }

  bindLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target && !this.busy) this.go(target);
      });
    });
  }

  go(target) {
    this.busy = true;
    const ov = this.overlay;

    gsap.timeline()
      .to(ov, { opacity: 1, duration: 0.25, ease: 'Power2.in',
        onStart: () => { ov.style.pointerEvents = 'all'; }
      })
      .call(() => {
        if (window._lenis) {
          window._lenis.scrollTo(target, { immediate: true });
        } else {
          target.scrollIntoView({ behavior: 'instant' });
        }
      })
      .to(ov, { opacity: 0, duration: 0.4, ease: 'Power2.out',
        onComplete: () => {
          ov.style.pointerEvents = 'none';
          this.busy = false;
        }
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined') new NexoTransition();
});
