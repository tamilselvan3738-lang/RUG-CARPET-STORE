const fs = require('fs');

function updateBadgeContent(html) {
  // Regex to find:
  // <div class="inline-flex items-center[^"]*rounded-full border[^"]*">
  //   <i data-lucide="[^"]*"[^>]*></i>
  //   <span>(Part 1) &bull; (Part 2)</span>
  // </div>
  // Ensure we don't double wrap if already has class="hidden sm:inline"
  
  return html.replace(
    /(<div class="inline-flex items-center[^"]*rounded-full border[^"]*">[\s\S]*?<i data-lucide="[^"]*"[^>]*><\/i>[\s\S]*?<span>)([^<&]+?)\s*(&bull;|•)\s*([^<]+?)(<\/span>[\s\S]*?<\/div>)/g,
    (match, before, part1, bull, part2, after) => {
      // If already has hidden sm:inline, don't touch
      if (match.includes('hidden sm:inline')) return match;
      const trimmedPart1 = part1.trim();
      const trimmedPart2 = part2.trim();
      return `${before}${trimmedPart1} <span class="hidden sm:inline">&bull; ${trimmedPart2}</span>${after}`;
    }
  );
}

// Test on sample string
const sample = `
<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-xs font-bold uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
  <i data-lucide="compass" class="w-3.5 h-3.5"></i>
  <span>Avant-Garde Architectural Maison &bull; Spatial Pavilion</span>
</div>
`;

console.log('TRANSFORMED:');
console.log(updateBadgeContent(sample));
