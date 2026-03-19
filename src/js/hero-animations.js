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
  const preloader = document.querySelector('.preloader');
  const preloaderPercent = document.querySelector('.preloader-percent');
  const preloaderBarFill = document.querySelector('.preloader-bar-fill');
  const preloaderLogo = document.querySelector('.preloader-logo');
  const heroLetters = document.querySelectorAll('.hero-heading-letter');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroLead = document.querySelector('.hero-lead');
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  const pageWrapper = document.querySelector('.page-wrapper');
  const heroVideo = document.getElementById('heroScrollVideo');

  // ── Phase 0: Set initial states ──
  gsap.set(heroLetters, { y: '110%', opacity: 0 });
  if (heroSubtitle) gsap.set(heroSubtitle, { opacity: 0, y: 20 });
  if (heroLead) gsap.set(heroLead, { opacity: 0, y: 30 });
  if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0, y: 10 });

  // ── Loading progress tracker ──
  let currentPercent = 0;
  let targetPercent = 0;
  let loadingDone = false;

  function updatePercent() {
    if (currentPercent < targetPercent) {
      currentPercent += Math.max(1, Math.round((targetPercent - currentPercent) * 0.15));
      if (currentPercent > targetPercent) currentPercent = targetPercent;
    }
    if (preloaderPercent) preloaderPercent.textContent = currentPercent + '%';
    if (preloaderBarFill) preloaderBarFill.style.width = currentPercent + '%';

    if (currentPercent >= 100 && !loadingDone) {
      loadingDone = true;
      playReveal();
      return;
    }
    if (!loadingDone) requestAnimationFrame(updatePercent);
  }

  // Track video loading (or simulate if no video)
  if (heroVideo) {
    // Bump to 30% once metadata loads
    heroVideo.addEventListener('loadedmetadata', () => { targetPercent = Math.max(targetPercent, 30); });
    // Track buffered progress
    heroVideo.addEventListener('progress', () => {
      if (heroVideo.buffered.length > 0) {
        const buffered = heroVideo.buffered.end(heroVideo.buffered.length - 1);
        const pct = Math.round((buffered / heroVideo.duration) * 100);
        targetPercent = Math.max(targetPercent, Math.min(pct, 100));
      }
    });
    heroVideo.addEventListener('canplaythrough', () => { targetPercent = 100; });
    heroVideo.load();

    // Fallback: if video takes too long, force complete after 6s
    setTimeout(() => { targetPercent = 100; }, 6000);
  } else {
    // No video — just count up quickly
    targetPercent = 100;
  }

  requestAnimationFrame(updatePercent);

  // ── Reveal sequence (after loading) ──
  function playReveal() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Fade out preloader content then slide preloader away
    tl.to(preloaderLogo, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' }, 0);
    tl.to('.preloader-progress', { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' }, 0.1);
    tl.to(preloader, { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' }, 0.4);
    tl.set(preloader, { display: 'none' }, 1);

    // Reveal page wrapper
    if (pageWrapper) {
      tl.to(pageWrapper, { autoAlpha: 1, duration: 0.01 }, 0.5);
    }

    // Hero heading letters reveal
    if (heroLetters.length > 0) {
      tl.to(heroLetters, {
        y: '0%', opacity: 1, duration: 0.7,
        stagger: { each: 0.05, from: 'start' },
        ease: 'power3.out'
      }, 0.7);
    }

    // Subtitle fade in
    if (heroSubtitle) {
      tl.to(heroSubtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 1.2);
    }

    // Lead text fade in
    if (heroLead) {
      tl.to(heroLead, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 1.4);
    }

    // Scroll indicator
    if (scrollIndicator) {
      tl.to(scrollIndicator, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.9);
    }
  }

  // ── Scroll-driven video scrubbing ──
  initScrollVideoHero();
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
