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

  // ── Scroll-driven video scrubbing ──
  initScrollVideoHero();

  return tl;
}

/**
 * Scroll-driven video scrubbing for the hero section.
 * On desktop: scrubs video playback based on scroll position.
 * On mobile: falls back to autoplay loop.
 * Also fades out hero content as user scrolls.
 */
function initScrollVideoHero() {
  const section = document.getElementById('heroScrollSection');
  const video = document.getElementById('heroScrollVideo');
  const bar = document.getElementById('scrollVideoBar');
  if (!section || !video) return;

  // Mobile: autoplay loop, no scroll scrub
  if (window.innerWidth < 768) {
    video.loop = true;
    video.play().catch(function(){});
    return;
  }

  // Desktop: scroll-driven scrub
  let ready = false;
  let duration = 0;

  video.addEventListener('loadedmetadata', function(){
    duration = video.duration;
    ready = true;
  });

  // Force load
  video.load();

  let ticking = false;
  window.addEventListener('scroll', function(){
    if (!ready || ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      ticking = false;
      if (!ready) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
      const targetTime = progress * duration;
      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        video.currentTime = targetTime;
      }
      if (bar) bar.style.width = (progress * 100) + '%';
    });
  }, { passive: true });

  // Also add hero content parallax on scroll (fade out as user scrolls)
  const heroContent = document.querySelector('.hero-content');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');

  if (heroContent) {
    window.addEventListener('scroll', function() {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);

      // Fade out content as user scrolls past 30%
      if (progress > 0.3) {
        const fadeProgress = (progress - 0.3) / 0.4;
        const opacity = Math.max(0, 1 - fadeProgress);
        const translateY = fadeProgress * -60;
        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${translateY}px)`;
      } else {
        heroContent.style.opacity = '';
        heroContent.style.transform = '';
      }

      // Hide scroll indicator immediately on scroll
      if (scrollIndicator && progress > 0.05) {
        scrollIndicator.style.opacity = '0';
      } else if (scrollIndicator) {
        scrollIndicator.style.opacity = '';
      }
    }, { passive: true });
  }
}
