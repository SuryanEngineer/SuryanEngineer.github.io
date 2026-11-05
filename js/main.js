// ==========================================================================
// Portfolio interactivity: theme toggle, mobile nav, scroll reveal.
// No frameworks, no build step — plain JS for a plain static site.
// ==========================================================================

(function () {
  'use strict';

  /* ---------- Theme toggle (persisted, defaults to light) ----------
     The site always starts in light mode regardless of system preference
     (see style.css) — dark mode is opt-in only, via this toggle. */
  var root = document.documentElement;
  var STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* private browsing / storage blocked — theme just won't persist */
    }
  }

  applyTheme(getStoredTheme());

  function initThemeToggle() {
    var btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      // Light is always the implicit default (no data-theme attribute), so
      // "currently dark" only if the attribute explicitly says so.
      var currentlyDark = root.getAttribute('data-theme') === 'dark';
      var next = currentlyDark ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Contact modal (email / phone) ----------
     Clicking the email or phone tile in the Contact section opens a
     centered popup with that value, over a dimmed overlay. Clicking
     anywhere on the dimmed overlay (outside the popup box) closes it. */
  function initContactModal() {
    var overlay = document.querySelector('[data-contact-modal]');
    if (!overlay) return;

    var labelEl = overlay.querySelector('[data-contact-modal-label]');
    var valueEl = overlay.querySelector('[data-contact-modal-value]');
    var closeBtn = overlay.querySelector('[data-contact-modal-close]');
    var triggers = document.querySelectorAll('[data-contact-trigger]');

    function openModal(type, value) {
      labelEl.textContent = type === 'phone' ? 'Phone' : 'Email';
      valueEl.textContent = value;
      overlay.hidden = false;
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      overlay.hidden = true;
      document.body.classList.remove('modal-open');
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-contact-trigger'), btn.getAttribute('data-contact-value'));
      });
    });

    // Click anywhere on the gray overlay itself (not the popup box) closes it.
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeModal();
    });
  }

  /* ---------- Screenshot lightbox ----------
     Clicking a screenshot (an image wrapped in a link inside .screenshot)
     opens it enlarged over a darkened page instead of navigating away.
     Clicking the dark area, the close button, or pressing Escape closes it.
     Without JavaScript the link simply opens the image file. */
  function initLightbox() {
    var links = document.querySelectorAll('.screenshot a[href]');
    if (!links.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Enlarged screenshot');
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round">' +
        '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<figure class="lightbox-figure"><img alt="" />' +
      '<figcaption class="lightbox-caption"></figcaption></figure>';
    document.body.appendChild(overlay);

    var imgEl = overlay.querySelector('img');
    var capEl = overlay.querySelector('.lightbox-caption');
    var closeBtn = overlay.querySelector('.lightbox-close');
    var lastFocus = null;

    function open(link) {
      var thumb = link.querySelector('img');
      var holder = link.closest('.screenshot');
      var cap = holder && holder.nextElementSibling;
      imgEl.src = link.getAttribute('href');
      imgEl.alt = thumb ? thumb.alt : '';
      capEl.textContent = cap && cap.classList.contains('screenshot-caption') ? cap.textContent : '';
      capEl.hidden = !capEl.textContent;
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add('modal-open');
      closeBtn.focus();
    }

    function close() {
      overlay.hidden = true;
      imgEl.removeAttribute('src');
      document.body.classList.remove('modal-open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        open(link);
      });
    });

    // Clicking anywhere except the enlarged image itself closes it.
    overlay.addEventListener('click', function (e) {
      if (e.target !== imgEl) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
  }

  /* Load-in animation is handled entirely by CSS (see .reveal / .project-card
     in style.css) — no JS needed, so it can't fail silently. */

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Console message ----------
     A small, honest note for anyone technical enough to have opened
     devtools — doesn't run on anything, doesn't affect the page. */
  function logConsoleMessage() {
    try {
      console.log(
        '%cSuryan Engineer',
        'font-size:18px;font-weight:700;color:#0d7d72;'
      );
      console.log(
        '%cLooking under the hood, nice. Here\'s my email if you want to talk: ' +
        'suryanengineer1@gmail.com',
        'font-size:13px;color:#666;line-height:1.5;'
      );
    } catch (e) {
      /* console unavailable in some contexts — never let this break the page */
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMobileNav();
    initContactModal();
    initLightbox();
    initYear();
    logConsoleMessage();
  });
})();
