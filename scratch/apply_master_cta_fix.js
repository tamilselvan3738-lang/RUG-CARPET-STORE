const fs = require('fs');

const masterCtaCss = `
    /* ========================================================================== */
    /* MASTER CTA BANNER PERFECT RESPONSIVE ALIGNMENT ENGINE                      */
    /* ========================================================================== */
    .cta-banner-text,
    .cta-banner h2,
    .cta-banner h3,
    #homeExploreCtaBar h3,
    #guideConsultCtaBar h3,
    #productsCtaBanner h3 {
      word-break: normal !important;
      overflow-wrap: normal !important;
      hyphens: none !important;
      white-space: normal !important;
    }

    @media (max-width: 1023px) {
      .cta-banner,
      #homeExploreCtaBar,
      #guideConsultCtaBar,
      #productsCtaBanner {
        display: flex !important;
        flex-direction: column !important;
        text-align: center !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 1.25rem !important;
      }
      .cta-banner-text,
      .cta-banner > div:first-child,
      #homeExploreCtaBar > div:first-child,
      #guideConsultCtaBar > div:first-child,
      #productsCtaBanner > div:first-child {
        width: 100% !important;
        max-width: 100% !important;
        text-align: center !important;
        margin-bottom: 0 !important;
        padding-right: 0 !important;
      }
      .cta-banner-text h2,
      .cta-banner-text h3,
      #homeExploreCtaBar h3,
      #guideConsultCtaBar h3,
      #productsCtaBanner h3 {
        text-align: center !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .cta-banner-text p,
      #homeExploreCtaBar p,
      #guideConsultCtaBar p,
      #productsCtaBanner p {
        text-align: center !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .cta-banner-buttons,
      .cta-banner > div:last-child,
      #homeExploreCtaBar > div:last-child,
      #guideConsultCtaBar > div:last-child,
      #productsCtaBanner > div:last-child {
        width: 100% !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 0.75rem !important;
      }
    }

    @media (min-width: 1024px) {
      .cta-banner,
      #homeExploreCtaBar,
      #guideConsultCtaBar,
      #productsCtaBanner {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 2rem !important;
      }
      .cta-banner-text,
      .cta-banner > div:first-child,
      #homeExploreCtaBar > div:first-child,
      #guideConsultCtaBar > div:first-child,
      #productsCtaBanner > div:first-child {
        flex: 1 1 0% !important;
        width: auto !important;
        max-width: none !important;
        text-align: left !important;
        margin-bottom: 0 !important;
        padding-right: 1.5rem !important;
      }
      .cta-banner-text h2,
      .cta-banner-text h3,
      #homeExploreCtaBar h3,
      #guideConsultCtaBar h3,
      #productsCtaBanner h3 {
        text-align: left !important;
      }
      .cta-banner-text p,
      #homeExploreCtaBar p,
      #guideConsultCtaBar p,
      #productsCtaBanner p {
        text-align: left !important;
      }
      .cta-banner-buttons,
      .cta-banner > div:last-child,
      #homeExploreCtaBar > div:last-child,
      #guideConsultCtaBar > div:last-child,
      #productsCtaBanner > div:last-child {
        flex: 0 0 auto !important;
        width: auto !important;
        display: flex !important;
        flex-wrap: nowrap !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 0.875rem !important;
      }
    }
`;

function fixFile(file, bannerId) {
  let content = fs.readFileSync(file, 'utf8');

  // Remove any previously injected Master Banner CSS
  content = content.replace(/\/\* Master Banner Word-Wrap[\s\S]*?\}\s*\}\s*/g, '');
  content = content.replace(/\/\* ==========================================================================\s*\*\/[\s\S]*?MASTER CTA BANNER PERFECT RESPONSIVE ALIGNMENT ENGINE[\s\S]*?\}\s*\}\s*/g, '');

  // Add updated master CSS before </style>
  content = content.replace('  </style>', `${masterCtaCss}\n  </style>`);

  // Ensure banner has cta-banner, cta-banner-text, cta-banner-buttons classes and NO w-full on buttons container
  const bannerRegex = new RegExp(`(<div[^>]*id="${bannerId}"[^>]*>|id="${bannerId}"[\\s\\S]*?>)`);
  
  // Specific markup cleanup for products.html
  if (file === 'products.html') {
    content = content.replace(
      /<div class="[^"]*p-6 sm:p-8 rounded-3xl[^"]*" id="productsCtaBanner">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="cta-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent border border-gold-500/30" id="productsCtaBanner">
          <div class="cta-banner-text space-y-1.5">
            <h3 class="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white leading-snug">
              Ready to Explore or Commission Your Carpet?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Schedule a personalized private consultation with our Senior Curator or visit our Fifth Avenue gallery.
            </p>
          </div>
          <div class="cta-banner-buttons">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Showroom Visit</span>
            </a>
            <a href="collections.html" class="btn-3d btn-3d-dark sheen px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>Explore Collections</span>
            </a>
          </div>
        </div>
      </div>
    </section>`
    );
  } else if (file === 'index.html') {
    content = content.replace(
      /<div class="[^"]*p-6 sm:p-8 rounded-3xl[^"]*" id="homeExploreCtaBar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="cta-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-obsidian-900 border border-gold-500/30" id="homeExploreCtaBar">
          <div class="cta-banner-text space-y-1.5">
            <h3 class="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Ready to Find the Perfect Rug for Your Space?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Browse our inventory online, request a 72-hour in-home trial, or schedule a private consultation.
            </p>
          </div>
          <div class="cta-banner-buttons">
            <a href="products.html" class="btn-3d btn-3d-gold sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Shop All Rugs</span>
            </a>
            <a href="contact.html" class="btn-3d btn-3d-dark sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      </div>
    </section>`
    );
  } else if (file === 'rug-guide.html') {
    content = content.replace(
      /<div class="[^"]*p-6 sm:p-8[^"]*" id="guideConsultCtaBar">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
      `<div class="cta-banner rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 text-white shadow-2xl" id="guideConsultCtaBar">
          <div class="cta-banner-text space-y-2">
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Need Expert Guidance for Your Space?
            </h3>
            <p class="text-slate-600 dark:text-slate-300 text-sm max-w-xl">
              Schedule a personalized private consultation with our Senior Curator or request an in-home trial showing.
            </p>
          </div>
          <div class="cta-banner-buttons">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Private Consultation</span>
            </a>
            <a href="products.html" class="btn-3d btn-3d-dark sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Explore Collection</span>
            </a>
          </div>
        </div>
      </div>
    </section>`
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file} with Master CTA Banner Engine!`);
}

fixFile('products.html', 'productsCtaBanner');
fixFile('index.html', 'homeExploreCtaBar');
fixFile('rug-guide.html', 'guideConsultCtaBar');
