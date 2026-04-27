/* ============================================================
   DAC Presentation — Navigation & Animation Controller
   ============================================================ */

(function () {
  'use strict';

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlide = 0;
  let isTransitioning = false;

  const progressFill = document.getElementById('progressFill');
  const slideCounter = document.getElementById('slideCounter');
  const navHint = document.getElementById('navHint');

  // ── Particles ──────────────────────────────────────────────
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = (15 + Math.random() * 15) + 's';
      p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
      container.appendChild(p);
    }
  }
  createParticles();

  // ── UI Updates ─────────────────────────────────────────────
  function updateUI() {
    progressFill.style.width = ((currentSlide + 1) / totalSlides * 100) + '%';
    slideCounter.textContent = (currentSlide + 1) + ' / ' + totalSlides;

    // Hide nav hint after first navigation
    if (currentSlide > 0) {
      navHint.classList.add('hidden');
    }
  }

  // ── Slide Transition ──────────────────────────────────────
  function goToSlide(index, direction) {
    if (isTransitioning || index < 0 || index >= totalSlides || index === currentSlide) return;
    isTransitioning = true;

    const currentEl = slides[currentSlide];
    const nextEl = slides[index];

    const forward = direction === 'forward';

    // Reset animations on next slide items
    const animItems = nextEl.querySelectorAll('.anim-item');
    animItems.forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // force reflow
      item.style.animation = '';
    });

    // Reset SVG draw animations
    const svgPaths = nextEl.querySelectorAll('.staircase-path, .wave-path');
    svgPaths.forEach(path => {
      path.style.animation = 'none';
      path.offsetHeight;
      path.style.animation = '';
    });

    // Exit current
    currentEl.classList.remove('active');
    currentEl.classList.add(forward ? 'exiting' : 'exiting-reverse');

    // Enter next
    nextEl.classList.add('active', forward ? 'entering' : 'entering-reverse');

    currentSlide = index;
    updateUI();

    // Clean up after transition
    setTimeout(() => {
      currentEl.classList.remove('exiting', 'exiting-reverse');
      nextEl.classList.remove('entering', 'entering-reverse');
      isTransitioning = false;
    }, 600);
  }

  function nextSlide() {
    goToSlide(currentSlide + 1, 'forward');
  }

  function prevSlide() {
    goToSlide(currentSlide - 1, 'backward');
  }

  // ── Keyboard Navigation ────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'Backspace':
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

  // ── Click navigation (click right half = next, left half = prev) ──
  document.addEventListener('click', function (e) {
    // Don't navigate on link/button clicks
    if (e.target.closest('a, button')) return;

    const x = e.clientX;
    const w = window.innerWidth;
    if (x > w * 0.6) nextSlide();
    else if (x < w * 0.4) prevSlide();
  });

  // ── Initialize ─────────────────────────────────────────────
  updateUI();

  // Trigger initial slide animations
  const firstSlideItems = slides[0].querySelectorAll('.anim-item');
  firstSlideItems.forEach(item => {
    item.style.animation = 'none';
    item.offsetHeight;
    item.style.animation = '';
  });

})();
