/* ═══════════════════════════════════════
   Womondo Pegasus — Navigation Interactivity
   Top nav scroll behavior + bottom floating nav
   ═══════════════════════════════════════ */

/**
 * Initialize all navigation behavior.
 * Called from main.js after GSAP is ready.
 */
export function initNav() {
  const topNav = document.querySelector('.pegasus-navbar-top');
  const bottomNav = document.querySelector('.pegasus-navbar-bottom');

  if (!topNav && !bottomNav) return;

  initTopNavScroll(topNav);
  initBottomNavVisibility(bottomNav);
  initSmoothScrollLinks();
  initActiveSection();
}

/* ── Top Nav: transparent → solid on scroll, hide on scroll down ── */
function initTopNavScroll(topNav) {
  if (!topNav) return;

  let lastScrollY = 0;
  let ticking = false;
  const scrollThreshold = 100;
  const hideThreshold = 400;

  function updateTopNav() {
    const currentY = window.scrollY;

    // Add/remove scrolled background
    if (currentY > scrollThreshold) {
      topNav.classList.add('is-scrolled');
    } else {
      topNav.classList.remove('is-scrolled');
    }

    // Hide top nav when scrolling down past threshold, show on scroll up
    if (currentY > hideThreshold && currentY > lastScrollY) {
      topNav.classList.add('is-hidden');
    } else {
      topNav.classList.remove('is-hidden');
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateTopNav);
      ticking = true;
    }
  }, { passive: true });
}

/* ── Bottom Nav: show after scrolling past hero ── */
function initBottomNavVisibility(bottomNav) {
  if (!bottomNav) return;

  // Use GSAP ScrollTrigger if available, otherwise manual
  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    const ScrollTrigger = gsap.plugins?.ScrollTrigger || window.ScrollTrigger;

    // Fallback to manual scroll detection
    let ticking = false;
    const showOffset = window.innerHeight * 0.7;

    function updateBottomNav() {
      if (window.scrollY > showOffset) {
        bottomNav.classList.add('is-visible');
      } else {
        bottomNav.classList.remove('is-visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBottomNav);
        ticking = true;
      }
    }, { passive: true });

    // Recalculate offset on resize
    window.addEventListener('resize', () => {
      // showOffset is recalculated via closure next scroll
    }, { passive: true });
  }
}

/* ── Smooth scroll for all anchor links ── */
function initSmoothScrollLinks() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Use GSAP scrollTo if available, otherwise native
      if (typeof gsap !== 'undefined') {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power2.inOut'
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── Active section highlighting ── */
function initActiveSection() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .footer-link[href^="#"]');
  if (navLinks.length === 0) return;

  let ticking = false;

  function updateActiveLink() {
    const sections = [];

    navLinks.forEach(link => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const section = document.querySelector(targetId);
      if (section) {
        sections.push({ link, section });
      }
    });

    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    let activeId = null;
    sections.forEach(({ section }) => {
      if (section.offsetTop <= scrollPos) {
        activeId = '#' + section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === activeId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  }, { passive: true });
}
