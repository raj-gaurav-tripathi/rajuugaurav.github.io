/* ==========================================================================
   RENDER
   ==========================================================================
   Turns the data in js/data/*.js into actual HTML on the page. This keeps
   index.html and blog.html free of repeated, hand-written card markup —
   edit the DATA files to change content, edit THIS file only if you want
   to change how a card looks.

   Call order matters: these render functions must run BEFORE
   js/ui.js → initScrollReveal(), so the scroll-reveal system sees the
   freshly-inserted [data-reveal] cards. main.js / blog-main.js handle that
   ordering — render first, then initUI().
   ========================================================================== */

(function () {
  'use strict';

  const ICON_ARROW =
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderTags(tags) {
    return (tags || [])
      .map(function (t) { return '<span class="tag">' + t + '</span>'; })
      .join('');
  }

  /* --- Projects ---------------------------------------------------------- */

  function projectCardHTML(project) {
    return (
      '<article class="card" data-reveal>' +
        '<div class="card__media"><img src="' + project.image + '" alt="" loading="lazy"></div>' +
        '<div class="card__body">' +
          '<span class="card__meta">' + project.categoryLabel + ' \u00B7 ' + project.date + '</span>' +
          '<h3 class="card__title">' + project.title + '</h3>' +
          '<p class="card__desc">' + project.description + '</p>' +
          '<div class="tag-row">' + renderTags(project.tags) + '</div>' +
          '<div class="card__footer">' +
            '<a class="card__link" href="' + project.link + '">' + project.linkLabel + ' ' + ICON_ARROW + '</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /**
   * Renders the Projects grid and builds filter pills from whichever
   * categories are actually present in the data — no fixed list to keep in
   * sync by hand.
   */
  function renderProjects() {
    const grid = document.getElementById('projects-grid');
    const filterWrap = document.getElementById('projects-filters');
    if (!grid || !window.SITE_PROJECTS) return;

    const projects = window.SITE_PROJECTS;
    let activeFilter = 'all';

    const categories = [];
    projects.forEach(function (p) {
      const known = categories.some(function (c) { return c.key === p.category; });
      if (!known) categories.push({ key: p.category, label: p.categoryLabel });
    });

    function draw() {
      const visible = activeFilter === 'all'
        ? projects
        : projects.filter(function (p) { return p.category === activeFilter; });

      grid.innerHTML = visible.length
        ? visible.map(projectCardHTML).join('')
        : '<p class="card__desc">No projects in this category yet.</p>';
    }

    if (filterWrap && categories.length > 1) {
      const pills = [{ key: 'all', label: 'All' }].concat(categories);
      filterWrap.innerHTML = pills.map(function (c) {
        return '<button class="filter-pill' + (c.key === 'all' ? ' is-active' : '') +
               '" data-filter="' + c.key + '" type="button">' + c.label + '</button>';
      }).join('');

      filterWrap.querySelectorAll('.filter-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeFilter = btn.getAttribute('data-filter');
          filterWrap.querySelectorAll('.filter-pill').forEach(function (b) {
            b.classList.toggle('is-active', b === btn);
          });
          draw();
        });
      });
    } else if (filterWrap) {
      // Only one category so far — filtering would be pointless, hide it.
      filterWrap.style.display = 'none';
    }

    draw();
  }

  /* --- Publications ------------------------------------------------------- */

  function renderPublications() {
    const list = document.getElementById('publications-list');
    if (!list || !window.SITE_PUBLICATIONS || !window.SITE_PUBLICATIONS.length) {
      return; // the static "coming soon" empty state already in the HTML stays as-is
    }

    list.innerHTML = window.SITE_PUBLICATIONS.map(function (pub) {
      const links = (pub.links || [])
        .map(function (l) { return '<a href="' + l.url + '">' + l.label + '</a>'; })
        .join('');
      return (
        '<div class="pub-item" data-reveal>' +
          '<h3 class="pub-item__title">' + pub.title + '</h3>' +
          '<p class="pub-item__meta">' + pub.authors + ' \u2014 ' + pub.venue + ', ' + pub.year + '</p>' +
          '<div class="pub-item__links">' + links + '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* --- Blog ---------------------------------------------------------------- */

  function blogCardHTML(post) {
    return (
      '<article class="card" data-reveal>' +
        '<div class="card__media"><img src="' + post.image + '" alt="" loading="lazy"></div>' +
        '<div class="card__body">' +
          '<span class="card__meta"><time datetime="' + post.date + '">' + post.dateLabel + '</time></span>' +
          '<h3 class="card__title">' + post.title + '</h3>' +
          '<p class="card__desc">' + post.excerpt + '</p>' +
          '<div class="card__footer">' +
            '<a class="card__link" href="' + post.url + '">Read post ' + ICON_ARROW + '</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function sortedPosts() {
    return (window.SITE_BLOG_POSTS || []).slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  /** Full listing, used on blog.html */
  function renderBlogList() {
    const list = document.getElementById('blog-list');
    if (!list) return;
    const posts = sortedPosts();
    if (!posts.length) return; // static empty state stays
    list.innerHTML = posts.map(blogCardHTML).join('');
  }

  /** Homepage teaser — just the most recent few, reusing the same cards */
  function renderBlogTeaser(limit) {
    const grid = document.getElementById('blog-teaser-grid');
    if (!grid) return;
    const posts = sortedPosts().slice(0, limit || 3);
    if (!posts.length) return; // static empty state stays
    grid.innerHTML = posts.map(blogCardHTML).join('');
  }

  window.renderProjects = renderProjects;
  window.renderPublications = renderPublications;
  window.renderBlogList = renderBlogList;
  window.renderBlogTeaser = renderBlogTeaser;
})();
