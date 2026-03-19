/* ═══════════════════════════════════════
   Womondo Pegasus — Scroll Animations (Phase 2B)
   GSAP ScrollTrigger + Draggable
   ═══════════════════════════════════════ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

/* ─── initScrollAnimations ────────────────────────────────────────
   Sets up every ScrollTrigger-based animation on the page:
   - Highlight text pink-gradient reveal
   - Pricing cards fade-up stagger
   - Spec number counter animation
   - Interior gallery fade-up stagger + parallax scale
   ─────────────────────────────────────────────────────────────── */
export function initScrollAnimations() {

  // ── 1. Highlight Text ──
  gsap.utils.toArray('.highlight-text').forEach((el) => {
    gsap.fromTo(
      el,
      { backgroundSize: '0% 100%' },
      {
        backgroundSize: '100% 100%',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
        duration: 1,
        ease: 'power4.in',
      }
    );
  });

  // ── 2. Pricing Cards — fade up + stagger ──
  const pricingCards = gsap.utils.toArray('.pricing-card');
  if (pricingCards.length) {
    gsap.set(pricingCards, { y: 60, autoAlpha: 0 });
    ScrollTrigger.batch(pricingCards, {
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,
        }),
      start: 'top 85%',
      once: true,
    });
  }

  // ── 3. Spec Number Counter ──
  gsap.utils.toArray('.spec-card_value').forEach((el) => {
    const target = parseFloat(el.dataset.countTo) || 0;
    const decimals = parseInt(el.dataset.decimals, 10) || 0;

    // Set initial text
    el.textContent = '0';

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate() {
        el.textContent = obj.val.toFixed(decimals);
      },
    });
  });

  // Also fade up the spec cards
  const specCards = gsap.utils.toArray('.spec-card');
  if (specCards.length) {
    gsap.set(specCards, { y: 40, autoAlpha: 0 });
    ScrollTrigger.batch(specCards, {
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: true,
        }),
      start: 'top 85%',
      once: true,
    });
  }

  // ── 4. Interior Gallery — fade up + stagger + parallax ──
  const interiorCards = gsap.utils.toArray('.interior-section .works-cards');
  if (interiorCards.length) {
    // Fade-up reveal
    gsap.set(interiorCards, { y: 60, autoAlpha: 0 });
    ScrollTrigger.batch(interiorCards, {
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0,
          autoAlpha: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,
        }),
      start: 'top 85%',
      once: true,
    });

    // Parallax scale on each image
    interiorCards.forEach((card) => {
      const img = card.querySelector('.image-works');
      if (!img) return;

      gsap.to(img, {
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    });
  }

  // ── 5. Philosophy section fade-in ──
  const philosophyText = document.querySelector('.philosophy_text');
  if (philosophyText) {
    gsap.set(philosophyText, { y: 30, autoAlpha: 0 });
    gsap.to(philosophyText, {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: philosophyText,
        start: 'top 85%',
        once: true,
      },
    });
  }
}

/* ─── initDraggableGallery ────────────────────────────────────────
   Sets up:
   - GSAP Draggable instances with bounds + inertia-like bounce
   - Custom cursor that only appears within .sec-card
   ─────────────────────────────────────────────────────────────── */
