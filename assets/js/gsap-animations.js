// gsap-animations.js — Toda la lógica GSAP

function initRevealAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  ScrollTrigger.batch('.reveal', {
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, ease: 'Power2.out' }),
    onLeave: batch => gsap.set(batch, { opacity: 0, y: -30, overwrite: true }),
    onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true, ease: 'Power2.out' }),
    onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 30, overwrite: true })
  });
}

function initHeroParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  .to('.hero-glow',  { yPercent: -15, ease: 'none' }, 0)
  .to('.hero-glow2', { yPercent: -10, ease: 'none' }, 0)
  .to('.hero-tag',   { yPercent: -50, opacity: 0, ease: 'none' }, 0)
  .to('.hero-title', { yPercent: -30, ease: 'none' }, 0)
  .to('.hero-stats', { yPercent: -50, opacity: 0, ease: 'none' }, 0);
}
