/* ═══════════════════════════════════════
   Womondo Pegasus — Hero Animations
   GSAP timeline: preloader → letters → subtitle → text
   ═══════════════════════════════════════ */

import { gsap } from 'gsap';

/**
 * Initialize hero section animations.
 * Creates and plays a GSAP timeline for the full entrance sequence:
 *   1. Preloader bars slide up to reveal the page
 *   2. Hero heading letters animate in one by one
 *   3. Subtitle fades in
 *   4. Lead text fades in
 *   5. Scroll indicator appears
 *
 * Call this from main.js after DOMContentLoaded / window.load.
 */
export function initHero() {
  const preloaderBars = document.querySelectorAll('.preloader-bar');
  const preloader = document.querySelector('.preloader');
  const heroLetters = document.querySelectorAll('.hero-heading-letter');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroLead = document.querySelector('.hero-lead');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  const pageWrapper = document.querySelector('.page-wrapper');
  const heroVideo = document.querySelector('.hero-video');

  // Master timeline
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onStart: () => {
      // Ensure preloader is visible at start
      if (preloader) {
        gsap.set(preloader, { display: 'flex' });
      }
    }
  });

  // ── Phase 0: Set initial states ──
  gsap.set(heroLetters, { y: '110%', opacity: 0 });
  if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 0, y: 20 });
  if (heroLead) gsap.set(heroLead, { opacity: 0, y: 30 });
  if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 10 });

  // ── Phase 1: Preloader bars slide up ──
  // Each bar slides up with a staggered delay, revealing the hero beneath
  if (preloaderBars.length > 0) {
    tl.to(preloaderBars, {
      yPercent: -100,
      duration: 0.8,
      stagger: {
        each: 0.08,
        from: 'center'
      },
      ease: 'power2.inOut'
    }, 0);

    // Hide preloader after animation
    tl.set(preloader, { display: 'none' }, 0.9);
  }

  // ── Phase 1.5: Reveal page wrapper ──
  if (pageWrapper) {
    tl.to(pageWrapper, {
      autoAlpha: 1,
      duration: 0.01
    }, 0.4);
  }

  // ── Phase 2: Start video playback ──
  if (heroVideo) {
    tl.add(() => {
      heroVideo.play().catch(() => {
        // Video autoplay blocked — fallback image is already visible
      });
    }, 0.5);
  }

  // ── Phase 3: Hero heading letters reveal ──
  // Each letter slides up from below, one by one
  if (heroLetters.length > 0) {
    tl.to(heroLetters, {
      y: '0%',
      opacity: 1,
      duration: 0.7,
      stagger: {
        each: 0.05,
        from: 'start'
      },
      ease: 'power3.out'
    }, 0.6);
  }

  // ── Phase 4: Subtitle fade in ──
  if (heroSubtitle) {
    tl.to(heroSubtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 1.1);
  }

  // ── Phase 5: Lead text fade in ──
  if (heroLead) {
    tl.to(heroLead, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out'
    }, 1.3);
  }

  // ── Phase 6: Scroll indicator ──
  if (scrollIndicator) {
    tl.to(scrollIndicator, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.8);
  }

  // ── Parallax effect on scroll (subtle hero movement) ──
  initHeroParallax();

  return tl;
}

/**
 * Subtle parallax on the hero content as user scrolls.
 * Content moves up slightly, creating depth.
 */
function initHeroParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroBg = document.querySelector('.hero-bg');

  if (!heroContent || typeof gsap === 'undefined') return;

  // Check if ScrollTrigger is available
  const ScrollTrigger = gsap.core?.globals?.()?.ScrollTrigger;
  if (!ScrollTrigger) {
    // Fallback: simple scroll listener for parallax
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;

      if (scrollY < heroHeight) {
        const progress = scrollY / heroHeight;
        heroContent.style.transform = `translateY(${progress * -60}px)`;
        heroContent.style.opacity = 1 - progress * 0.8;

        if (heroBg) {
          heroBg.style.transform = `translateY(${progress * 30}px) scale(${1 + progress * 0.05})`;
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    return;
  }

  // With ScrollTrigger — preferred path
  gsap.to(heroContent, {
    y: -60,
    opacity: 0.2,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  if (heroBg) {
    gsap.to(heroBg, {
      y: 30,
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
}
