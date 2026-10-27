const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Replace desktop section padding (5.5rem -> 3.25rem)
indexHtml = indexHtml.replace(
  /@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{\s*padding-top:\s*5\.5rem\s*!important;\s*padding-bottom:\s*5\.5rem\s*!important;\s*\}\s*\}/g,
  `@media (min-width: 1024px) {
      section {
        padding-top: 3.25rem !important;
        padding-bottom: 3.25rem !important;
      }
    }`
);

// 2. Replace tablet section padding (4.5rem -> 2.75rem)
indexHtml = indexHtml.replace(
  /section\s*\{\s*padding-top:\s*4\.5rem\s*!important;\s*padding-bottom:\s*4\.5rem\s*!important;\s*\}/g,
  `section {
        padding-top: 2.75rem !important;
        padding-bottom: 2.75rem !important;
      }`
);

// 3. Replace mobile landscape section padding (3.5rem -> 2.25rem)
indexHtml = indexHtml.replace(
  /section\s*\{\s*padding-top:\s*3\.5rem\s*!important;\s*padding-bottom:\s*3\.5rem\s*!important;\s*\}/g,
  `section {
        padding-top: 2.25rem !important;
        padding-bottom: 2.25rem !important;
      }`
);

// 4. Replace mobile small section padding (2.75rem -> 1.75rem)
indexHtml = indexHtml.replace(
  /section\s*\{\s*padding-top:\s*2\.75rem\s*!important;\s*padding-bottom:\s*2\.75rem\s*!important;\s*\}/g,
  `section {
        padding-top: 1.75rem !important;
        padding-bottom: 1.75rem !important;
      }`
);

// 5. Add Hero section top padding and last section / footer top tuning
const rulesToAdd = `
    /* ========================================================================== */
    /* BALANCED SECTION MT / PT SPACING HARMONIZATION                             */
    /* ========================================================================== */
    #home-hero,
    .hero-section,
    [id*="hero"],
    main > section:first-of-type,
    body > section:first-of-type {
      padding-top: 1.25rem !important;
    }
    @media (min-width: 640px) {
      #home-hero,
      .hero-section,
      [id*="hero"],
      main > section:first-of-type,
      body > section:first-of-type {
        padding-top: 1.75rem !important;
      }
    }
    @media (min-width: 1024px) {
      #home-hero,
      .hero-section,
      [id*="hero"],
      main > section:first-of-type,
      body > section:first-of-type {
        padding-top: 2.25rem !important;
      }
    }

    section:last-of-type,
    #home-care-explore {
      padding-bottom: 1.75rem !important;
    }
    @media (min-width: 1024px) {
      section:last-of-type,
      #home-care-explore {
        padding-bottom: 2.25rem !important;
      }
    }

    footer,
    #mainFooter {
      padding-top: 1.25rem !important;
    }
    @media (min-width: 1024px) {
      footer,
      #mainFooter {
        padding-top: 1.75rem !important;
      }
    }
`;

// Insert before </style> in header
indexHtml = indexHtml.replace('  </style>\n</head>', `${rulesToAdd}\n  </style>\n</head>`);

// 6. Fix hero visual column card to stretch and align cleanly
indexHtml = indexHtml.replace(
  '<div class="relative rounded-[32px] p-3 sm:p-4 home-card-glass shadow-2xl overflow-hidden group tilt-card-home">',
  '<div class="relative rounded-[32px] p-3 sm:p-4 home-card-glass shadow-2xl overflow-hidden group tilt-card-home h-full flex flex-col justify-between">'
);
indexHtml = indexHtml.replace(
  '<div class="grid grid-cols-3 gap-2.5 pt-3.5 text-center">',
  '<div class="grid grid-cols-3 gap-2.5 pt-3.5 mt-auto text-center">'
);

// 7. Tune hero header margin-bottom from mb-8 sm:mb-10 to mb-6 sm:mb-8 to tighten up MT space
indexHtml = indexHtml.replace(
  'class="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-4"',
  'class="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-3.5"'
);

// 8. Tune quick category ribbon margin-top from mt-10 pt-8 to mt-6 pt-6
indexHtml = indexHtml.replace(
  '<div class="mt-10 pt-8 border-t border-slate-200/80 dark:border-white/10">',
  '<div class="mt-6 pt-6 border-t border-slate-200/80 dark:border-white/10">'
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated successfully!');
