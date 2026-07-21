/* ==========================================================================
   MAIN — entry point for index.html
   ==========================================================================
   Order matters here:
     1. Render data-driven sections (Projects/Publications/Blog teaser) and
        start the hero animation immediately — none of this needs the
        nav/footer partials to be loaded first.
     2. Load the shared nav + footer (partials/*.html).
     3. Only once those are actually in the DOM: initialise nav behaviour
        and the rest of the UI polish (scroll-reveal, back-to-top, quote,
        footer year) — initUI() needs #footer-year from the footer partial,
        and needs step 1's cards to already exist so it can observe them.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  if (window.renderProjects) window.renderProjects();
  if (window.renderPublications) window.renderPublications();
  if (window.renderBlogTeaser) window.renderBlogTeaser(3);
  if (window.initStarfield) window.initStarfield();

  if (window.loadSiteChrome) {
    window.loadSiteChrome().then(function () {
      if (window.initNav) window.initNav();
      if (window.initUI) window.initUI();
    });
  }
});
