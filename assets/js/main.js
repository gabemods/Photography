(function(){
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('closeMenu');
  const nav = document.querySelector('.nav');

  // Theme toggle
  function setTheme(theme) {
    body.classList.remove('light','dark');
    body.classList.add(theme);
    localStorage.setItem('site-theme', theme);
  }
  const saved = localStorage.getItem('site-theme') || 'light';
  setTheme(saved);
  themeToggle.addEventListener('click', () => {
    setTheme(body.classList.contains('light') ? 'dark' : 'light');
  });

  // Mobile menu
  menuToggle.addEventListener('click', ()=> {
    mobileMenu.classList.add('open');
  });
  closeMenu.addEventListener('click', ()=> {
    mobileMenu.classList.remove('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', ()=> mobileMenu.classList.remove('open'));
  });

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Simulator logic
  const range = document.getElementById('apertureRange');
  const fstopValue = document.getElementById('fstopValue');
  const simImage = document.getElementById('simImage');

  function updateSim(v) {
    const rounded = Math.round(v * 10) / 10;
    fstopValue.textContent = 'f/' + (rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1));
    const blur = Math.max(0, (22 - v) / (22 - 1.4) * 12);
    const brightness = 1 + ((2.8 - v) / (22 - 1.4)) * 0.9;
    simImage.style.filter = `blur(${blur}px) brightness(${Math.max(0.6, brightness)})`;
  }
  range.addEventListener('input', (e)=> updateSim(parseFloat(e.target.value)));
  updateSim(parseFloat(range.value));

  // Gallery lightbox
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(imgSrc, caption, alt) {
    lightboxImg.src = imgSrc;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden','false');
    lightbox.classList.add('open');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
  }

  galleryGrid.addEventListener('click', (e) => {
    const fig = e.target.closest('figure');
    if(!fig) return;
    const img = fig.querySelector('img');
    const caption = fig.querySelector('figcaption')?.textContent || '';
    openLightbox(img.src.replace('/400/300','/1200/900'), caption, img.alt);
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeLightbox();
  });

  // Smooth in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(target) {
        ev.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        mobileMenu.classList.remove('open');
      }
    });
  });
})();