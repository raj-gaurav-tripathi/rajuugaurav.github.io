/* ==========================================================================
   UI BEHAVIOUR
   ==========================================================================
   Small, independent pieces of polish used across pages:
     - scroll-reveal (fade/rise elements marked [data-reveal] into view)
     - the floating back-to-top button
     - auto-updating footer year
     - picking one random quote from js/data/quotes.js on load

   Each init function checks that its target elements exist before doing
   anything, so this file is safe to call in full on every page even if a
   given page doesn't have all the pieces (e.g. blog.html has no quote
   strip).
   ========================================================================== */

(function () {
  'use strict';

  function initScrollReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    // Stagger siblings inside a [data-reveal-group] so cards/list items
    // cascade in slightly, rather than all fading in at once.
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      const children = group.querySelectorAll('[data-reveal]');
      children.forEach(function (child, i) {
        child.style.setProperty('--reveal-delay', String(i));
      });
    });

    if (!('IntersectionObserver' in window)) {
      // No IntersectionObserver support: just show everything immediately
      // rather than leaving content permanently invisible.
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (item) { observer.observe(item); });
  }

  function initBackToTop() {
    const wrap = document.getElementById('back-to-top-wrap');
    const btn = document.getElementById('back-to-top-btn');
    if (!wrap || !btn) return;

    function update() {
      wrap.classList.toggle('is-visible', window.scrollY > 600);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  /**
   * Picks ONE quote at random from window.SITE_QUOTES (defined in
   * js/data/quotes.js) and drops it into the quote strip. Deliberately
   * chosen once per page load rather than auto-cycling — a single
   * considered quote reads calmer than a rotating ticker.
   */
  function initRandomQuote() {
    const mount = document.getElementById('quote-mount');
    if (!mount || !window.SITE_QUOTES || !window.SITE_QUOTES.length) return;

    const quotes = window.SITE_QUOTES;
    const pick = quotes[Math.floor(Math.random() * quotes.length)];

    const blockquote = document.createElement('blockquote');
    blockquote.textContent = '\u201C' + pick.text + '\u201D';

    const cite = document.createElement('cite');
    cite.textContent = '\u2014 ' + pick.author;

    mount.appendChild(blockquote);
    mount.appendChild(cite);
  }

  window.initUI = function initUI() {
    initScrollReveal();
    initBackToTop();
    initFooterYear();
    initRandomQuote();
  };
})();
