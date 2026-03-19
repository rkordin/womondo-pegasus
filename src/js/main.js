/* ═══════════════════════════════════════
   Womondo Pegasus — Main Entry
   ═══════════════════════════════════════ */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { TextPlugin } from 'gsap/TextPlugin';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable, TextPlugin);

// Module imports
import { initHero } from './hero-animations.js';
import { initNav } from './nav.js';
import { initScrollAnimations, initDraggableGallery } from './scroll-animations.js';
import { initFormValidation } from './form-validation.js';
import { initSpotlightCards } from './spotlight-cards.js';

// Page load — initialize all modules
window.addEventListener('load', () => {
  gsap.set('.page-wrapper', { autoAlpha: 1 });

  // Hero entrance sequence
  initHero();

  // Navigation behavior
  initNav();

  // Scroll-triggered animations (highlight text, pricing, specs, interior)
  initScrollAnimations();

  // Mouse-tracking spotlight glow on spec + pricing cards
  initSpotlightCards();

  // Draggable lifestyle gallery
  initDraggableGallery();

  // Equipment configurator — handled by external pegasus-configurator.js

  // Form validation + EU country dropdown + dealer auto-assign
  initFormValidation();

  console.log('[Pegasus] All modules initialized');
});
