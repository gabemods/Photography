(function() {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');

  function setTheme(mode) {
    body.classList.remove("dark", "light");
    body.classList.add(mode);
  }

  function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  function setupThemeToggle(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (body.classList.contains("dark")) setTheme("light");
      else setTheme("dark");
    });
  }

  applySystemTheme();
  setupThemeToggle("themeToggleHeader");
  setupThemeToggle("themeToggleMobile");

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", e => {
    setTheme(e.matches ? "dark" : "light");
  });

  if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const range = document.getElementById('apertureRange');
  const fstopValue = document.getElementById('fstopValue');
  const simImage = document.getElementById('simImage');

  if (range && fstopValue && simImage) {
    function updateSim(v) {
      const rounded = Math.round(v * 10) / 10;
      fstopValue.textContent = 'f/' + (rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1));
      const blur = Math.max(0, (22 - v) / (22 - 1.4) * 12);
      const brightness = 1 + ((2.8 - v) / (22 - 1.4)) * 0.9;
      simImage.style.filter = `blur(${blur}px) brightness(${Math.max(0.6, brightness)})`;
      const min = parseFloat(range.min);
      const max = parseFloat(range.max);
      const progress = ((v - min) / (max - min)) * 100;
      range.style.setProperty('--progress', `${progress}%`);
    }
    range.addEventListener('input', (e) => updateSim(parseFloat(e.target.value)));
    updateSim(parseFloat(range.value));
  }

  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  
  if (galleryGrid && lightbox && lightboxImg && lightboxCaption && lightboxClose) {
    function openLightbox(imgSrc, caption, alt) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = alt || '';
      lightboxCaption.textContent = caption || '';
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('open');
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    }
    galleryGrid.addEventListener('click', (e) => {
      const fig = e.target.closest('figure');
      if (!fig) return;
      const img = fig.querySelector('img');
      const caption = fig.querySelector('figcaption')?.textContent || '';
      openLightbox(img.src.replace('/400/300', '/1200/900'), caption, img.alt);
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (ev) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileMenu) mobileMenu.classList.remove('open');
      }
    });
  });
})();