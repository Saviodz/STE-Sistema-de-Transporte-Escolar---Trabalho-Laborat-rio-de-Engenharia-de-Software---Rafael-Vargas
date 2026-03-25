/* ============================================
   SLIDE ENGINE — Navigation & Controls
   Fundamentos do Sequelize (Slide Presentations)
   ============================================ */

(function () {
  'use strict';

  let currentSlide = 0;
  let slides = [];
  let totalSlides = 0;
  const THEME_STORAGE_KEY = 'slides-theme';

  // DOM refs
  let progressBar, counterEl, prevBtn, nextBtn, helpModal, themeToggleBtn;

  // ---- Init ----
  function init() {
    slides = Array.from(document.querySelectorAll('.slide'));
    totalSlides = slides.length;
    initTheme();

    // Create UI elements
    createProgressBar();
    createHeader();
    createNavArrows();
    createHelpModal();

    // Read initial slide from hash
    const hash = window.location.hash;
    if (hash && hash.startsWith('#slide-')) {
      const num = parseInt(hash.replace('#slide-', ''), 10);
      if (num >= 1 && num <= totalSlides) {
        currentSlide = num - 1;
      }
    }

    // Show initial slide
    goToSlide(currentSlide, false);

    // Keyboard
    document.addEventListener('keydown', handleKeydown);

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });

    // Hash change
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#slide-')) {
        const num = parseInt(hash.replace('#slide-', ''), 10);
        if (num >= 1 && num <= totalSlides && num - 1 !== currentSlide) {
          goToSlide(num - 1, true);
        }
      }
    });
  }

  // ---- Create Progress Bar ----
  function createProgressBar() {
    progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.prepend(progressBar);
  }

  // ---- Create Header ----
  function createHeader() {
    const header = document.createElement('div');
    header.className = 'slide-header';

    const titleEl = document.querySelector('title');
    const titleText = titleEl ? titleEl.textContent : 'Slide Presentation';

    header.innerHTML = `
      <div class="title">
        <span class="icon">📘</span>
        <span>${titleText}</span>
      </div>
      <div class="counter">
        <span class="header-controls">
          <span class="help-hint">Pressione <kbd>?</kbd> para atalhos</span>
          <button class="theme-toggle" type="button" aria-label="Alternar tema"></button>
        </span>
        <span><span class="current-num">${currentSlide + 1}</span> / ${totalSlides}</span>
      </div>
    `;
    document.body.prepend(header);

    themeToggleBtn = header.querySelector('.theme-toggle');
    themeToggleBtn.addEventListener('click', toggleTheme);
    counterEl = header.querySelector('.counter span:last-child');
    updateThemeToggle();
  }

  // ---- Create Nav Arrows ----
  function createNavArrows() {
    prevBtn = document.createElement('button');
    prevBtn.className = 'nav-arrow prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Slide anterior');
    prevBtn.addEventListener('click', prevSlide);

    nextBtn = document.createElement('button');
    nextBtn.className = 'nav-arrow next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Próximo slide');
    nextBtn.addEventListener('click', nextSlide);

    document.body.append(prevBtn, nextBtn);
  }

  // ---- Create Help Modal ----
  function createHelpModal() {
    helpModal = document.createElement('div');
    helpModal.className = 'help-modal';
    helpModal.innerHTML = `
      <div class="modal-content">
        <h3>⌨️ Atalhos de Teclado</h3>
        <div class="shortcut"><span>Próximo slide</span> <span><kbd>→</kbd> <kbd>Space</kbd> <kbd>Enter</kbd></span></div>
        <div class="shortcut"><span>Slide anterior</span> <span><kbd>←</kbd> <kbd>Backspace</kbd></span></div>
        <div class="shortcut"><span>Primeiro slide</span> <span><kbd>Home</kbd></span></div>
        <div class="shortcut"><span>Último slide</span> <span><kbd>End</kbd></span></div>
        <div class="shortcut"><span>Tema claro/escuro</span> <span><kbd>T</kbd></span></div>
        <div class="shortcut"><span>Ajuda</span> <span><kbd>?</kbd></span></div>
        <div class="shortcut"><span>Fechar</span> <span><kbd>Esc</kbd></span></div>
      </div>
    `;
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) toggleHelp();
    });
    document.body.append(helpModal);
  }

  // ---- Navigation ----
  function goToSlide(index, animate) {
    if (index < 0 || index >= totalSlides) return;

    const direction = index > currentSlide ? 1 : -1;

    // Hide current
    if (animate !== false && slides[currentSlide]) {
      slides[currentSlide].classList.remove('active');
      if (direction > 0) {
        slides[currentSlide].classList.add('exit-left');
      }
      setTimeout(() => {
        slides[currentSlide === index ? currentSlide : (index - direction)];
        // Clean up exit classes
        slides.forEach(s => s.classList.remove('exit-left'));
      }, 400);
    } else {
      slides.forEach(s => {
        s.classList.remove('active', 'exit-left');
      });
    }

    currentSlide = index;

    // Show target
    requestAnimationFrame(() => {
      slides[currentSlide].classList.add('active');
      slides[currentSlide].scrollTop = 0;
    });

    // Update UI
    updateProgress();
    updateCounter();
    updateNavButtons();
    updateHash();
  }

  function nextSlide() {
    syncCurrentSlide();
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1, true);
  }

  function prevSlide() {
    syncCurrentSlide();
    if (currentSlide > 0) goToSlide(currentSlide - 1, true);
  }

  function syncCurrentSlide() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#slide-')) {
      const num = parseInt(hash.replace('#slide-', ''), 10);
      if (num >= 1 && num <= totalSlides) {
        currentSlide = num - 1;
        return;
      }
    }
    const activeIndex = slides.findIndex(slide => slide.classList.contains('active'));
    if (activeIndex >= 0) {
      currentSlide = activeIndex;
    }
  }

  // ---- Update UI ----
  function updateProgress() {
    const pct = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = pct + '%';
  }

  function updateCounter() {
    if (counterEl) {
      counterEl.innerHTML = `<span class="current-num">${currentSlide + 1}</span> / ${totalSlides}`;
    }
  }

  function updateNavButtons() {
    prevBtn.classList.toggle('disabled', currentSlide === 0);
    nextBtn.classList.toggle('disabled', currentSlide === totalSlides - 1);
  }

  function updateHash() {
    history.replaceState(null, '', '#slide-' + (currentSlide + 1));
  }

  // ---- Help ----
  function toggleHelp() {
    helpModal.classList.toggle('visible');
  }

  function initTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (_) {}
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggle();
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (_) {}
  }

  function updateThemeToggle() {
    if (!themeToggleBtn) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    themeToggleBtn.textContent = isLight ? '🌙 Escuro' : '☀️ Claro';
    themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
  }

  // ---- Keyboard Handler ----
  function handleKeydown(e) {
    // If help modal is open, Escape closes it
    if (helpModal.classList.contains('visible')) {
      if (e.key === 'Escape' || e.key === '?') {
        toggleHelp();
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'Enter':
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
        goToSlide(0, true);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1, true);
        break;
      case '?':
        e.preventDefault();
        toggleHelp();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        toggleTheme();
        break;
      case 'Escape':
        e.preventDefault();
        break;
    }
  }

  // ---- Start ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
