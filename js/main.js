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
        '%cLooking under the hood — nice. Here\'s my email if you want to talk: ' +
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
    initYear();
    logConsoleMessage();
  });
})();
