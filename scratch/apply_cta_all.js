const fs = require('fs');

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

// 1. Update index.html
let index = fs.readFileSync('index.html', 'utf8');

const oldIndexCta = `<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-obsidian-900 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6" id="homeExploreCtaBar">
          <div class="space-y-1 text-center md:text-left">
            <h3 class="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Ready to Find the Perfect Rug for Your Space?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Browse our inventory online, request a 72-hour in-home trial, or schedule a private consultation.
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a href="products.html" class="btn-3d btn-3d-gold sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Shop All Rugs</span>
            </a>
            <a href="contact.html" class="btn-3d btn-3d-dark sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Appointment</span>
            </a>
          </div>
        </div>`;

const newIndexCta = `<div class="cta-banner p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-obsidian-900 border border-gold-500/30 flex flex-col lg:flex-row items-center justify-between gap-6" id="homeExploreCtaBar">
          <div class="cta-banner-text space-y-1.5 text-center lg:text-left flex-1 min-w-0 pr-0 lg:pr-6">
            <h3 class="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Ready to Find the Perfect Rug for Your Space?
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Browse our inventory online, request a 72-hour in-home trial, or schedule a private consultation.
            </p>
          </div>
          <div class="flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-end gap-3 shrink-0 w-full sm:w-auto">
            <a href="products.html" class="btn-3d btn-3d-gold sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i>
              <span>Shop All Rugs</span>
            </a>
            <a href="contact.html" class="btn-3d btn-3d-dark sheen px-7 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Appointment</span>
            </a>
          </div>
        </div>`;

index = index.replace(oldIndexCta.replace(/\r?\n/g, '\n'), newIndexCta.replace(/\r?\n/g, '\n'));
if (!index.includes('cta-banner-text')) {
  index = index.replace(
    /<div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-gold-500\/15[\s\S]*?id="homeExploreCtaBar"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `${newIndexCta}\n      </div>\n    </section>`
  );
}
index = index.replace('  </style>', `${ctaCss}\n  </style>`);
fs.writeFileSync('index.html', index, 'utf8');
console.log('index.html updated!');

// 2. Update rug-guide.html
let guide = fs.readFileSync('rug-guide.html', 'utf8');

const oldGuideCta = `<div class="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6" id="guideConsultCtaBar">
          <div class="space-y-2 text-center md:text-left">
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Need Expert Guidance for Your Space?
            </h3>
            <p class="text-slate-600 dark:text-slate-300 text-sm max-w-xl">
              Schedule a personalized private consultation with our Senior Curator or request an in-home trial showing.
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Private Consultation</span>
            </a>
            <a href="products.html" class="btn-3d btn-3d-dark sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Explore Collection</span>
            </a>
          </div>
        </div>`;

const newGuideCta = `<div class="cta-banner rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6" id="guideConsultCtaBar">
          <div class="cta-banner-text space-y-2 text-center lg:text-left flex-1 min-w-0 pr-0 lg:pr-6">
            <h3 class="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
              Need Expert Guidance for Your Space?
            </h3>
            <p class="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto lg:mx-0">
              Schedule a personalized private consultation with our Senior Curator or request an in-home trial showing.
            </p>
          </div>
          <div class="flex flex-wrap sm:flex-nowrap items-center justify-center lg:justify-end gap-3 shrink-0 w-full sm:w-auto">
            <a href="contact.html" class="btn-3d btn-3d-gold sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="calendar" class="w-4 h-4"></i>
              <span>Book Private Consultation</span>
            </a>
            <a href="products.html" class="btn-3d btn-3d-dark sheen px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Explore Collection</span>
            </a>
          </div>
        </div>`;

guide = guide.replace(oldGuideCta.replace(/\r?\n/g, '\n'), newGuideCta.replace(/\r?\n/g, '\n'));
if (!guide.includes('cta-banner-text')) {
  guide = guide.replace(
    /<div class="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-obsidian-900[\s\S]*?id="guideConsultCtaBar"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/,
    `${newGuideCta}\n      </div>\n    </section>`
  );
}
guide = guide.replace('  </style>', `${ctaCss}\n  </style>`);
fs.writeFileSync('rug-guide.html', guide, 'utf8');
console.log('rug-guide.html updated!');
