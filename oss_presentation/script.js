/* ============================================================
   Open Source & Linux Presentation — Navigation & Controller
   Author: Megh Rana
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

  // Slide titles list for overview
  const slideTitles = [
    '00 · Title Hero',
    '01 · Question: Linux Desktop?',
    '02 · The Desktop Paradox',
    '03 · Why Linux?',
    '04 · My Origin Story',
    '05 · The Pivot to Open Source',
    '06 · Question: What is AOSP?',
    '07 · The AOSP Rabbit Hole',
    '08 · Case Study: Linutil Fix',
    '09 · Quality vs AI Slop',
    '10 · My Open Source Contributions',
    '11 · 4-Step Problem Solving',
    '12 · Call to Action & Conclusion'
  ];

  // ── Floating Matrix/Code Particles ──────────────────────────
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    const symbols = ['$', '>', '#', 'git', '{}', '&&', '||', '0', '1', 'pull', 'diff'];

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 18 + 's';
      p.style.animationDuration = (14 + Math.random() * 14) + 's';
      
      const size = 2 + Math.random() * 3;
      p.style.width = p.style.height = size + 'px';
      
      if (Math.random() > 0.6) {
        p.style.background = 'var(--cyan)';
      } else if (Math.random() > 0.8) {
        p.style.background = 'var(--violet)';
      }
      
      container.appendChild(p);
    }
  }
  createParticles();

  // ── Build Overview Grid ────────────────────────────────────
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

  // ── UI Updates ─────────────────────────────────────────────
  function updateUI() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

    btnPrev.disabled = currentSlide === 0;
    btnNext.disabled = currentSlide === totalSlides - 1;

    // Hide navigation hint after slide 1
    if (currentSlide > 0) {
      navHint.classList.add('hidden');
    }

    // Sync URL hash
    window.location.hash = `slide-${currentSlide + 1}`;
  }

  // ── Slide Transitions ──────────────────────────────────────
  function goToSlide(index, direction) {
    if (isTransitioning || index < 0 || index >= totalSlides || index === currentSlide) return;
    isTransitioning = true;

    const currentEl = slides[currentSlide];
    const nextEl = slides[index];
    const forward = direction === 'forward';

    // Reset animations in target slide
    const animItems = nextEl.querySelectorAll('.anim-item');
    animItems.forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // Force reflow
      item.style.animation = '';
    });

    // Exit active
    currentEl.classList.remove('active');
    currentEl.classList.add(forward ? 'exiting' : 'exiting-reverse');

    // Enter next
    nextEl.classList.add('active', forward ? 'entering' : 'entering-reverse');

    currentSlide = index;
    updateUI();

    setTimeout(() => {
      currentEl.classList.remove('exiting', 'exiting-reverse');
      nextEl.classList.remove('entering', 'entering-reverse');
      isTransitioning = false;
    }, 550);
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

  // ── Keyboard Navigation ────────────────────────────────────
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

  // ── Touch Navigation ──────────────────────────────────────
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
    if (e.target.closest('a, button, input, .overview-modal, .terminal-box')) return;

    const x = e.clientX;
    const w = window.innerWidth;
    if (x > w * 0.65) nextSlide();
    else if (x < w * 0.35) prevSlide();
  });

  // ── Event Listeners for UI Buttons ─────────────────────────
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnFullscreen.addEventListener('click', toggleFullscreen);
  btnOverview.addEventListener('click', openOverview);
  btnCloseOverview.addEventListener('click', closeOverview);

  // Close overview when clicking outside content
  overviewModal.addEventListener('click', (e) => {
    if (e.target === overviewModal) closeOverview();
  });

  // ── Handle Initial Hash Navigation ─────────────────────────
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

  // ── Initial Animation Trigger ──────────────────────────────
  updateUI();
  const firstSlideItems = slides[currentSlide].querySelectorAll('.anim-item');
  firstSlideItems.forEach(item => {
    item.style.animation = 'none';
    item.offsetHeight;
    item.style.animation = '';
  });

})();
