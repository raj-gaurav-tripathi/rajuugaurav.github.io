/* ==========================================================================
   BLOG POSTS DATA
   ==========================================================================
   The list shown on blog.html. This is only the INDEX — each entry points
   to a real HTML page under /posts/ that holds the actual post content.

   TO ADD A NEW POST:
   1. Copy posts/sample-post.html to posts/your-post-slug.html and edit it.
   2. Add an entry here pointing at it, newest first.
   That's it — the card on blog.html is generated from this array by
   js/render.js, so you don't need to hand-write any HTML for the listing.

   TEMPLATE (copy this shape):
   {
     title: 'Post title',
     excerpt: 'One or two sentences that tease the post on the listing page.',
     date: '2026-07-21',        // ISO date, used for sorting + the <time> tag
     dateLabel: 'July 21, 2026', // however you want the date displayed
     tags: ['Cosmology'],
     url: 'posts/your-post-slug.html',
     image: 'assets/images/blog/placeholder-post.svg'
   }
   ========================================================================== */

window.SITE_BLOG_POSTS = [
  {
    title: 'Where Do Cosmic Magnetic Fields Come From?',
    excerpt:
      'Magnetic fields are everywhere in the universe, from planets to galaxy clusters — but their origin in the early universe is still an open question. A short, non-technical starting point for what "magnetogenesis" actually means.',
    date: '2026-07-21',
    dateLabel: 'July 21, 2026',
    tags: ['Cosmology', 'Magnetogenesis'],
    url: 'posts/sample-post.html',
    image: 'assets/images/blog/placeholder-post.svg'
  }

  /* This is a sample post — feel free to edit it into your own first entry,
     or delete both the file and this object and start fresh. */
];
