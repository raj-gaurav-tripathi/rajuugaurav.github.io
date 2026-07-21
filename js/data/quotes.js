/* ==========================================================================
   QUOTES DATA
   ==========================================================================
   One of these is picked at random on each page load and shown in the
   quote strip between Research and Projects (see js/ui.js → initRandomQuote).

   All six have been checked against multiple independent, sourced
   references (original books/lectures where traceable) — a surprising
   number of "famous physicist quotes" online are actually misattributed,
   so if you add more, it's worth double-checking before publishing one.

   To add a quote: add another { text, author } object below.
   To remove one: delete its object. Nothing else needs to change.
   ========================================================================== */

window.SITE_QUOTES = [
  {
    text: 'Imagination is more important than knowledge.',
    author: 'Albert Einstein'
  },
  {
    text: 'The first principle is that you must not fool yourself.',
    author: 'Richard Feynman'
  },
  {
    text: 'Nothing in life is to be feared, it is only to be understood.',
    author: 'Marie Curie'
  },
  {
    text: 'The simple is the seal of the true.',
    author: 'Subrahmanyan Chandrasekhar'
  },
  {
    text: 'Spacetime tells matter how to move; matter tells spacetime how to curve.',
    author: 'John Archibald Wheeler'
  },
  {
    text: 'We are made of starstuff.',
    author: 'Carl Sagan'
  }
];
