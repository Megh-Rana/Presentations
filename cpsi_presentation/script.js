/* ============================================================
   CPI Presentation Controller
   Subject: HSUV201 - Creativity, Problem Solving and Innovation
   Topic: Open Source: Creativity at Scale
   Presenter: Megh Rana (25CE099)
   ============================================================ */

(function () {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;

  // UI Elements
  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const navHint = document.getElementById('navHint');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnOverview = document.getElementById('btnOverview');
  const overviewModal = document.getElementById('overviewModal');
  const btnCloseOverview = document.getElementById('btnCloseOverview');
  const overviewGrid = document.getElementById('overviewGrid');

  // Slide metadata for Overview Grid
  const slideTitles = [
    '01 · Title: CPI in the Real World',
    '02 · The Core Question: What is Open Source Really?',
    '03 · Creativity: Problem Finding & Empathy',
    '04 · Creativity: Divergent Thinking & Remix Culture',
    '05 · Creativity: Overcoming the Blank Canvas',
    '06 · Problem Solving: Root Causes vs Symptoms',
    '07 · Problem Solving: Decomposition & First Principles',
    '08 · Problem Solving: Iterative Loops & Peer Review',
    '09 · Innovation: Incremental vs Radical Breakthroughs',
    '10 · Innovation: Open Collaboration & Network Effects',
    '11 · Innovation: Real-World Human Impact & Scaling',
    '12 · The Contributor Playbook: Applying CPI',
    '13 · CPI Synthesis Matrix: Theory to Reality',
    '14 · Conclusion: The Problem Solver Mindset'
  ];

  // ── Floating Ambient Mesh Particles ────────────────────────
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'ambient-particles';
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '0';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const colors = ['var(--pine-blue)', 'var(--cotton-rose)', 'var(--pale-sky)', 'var(--smoky-rose)'];

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.position = 'absolute';
      p.style.borderRadius = '50%';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.opacity = (0.15 + Math.random() * 0.25).toString();

      const size = 1.5 + Math.random() * 3.5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = `0 0 ${size * 2}px ${p.style.background}`;

      // Floating animation
      p.animate([
        { transform: 'translateY(0px) translateX(0px)' },
        { transform: `translateY(${-40 - Math.random() * 80}px) translateX(${Math.random() * 40 - 20}px)` },
        { transform: 'translateY(0px) translateX(0px)' }
      ], {
        duration: 12000 + Math.random() * 14000,
        iterations: Infinity,
        easing: 'ease-in-out',
        delay: Math.random() * -15000
      });

      container.appendChild(p);
    }
  }

  // ── Overview Modal Generator ───────────────────────────────
  function buildOverviewGrid() {
    overviewGrid.innerHTML = '';
    slides.forEach((slide, index) => {
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${index === currentSlide ? 'current' : ''}`;

      const num = document.createElement('div');
      num.className = 'thumb-num';
      num.textContent = `SLIDE ${String(index + 1).padStart(2, '0')}`;

      const title = document.createElement('div');
      title.className = 'thumb-title';
      title.textContent = slideTitles[index] || `Slide ${index + 1}`;

      thumb.appendChild(num);
      thumb.appendChild(title);

      thumb.addEventListener('click', () => {
        closeOverview();
        goToSlide(index, index > currentSlide ? 'forward' : 'backward');
      });

      overviewGrid.appendChild(thumb);
    });
  }

  function openOverview() {
    buildOverviewGrid();
    overviewModal.classList.add('active');
  }

  function closeOverview() {
    overviewModal.classList.remove('active');
  }

  // ── UI State Update ────────────────────────────────────────
  function updateUI() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;
    slideCounter.innerHTML = `<span class="current-num">${String(currentSlide + 1).padStart(2, '0')}</span> / ${String(totalSlides).padStart(2, '0')}`;

    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1;

    if (currentSlide > 0 && navHint) {
      navHint.classList.add('hidden');
    }

    // URL Hash synchronization
    window.location.hash = `slide-${currentSlide + 1}`;
  }

  // ── Slide Navigation Mechanics ─────────────────────────────
  function goToSlide(index, direction) {
    if (isTransitioning || index < 0 || index >= totalSlides || index === currentSlide) return;
    isTransitioning = true;

    const currentEl = slides[currentSlide];
    const nextEl = slides[index];
    const forward = direction === 'forward';

    // Trigger animations in new slide
    const animItems = nextEl.querySelectorAll('.anim-item');
    animItems.forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // Reflow
      item.style.animation = '';
    });

    currentEl.classList.remove('active');
    currentEl.classList.add(forward ? 'exiting' : 'exiting-reverse');

    nextEl.classList.add('active', forward ? 'entering' : 'entering-reverse');

    currentSlide = index;
    updateUI();

    setTimeout(() => {
      currentEl.classList.remove('exiting', 'exiting-reverse');
      nextEl.classList.remove('entering', 'entering-reverse');
      isTransitioning = false;
    }, 450);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1, 'forward');
  }

  function prevSlide() {
    goToSlide(currentSlide - 1, 'backward');
  }

  // ── Fullscreen Toggle ──────────────────────────────────────
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // ── Keyboard Controls ──────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (overviewModal.classList.contains('active')) {
      if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        closeOverview();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'Backspace':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0, 'backward');
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1, 'forward');
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'o':
      case 'O':
        e.preventDefault();
        openOverview();
        break;
    }
  });

  // ── Touch Gesture Controls ─────────────────────────────────
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // ── Click Zone Navigation ──────────────────────────────────
  document.addEventListener('click', function (e) {
    if (e.target.closest('a, button, input, .overview-modal, .terminal-card, .cpsi-matrix')) return;

    const x = e.clientX;
    const w = window.innerWidth;
    if (x > w * 0.70) nextSlide();
    else if (x < w * 0.30) prevSlide();
  });

  // ── Event Listeners ────────────────────────────────────────
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnFullscreen.addEventListener('click', toggleFullscreen);
  btnOverview.addEventListener('click', openOverview);
  btnCloseOverview.addEventListener('click', closeOverview);

  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) closeOverview();
  });

  // ── Hash Init ──────────────────────────────────────────────
  if (window.location.hash) {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1;
      if (slideNum >= 0 && slideNum < totalSlides) {
        slides[0].classList.remove('active');
        slides[slideNum].classList.add('active');
        currentSlide = slideNum;
      }
    }
  }

  // ── Initialize ─────────────────────────────────────────────
  createParticles();
  updateUI();

  // Run initial entrance animation
  const firstSlideItems = slides[currentSlide].querySelectorAll('.anim-item');
  firstSlideItems.forEach(item => {
    item.style.animation = 'none';
    item.offsetHeight;
    item.style.animation = '';
  });

})();
