const fs = require('fs');
let html = fs.readFileSync('products.html', 'utf8');

// 1. Add .no-scrollbar CSS if not present
if (!html.includes('.no-scrollbar::-webkit-scrollbar')) {
  const thumbPattern = /::-webkit-scrollbar-thumb\s*\{[^}]+\}/;
  const match = html.match(thumbPattern);
  if (match) {
    const repl = match[0] + '\n\n    .no-scrollbar::-webkit-scrollbar {\n      display: none !important;\n      width: 0 !important;\n      height: 0 !important;\n    }\n    .no-scrollbar {\n      -ms-overflow-style: none !important;\n      scrollbar-width: none !important;\n    }';
    html = html.replace(match[0], repl);
  }
}

// 2. Update Quick Jump span
html = html.replace(
  /<span class="text-\[10px\] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-1 hidden lg:inline whitespace-nowrap">Quick Jump:<\/span>/,
  '<span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-2 hidden xl:inline shrink-0 whitespace-nowrap">Quick Jump:</span>'
);

// 3. Add shrink-0 to each jump pill
const pillPattern = /class="px-3 py-1\.5 rounded-xl bg-slate-100 dark:bg-white\/5 hover:bg-gold-500\/15 hover:text-gold-600 dark:hover:text-gold-400 transition-all whitespace-nowrap"/g;
html = html.replace(pillPattern, 'class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-gold-500/15 hover:text-gold-600 dark:hover:text-gold-400 transition-all shrink-0 whitespace-nowrap"');

fs.writeFileSync('products.html', html, 'utf8');
console.log('Successfully updated quicknav and CSS in products.html');