export function initDraggableGallery() {
  const secCard = document.querySelector('.sec-card');
  if (!secCard) return;

  // ── Custom cursor ──
  const cursor = secCard.querySelector('.cursor-fixed');
  const defaultCursor = secCard.querySelector('.cursor-default');
  const hoverCursor = secCard.querySelector('.cursor-hover');
  const grabCursor = secCard.querySelector('.cursor-grab');

  let mouseX = -100;
  let mouseY = -100;
  let cursorVisible = false;
  let isInSecCard = false;

  function showCursorType(type) {
    if (!isInSecCard) return;
    gsap.to(defaultCursor, { autoAlpha: type === 'default' ? 1 : 0, duration: 0.2 });
    gsap.to(hoverCursor, { autoAlpha: type === 'hover' ? 1 : 0, duration: 0.2 });
    gsap.to(grabCursor, { autoAlpha: type === 'grab' ? 1 : 0, duration: 0.2 });
  }

  // Expose for Draggable callbacks
  window.showCursor = showCursorType;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (secCard) {
      const rect = secCard.getBoundingClientRect();
      isInSecCard =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    }

    if (!cursorVisible && isInSecCard) {
      cursorVisible = true;
      gsap.to(cursor, { autoAlpha: 1, duration: 0 });
    } else if (cursorVisible && !isInSecCard) {
      cursorVisible = false;
      gsap.to(cursor, { autoAlpha: 0, duration: 0 });
    }
  });

  function animateCursor() {
    if (isInSecCard && cursor) {
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0, ease: 'power2.out' });
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hide default system cursor inside .sec-card
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .sec-card { cursor: none !important; }
    .sec-card * { cursor: none !important; }
  `;
  document.head.appendChild(cursorStyle);

  // Hover events on interactive elements within .sec-card
  const hoverElements = secCard.querySelectorAll('a, button, .draggable-card');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (isInSecCard) showCursorType('hover');
    });
    el.addEventListener('mouseleave', () => {
      if (isInSecCard) showCursorType('default');
    });
  });

  secCard.addEventListener('mouseenter', () => {
    isInSecCard = true;
    gsap.to(cursor, { autoAlpha: 1, duration: 0.3 });
    showCursorType('default');
  });

  secCard.addEventListener('mouseleave', () => {
    isInSecCard = false;
    gsap.to(cursor, { autoAlpha: 0, duration: 0.3 });
  });

  document.addEventListener('mouseleave', () => {
    if (isInSecCard && cursor) {
      gsap.to(cursor, { autoAlpha: 0, duration: 0 });
    }
  });

  // Initial hide
  if (cursor) {
    gsap.set([cursor, defaultCursor, hoverCursor, grabCursor], { autoAlpha: 0 });
  }

  // ── Draggable cards with bounce physics ──
  const cards = secCard.querySelectorAll('.draggable-card');
  cards.forEach((card) => {
    card.style.willChange = 'transform';
    card.style.transformStyle = 'preserve-3d';
  });

  function startBouncePhysics(draggable, container, bounceDistance) {
    const element = draggable.target;

    let vx = draggable.getVelocity('x') * 0.01;
    let vy = draggable.getVelocity('y') * 0.01;
    const friction = 0.96;
    const minVelocity = 0.3;

    function animate() {
      vx *= friction;
      vy *= friction;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      const cardWidth = element.offsetWidth;
      const cardHeight = element.offsetHeight;
      const currentX = draggable.x;
      const currentY = draggable.y;

      // Bounce off edges
      if (currentX < bounceDistance) {
        draggable.x = bounceDistance;
        vx = Math.abs(vx) * 0.6;
      } else if (currentX > containerWidth - cardWidth - bounceDistance) {
        draggable.x = containerWidth - cardWidth - bounceDistance;
        vx = -Math.abs(vx) * 0.6;
      }
      if (currentY < bounceDistance) {
        draggable.y = bounceDistance;
        vy = Math.abs(vy) * 0.6;
      } else if (currentY > containerHeight - cardHeight - bounceDistance) {
        draggable.y = containerHeight - cardHeight - bounceDistance;
        vy = -Math.abs(vy) * 0.6;
      }

      gsap.set(element, {
        x: draggable.x + vx,
        y: draggable.y + vy,
      });
      draggable.x += vx;
      draggable.y += vy;

      if (Math.abs(vx) > minVelocity || Math.abs(vy) > minVelocity) {
        requestAnimationFrame(animate);
      }
    }

    if (Math.abs(vx) > minVelocity || Math.abs(vy) > minVelocity) {
      animate();
    }
  }

  function createBouncyDraggable(cardSelector, containerEl) {
    if (!containerEl) return;

    const remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const bounceDistance = 5 * remToPx;

    Draggable.create(cardSelector, {
      type: 'x,y',
      edgeResistance: 0,
      bounds: containerEl,
      onPress() {
        if (this.target.closest('.sec-card') && window.showCursor) {
          window.showCursor('grab');
        }
      },
      onRelease() {
        if (this.target.closest('.sec-card') && window.showCursor) {
          window.showCursor('hover');
        }
      },
      onDragStart() {
        if (this.target.closest('.sec-card') && window.showCursor) {
          window.showCursor('grab');
        }
      },
      onDragEnd() {
        if (this.target.closest('.sec-card') && window.showCursor) {
          window.showCursor('hover');
        }
        startBouncePhysics(this, containerEl, bounceDistance);
      },
    });
  }

  createBouncyDraggable('.draggable-card', secCard);
}
