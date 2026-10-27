const fs = require('fs');

let prod = fs.readFileSync('products.html', 'utf8');

// Replace CTA banner HTML in products.html
const oldCta = `        <!-- Call to Action Banner -->
        <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-1 text-center md:text-left">
            <h3 class="font-serif font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              Ready to Explore or Commission Your Carpet?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Schedule a personalized private consultation with our Senior Curator or visit our Fifth Avenue gallery.
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Showroom Visit</span>
            </a>
            <a href="collections.html" class="btn-3d btn-3d-dark sheen px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>Explore Collections</span>
            </a>
          </div>
        </div>`;

const newCta = `        <!-- Call to Action Banner -->
        <div class="cta-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-6" id="productsCtaBanner">
          <div class="cta-banner-text space-y-1.5 text-center lg:text-left flex-1 min-w-0 pr-0 lg:pr-6">
            <h3 class="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white leading-snug">
              Ready to Explore or Commission Your Carpet?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Schedule a personalized private consultation with our Senior Curator or visit our Fifth Avenue gallery.
            </p>
          </div>
          <div class="flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-end gap-3 flex-shrink-0 w-full sm:w-auto">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Showroom Visit</span>
            </a>
            <a href="collections.html" class="btn-3d btn-3d-dark sheen px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="layers" class="w-4 h-4"></i>
              <span>Explore Collections</span>
            </a>
          </div>
        </div>`;

// Add CSS rules
const ctaCss = `
    /* Master Banner Word-Wrap & Alignment Protection */
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
        flex-direction: column !important;
        text-align: center !important;
        align-items: center !important;
      }
      .cta-banner > div:first-child,
      #homeExploreCtaBar > div:first-child,
      #guideConsultCtaBar > div:first-child,
      #productsCtaBanner > div:first-child {
        width: 100% !important;
        text-align: center !important;
        margin-bottom: 0.5rem !important;
      }
      .cta-banner .flex-wrap,
      #homeExploreCtaBar .flex-wrap,
      #guideConsultCtaBar .flex-wrap,
      #productsCtaBanner .flex-wrap {
        justify-content: center !important;
        width: 100% !important;
      }
    }
`;

prod = prod.replace(
  oldCta.replace(/\r?\n/g, '\n'),
  newCta.replace(/\r?\n/g, '\n')
);

// If CRLF replace fails, try flexible regex
if (!prod.includes('id="productsCtaBanner"')) {
  prod = prod.replace(
    /<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500\/15[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `${newCta}\n      </div>\n    </section>`
  );
}

// Add CSS to style block
prod = prod.replace('  </style>', `${ctaCss}\n  </style>`);

fs.writeFileSync('products.html', prod, 'utf8');
console.log('products.html updated with CTA fix!');
