/* ═══════════════════════════════════════
   Womondo Pegasus — Spotlight Card Effect
   Mouse-tracking glow on spec + pricing cards
   ═══════════════════════════════════════ */

export function initSpotlightCards() {
  const cards = document.querySelectorAll('.spec-card, .pricing-card');
  if (!cards.length) return;

  // Track mouse globally
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });
}
