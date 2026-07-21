/* ==========================================================================
   PROJECTS DATA
   ==========================================================================
   Everything shown in the Projects grid lives in this one array — js/render.js
   turns each object into a card, and builds the filter pills automatically
   from whichever "category" values are actually in use (so a new category
   just appears once you use it — nothing else to wire up).

   TO ADD A NEW PROJECT: copy the TEMPLATE object below, fill it in, and add
   it to the SITE_PROJECTS array. Order in the array = display order.

   TEMPLATE (copy this shape):
   {
     title: 'Project title',
     category: 'notes',              // short machine key, e.g. notes / data-analysis / internship / research
     categoryLabel: 'Typed Notes',   // human-readable label shown on the card + filter pill
     date: '2026',                   // whatever granularity you want: a year, a season, a range
     description: 'One or two sentences on what it is and what you used.',
     tags: ['Tag One', 'Tag Two'],
     image: 'assets/images/projects/placeholder-notes.svg', // swap for a real thumbnail any time
     link: '#',                      // link to a PDF, repo, notebook, write-up…
     linkLabel: 'View notes'
   }
   ========================================================================== */

window.SITE_PROJECTS = [
  {
    title: 'Typed Notes: Magnetogenesis from Axion-like Particles',
    category: 'notes',
    categoryLabel: 'Typed Notes',
    date: '2025 – Present',
    description:
      'Comprehensive LaTeX notes working through gauge-kinetic coupling and tachyonic resonance across the Brandenberger-group paper series on ultralight dark matter and magnetogenesis, with every derivation step shown in full.',
    tags: ['LaTeX', 'Magnetogenesis', 'Gauge-Kinetic Coupling'],
    image: 'assets/images/projects/placeholder-notes.svg',
    link: '#',
    linkLabel: 'View notes'
  },
  {
    title: 'Geomagnetic Storm Analysis with NASA OMNI Data',
    category: 'data-analysis',
    categoryLabel: 'Data Analysis',
    date: 'Space Astronomy (SS4202)',
    description:
      'Analyzed geomagnetic storm dynamics using NASA OMNI data and the Burton equation, for coursework under Dr. Dibyendu Nandi.',
    tags: ['Python', 'NASA OMNI', 'Burton Equation'],
    image: 'assets/images/projects/placeholder-data.svg',
    link: '#',
    linkLabel: 'View write-up'
  },
  {
    title: 'Light Curve Analysis of Kepler/TESS Sources',
    category: 'data-analysis',
    categoryLabel: 'Data Analysis',
    date: 'Space Astronomy (SS4202)',
    description:
      'Applied Lomb-Scargle periodograms and STFT spectrogram analysis to Kepler/TESS light curves using the lightkurve package to identify periodic signals.',
    tags: ['Python', 'astropy', 'lightkurve'],
    image: 'assets/images/projects/placeholder-data.svg',
    link: '#',
    linkLabel: 'View notebook'
  }

  /* Add your summer internship, coursework, and other projects here using
     the TEMPLATE above — e.g. set category: 'internship' and it will get
     its own filter pill automatically. */
];
