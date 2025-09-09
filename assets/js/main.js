(function(){
      const body = document.body;
      const themeToggle = document.getElementById('themeToggle');
      const menuToggle = document.getElementById('menuToggle');
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
        nav.classList.toggle('open');
      });

      // Year
      document.getElementById('year').textContent = new Date().getFullYear();

      // Simulator logic
      const range = document.getElementById('apertureRange');
      const fstopValue = document.getElementById('fstopValue');
      const simImage = document.getElementById('simImage');

      // Map aperture value to CSS blur and brightness to approximate DOF+exposure
      function updateSim(v) {
        // round to one decimal but display common stops nicer
        const rounded = Math.round(v * 10) / 10;
        fstopValue.textContent = 'f/' + (rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1));

        // Larger aperture = smaller f-number: simulate shallower DOF by increasing blur on background
        // We'll approximate: blur px = map(1.4..22 -> 12..0)
        const blur = Math.max(0, (22 - v) / (22 - 1.4) * 12);
        // exposure compensation: wider aperture brighter; map to brightness
        const brightness = 1 + ((2.8 - v) / (22 - 1.4)) * 0.9; // modest change

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

      // keyboard and close
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
            if(nav.classList.contains('open')) nav.classList.remove('open'); // close mobile menu
          }
        });
      });

    })();
