/* ==========================================================================
   PUBLICATIONS DATA
   ==========================================================================
   Empty for now — js/render.js shows a "coming soon" empty state on the
   homepage whenever this array has nothing in it, and switches to a list of
   citation-style entries automatically the moment you add one. Nothing else
   needs to change when you do.

   TO ADD A PUBLICATION: add an object shaped like this to SITE_PUBLICATIONS:
   {
     title: 'Paper title',
     authors: 'Your Name, Coauthor Name',
     venue: 'Journal / conference / arXiv',
     year: '2027',
     links: [
       { label: 'arXiv', url: '#' },
       { label: 'DOI', url: '#' }
     ]
   }
   ========================================================================== */

window.SITE_PUBLICATIONS = [];
