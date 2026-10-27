const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace @media (min-width: 1024px) block in index.html
const target1024 = `@media (min-width: 1024px) {
      section {
        padding-top: 3.25rem !important;
        padding-bottom: 3.25rem !important;
      }
    }`;

const replacement1024 = `@media (min-width: 1024px) {
      section {
        padding-top: 3.25rem !important;
        padding-bottom: 3.25rem !important;
      }
    }

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

    section:last-of-type,
    #home-care-explore {
      padding-bottom: 1.5rem !important;
    }
    @media (min-width: 1024px) {
      section:last-of-type,
      #home-care-explore {
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
    }`;

// Use regex to replace regardless of CRLF or whitespace
indexHtml = indexHtml.replace(
  /@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{\s*padding-top:\s*3\.25rem\s*!important;\s*padding-bottom:\s*3\.25rem\s*!important;\s*\}\s*\}/,
  replacement1024
);

// Update footer classes
indexHtml = indexHtml.replace(
  '<footer id="mainFooter" class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">',
  '<footer id="mainFooter" class="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-6 lg:pb-12">'
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html with precision spacing!');
