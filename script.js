// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// 3D hero card tilt, following the cursor across the whole stage
const stage = document.getElementById('heroStage');
const heroCards = [
  { el: document.getElementById('cardBilling'), depth: 10, base: 'rotateX(10deg) rotateY(-16deg)' },
  { el: document.getElementById('cardAttendance'), depth: 40, base: 'rotateX(8deg) rotateY(14deg)' },
  { el: document.getElementById('cardSales'), depth: -10, base: 'rotateX(-6deg) rotateY(-10deg)' },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (stage && !reduceMotion) {
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    heroCards.forEach(({ el, depth }) => {
      if (!el) return;
      const rotY = px * 18;
      const rotX = -py * 14;
      el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${depth}px)`;
    });
  });

  stage.addEventListener('mouseleave', () => {
    heroCards.forEach(({ el, base, depth }) => {
      if (!el) return;
      el.style.transform = `${base} translateZ(${depth}px)`;
    });
  });
}

// Tilt effect for module cards on hover
document.querySelectorAll('.module-card.tilt').forEach((card) => {
  if (reduceMotion) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${-py * 8}deg) rotateY(${px * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
});

// Simple client-side handling for the CTA form (no backend wired up)
const ctaForm = document.getElementById('ctaForm');
const ctaNote = document.getElementById('ctaNote');
if (ctaForm) {
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = ctaForm.querySelector('input').value.trim();
    if (email) {
      ctaNote.textContent = `We'll reach out to ${email} to set up your workspace.`;
      ctaForm.querySelector('input').value = '';
    }
  });
}

// Fade sections in as they enter the viewport
const revealTargets = document.querySelectorAll('.module-card, .how-step, .strip-item');
if ('IntersectionObserver' in window && !reduceMotion) {
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform += ' translateY(16px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform.replace(' translateY(16px)', '');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => observer.observe(el));
}
