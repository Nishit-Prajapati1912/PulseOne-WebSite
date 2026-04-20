// ── Remove hero fallback text when image loads ──
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('load', () => {
    const fallback = document.getElementById('hero-fallback');
    if (fallback) fallback.style.display = 'none';
  });
});

// ── Scroll animation for cards ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.eco-card, .infra-card, .app-card, .journey-step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});