const fs = require('fs');

const pages = [
  'about.html',
  'collections.html',
  'contact.html',
  'craftmanship.html',
  'custom-rugs.html',
  'home-2.html',
  'inspiration.html',
  'navbar.html',
  'products.html',
  'rug-guide.html',
  'showroom.html',
  '404.html'
];

const harmonyRules = `
    /* ========================================================================== */
    /* HERO, SECTION MT & FOOTER VERTICAL HARMONY (ZERO DEAD GAPS)                */
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
        padding-top: 1.5rem !important;
      }
    }
    @media (min-width: 1024px) {
      #home-hero,
      .hero-section,
      [id*="hero"],
      main > section:first-of-type,
      body > section:first-of-type {
        padding-top: 2rem !important;
      }
    }

    section:last-of-type {
      padding-bottom: 1.5rem !important;
    }
    @media (min-width: 1024px) {
      section:last-of-type {
        padding-bottom: 1.75rem !important;
      }
    }

    footer,
    #mainFooter {
      padding-top: 1rem !important;
    }
    @media (min-width: 1024px) {
      footer,
      #mainFooter {
        padding-top: 1.25rem !important;
      }
    }
`;

for (const file of pages) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace desktop section padding (5.5rem -> 3.25rem)
  content = content.replace(
    /@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{\s*padding-top:\s*5\.5rem\s*!important;\s*padding-bottom:\s*5\.5rem\s*!important;\s*\}\s*\}/g,
    `@media (min-width: 1024px) {
      section {
        padding-top: 3.25rem !important;
        padding-bottom: 3.25rem !important;
      }
    }`
  );

  // Replace tablet section padding (4.5rem -> 2.75rem)
  content = content.replace(
    /section\s*\{\s*padding-top:\s*4\.5rem\s*!important;\s*padding-bottom:\s*4\.5rem\s*!important;\s*\}/g,
    `section {
        padding-top: 2.75rem !important;
        padding-bottom: 2.75rem !important;
      }`
  );

  // Replace mobile landscape section padding (3.5rem -> 2.25rem)
  content = content.replace(
    /section\s*\{\s*padding-top:\s*3\.5rem\s*!important;\s*padding-bottom:\s*3\.5rem\s*!important;\s*\}/g,
    `section {
        padding-top: 2.25rem !important;
        padding-bottom: 2.25rem !important;
      }`
  );

  // Replace mobile small section padding (2.75rem -> 1.75rem)
  content = content.replace(
    /section\s*\{\s*padding-top:\s*2\.75rem\s*!important;\s*padding-bottom:\s*2\.75rem\s*!important;\s*\}/g,
    `section {
        padding-top: 1.75rem !important;
        padding-bottom: 1.75rem !important;
      }`
  );

  // Insert harmony rules if not already present
  if (!content.includes('HERO, SECTION MT & FOOTER VERTICAL HARMONY')) {
    // Insert right after @media (min-width: 1024px) { ... }
    content = content.replace(
      /(@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{[\s\S]*?\}\s*\})/,
      `$1\n${harmonyRules}`
    );
  }

  // Update footer padding
  content = content.replace(
    /class="([^"]*mainFooter[^"]*|\s*footer-card[^"]*|[^"]*max-w-\[1720px\][^"]*)py-8\s+lg:py-14([^"]*)"/g,
    'class="$1pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-6 lg:pb-12$2"'
  );
  content = content.replace(
    /id="mainFooter"\s+class="([^"]*)py-8\s+lg:py-14([^"]*)"/g,
    'id="mainFooter" class="$1pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-6 lg:pb-12$2"'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
console.log('Done updating all pages!');
