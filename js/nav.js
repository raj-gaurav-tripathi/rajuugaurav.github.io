/* ==========================================================================
   NAV BEHAVIOUR
   ==========================================================================
   Everything the navigation bar needs to do once it's on the page: the
   mobile hamburger menu, a subtle shadow once you've scrolled past the top,
   and highlighting whichever section is currently in view.

   IMPORTANT: this must run AFTER partials/nav.html has been injected by
   include-partials.js, since #nav-toggle etc. don't exist before that.
   That's why initNav() is exported on window and called from main.js /
   blog-main.js inside the loadSiteChrome().then(...) chain, rather than
   just running on DOMContentLoaded here.

   Smooth scrolling for the nav's anchor links is handled by plain CSS
   (`scroll-behavior: smooth` in base.css) — no JS needed for that part.
   ========================================================================== */

(function () {
  'use strict';

  function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-mobile');
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    function openMenu() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', function () {
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Tapping any link inside the mobile menu should close it, otherwise
    // it stays open behind whatever section it jumped to.
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function initScrollShadow() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    function update() {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /**
   * Marks the nav link for whichever section is currently centred in the
   * viewport with .is-active. Only sections that actually exist on the
   * current page are observed, so this is a no-op (harmlessly) on pages
   * like blog.html that don't have #research, #projects, etc.
   */
  function initActiveLinkTracking() {
    const navLinks = document.querySelectorAll(
      '.site-nav__links a[data-root-href], .site-nav__mobile a[data-root-href]'
    );
    const sectionIds = ['about', 'research', 'projects', 'publications', 'contact'];
    const sections = sectionIds.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          const href = link.getAttribute('data-root-href') || '';
          link.classList.toggle('is-active', href.endsWith('#' + id));
        });
      });
    }, {
      // Treat a section as "current" once it occupies the middle band of
      // the viewport, rather than the instant it first appears at the
      // bottom edge.
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  window.initNav = function initNav() {
    initMobileMenu();
    initScrollShadow();
    initActiveLinkTracking();
  };
})();
