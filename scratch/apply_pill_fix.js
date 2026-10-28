const fs = require('fs');

let html = fs.readFileSync('rug-guide.html', 'utf8');

// 1. Add CSS rules before </style>
const cssToInsert = `
    /* Guide Sub-Nav Pill Navigation (Light & Dark Mode) */
    #guideSubNav {
      background-color: rgba(250, 248, 245, 0.96);
      border-bottom: 1px solid rgba(226, 232, 240, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .dark #guideSubNav {
      background-color: rgba(10, 12, 16, 0.96);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .guide-nav-pill {
      background-color: #ffffff !important;
      border-color: rgba(226, 232, 240, 0.9) !important;
      color: #0f172a !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    .guide-nav-pill span {
      color: #0f172a !important;
    }
    .guide-nav-pill:hover {
      border-color: rgba(212, 175, 55, 0.5) !important;
      background-color: #fffdfa !important;
      color: #b45309 !important;
    }
    .guide-nav-pill:hover span {
      color: #b45309 !important;
    }
    .dark .guide-nav-pill {
      background-color: #12151c !important;
      border-color: rgba(255, 255, 255, 0.12) !important;
      color: #f8fafc !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
    .dark .guide-nav-pill span {
      color: #f8fafc !important;
    }
    .dark .guide-nav-pill:hover {
      border-color: rgba(212, 175, 55, 0.5) !important;
      background-color: #1a1e27 !important;
      color: #fbbf24 !important;
    }
    .dark .guide-nav-pill:hover span {
      color: #fbbf24 !important;
    }

    .guide-nav-cta {
      background-color: rgba(212, 175, 55, 0.15) !important;
      border-color: rgba(212, 175, 55, 0.4) !important;
      color: #92400e !important;
    }
    .guide-nav-cta span,
    .guide-nav-cta svg,
    .guide-nav-cta i {
      color: #92400e !important;
    }
    .guide-nav-cta:hover {
      background-color: rgba(212, 175, 55, 0.25) !important;
      border-color: rgba(212, 175, 55, 0.6) !important;
    }
    .dark .guide-nav-cta {
      background-color: rgba(212, 175, 55, 0.18) !important;
      border-color: rgba(212, 175, 55, 0.45) !important;
      color: #fcd34d !important;
    }
    .dark .guide-nav-cta span,
    .dark .guide-nav-cta svg,
    .dark .guide-nav-cta i {
      color: #fcd34d !important;
    }
    .dark .guide-nav-cta:hover {
      background-color: rgba(212, 175, 55, 0.28) !important;
    }
`;

// Insert before the last </style>
const lastStyleIdx = html.lastIndexOf('</style>');
html = html.slice(0, lastStyleIdx) + cssToInsert + '\n  ' + html.slice(lastStyleIdx);

// 2. Replace the old nav with the new nav
const oldNavRegex = /<!-- Sticky Quick Navigation Bar -->[\s\S]*?<\/nav>/;
const newNavHTML = `<!-- Sticky Quick Navigation Bar -->
    <nav id="guideSubNav" class="sticky top-16 sm:top-20 z-30 py-3 transition-all shadow-sm">
      <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        <a href="#blueprint-living" class="guide-nav-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <i data-lucide="sofa" class="w-3.5 h-3.5 text-gold-500 shrink-0"></i>
          <span>Living Room</span>
        </a>
        <a href="#blueprint-dining" class="guide-nav-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <i data-lucide="utensils" class="w-3.5 h-3.5 text-gold-500 shrink-0"></i>
          <span>Dining Room</span>
        </a>
        <a href="#blueprint-bedroom" class="guide-nav-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <i data-lucide="bed" class="w-3.5 h-3.5 text-gold-500 shrink-0"></i>
          <span>Bedroom</span>
        </a>
        <a href="#material-matrix" class="guide-nav-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <i data-lucide="table" class="w-3.5 h-3.5 text-gold-500 shrink-0"></i>
          <span>Material Matrix</span>
        </a>
        <a href="#care-guide" class="guide-nav-pill px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-2 whitespace-nowrap shrink-0">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-gold-500 shrink-0"></i>
          <span>Cleaning &amp; Care</span>
        </a>
        <a href="contact.html" class="guide-nav-cta px-4 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <i data-lucide="ruler" class="w-3.5 h-3.5 shrink-0"></i>
          <span>Free Room Measurement &rarr;</span>
        </a>
      </div>
    </nav>`;

if (!oldNavRegex.test(html)) {
  console.error('Could not find old nav!');
  process.exit(1);
}

html = html.replace(oldNavRegex, newNavHTML);
fs.writeFileSync('rug-guide.html', html, 'utf8');
console.log('rug-guide.html successfully updated!');
