/* ==========================================================================
   BLOG-MAIN — entry point for blog.html
   ==========================================================================
   Same pattern as main.js, minus the pieces index.html-only has (starfield,
   projects, publications). See main.js for why the ordering matters.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  if (window.renderBlogList) window.renderBlogList();

  if (window.loadSiteChrome) {
    window.loadSiteChrome().then(function () {
      if (window.initNav) window.initNav();
      if (window.initUI) window.initUI();
    });
  }
});
