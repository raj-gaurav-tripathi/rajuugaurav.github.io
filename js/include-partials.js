/* ==========================================================================
   INCLUDE PARTIALS
   ==========================================================================
   The navigation bar and footer live in ONE place each — partials/nav.html
   and partials/footer.html — and every page pulls them in at load time via
   fetch(), instead of copy-pasting the same markup into every HTML file.
   That way, editing the nav once (say, adding a new section) updates it
   everywhere automatically.

   WHY THIS NEEDS A LOCAL SERVER
   fetch() cannot load local files over the file:// protocol (browsers block
   it for security). That means double-clicking index.html won't show the
   nav. Run a tiny local server instead — see the README — or just push to
   GitHub Pages, which serves everything over https:// and works fine.

   HANDLING DIFFERENT FOLDER DEPTHS
   index.html and blog.html live at the project root; blog posts live one
   level down in /posts/. A link written as "blog.html" only works from the
   root — from /posts/ it needs to be "../blog.html". Rather than write two
   versions of nav.html, links inside the partials use a placeholder
   attribute instead of a real href:

       <a data-root-href="blog.html">Blog</a>

   Each page declares how deep it is BEFORE loading this script:

       <script>window.SITE_ROOT = "";</script>       <!-- root pages -->
       <script>window.SITE_ROOT = "../";</script>     <!-- pages in /posts/ -->

   and resolveRootLinks() below prepends that prefix to every
   data-root-href/data-root-src it finds, once the partial has been
   injected. External links (http/https/mailto) and pure anchors (#foo) are
   left as normal href attributes and need no prefixing.
   ========================================================================== */

(function () {
  'use strict';

  /**
   * Fetches an HTML partial and injects it into the first element matching
   * [data-include="<path>"]. Resolves once the injected content is in the
   * DOM (but not yet re-initialised — the caller does that).
   */
  async function loadPartial(path) {
    const host = document.querySelector('[data-include="' + path + '"]');
    if (!host) return;

    try {
      const root = window.SITE_ROOT || '';
      const response = await fetch(root + path);
      if (!response.ok) throw new Error('Failed to fetch ' + path + ': ' + response.status);
      host.innerHTML = await response.text();
      resolveRootLinks(host);
    } catch (err) {
      // Fail quietly in the UI (don't break the rest of the page) but log
      // for whoever's debugging — most likely cause is opening the file
      // directly instead of via a local server.
      console.error('[include-partials]', err.message || err);
    }
  }

  /** Rewrites data-root-href / data-root-src into real href / src values. */
  function resolveRootLinks(container) {
    const root = window.SITE_ROOT || '';

    container.querySelectorAll('[data-root-href]').forEach(function (el) {
      el.setAttribute('href', root + el.getAttribute('data-root-href'));
    });

    container.querySelectorAll('[data-root-src]').forEach(function (el) {
      el.setAttribute('src', root + el.getAttribute('data-root-src'));
    });
  }

  /**
   * Loads nav + footer together and returns a promise that resolves when
   * both are in the DOM. Exposed on window so each page's entry script
   * (main.js / blog-main.js / a post's inline script) can wait on it
   * before running nav/UI initialisation.
   */
  window.loadSiteChrome = function loadSiteChrome() {
    return Promise.all([
      loadPartial('partials/nav.html'),
      loadPartial('partials/footer.html')
    ]);
  };
})();
