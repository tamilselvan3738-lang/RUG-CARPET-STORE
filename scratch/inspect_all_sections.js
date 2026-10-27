const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Find all grids in sections
const sectionMatches = indexHtml.match(/<section[\s\S]*?<\/section>/gi) || [];

sectionMatches.forEach((sec, idx) => {
  const id = (sec.match(/id="([^"]+)"/) || [])[1] || `section-${idx}`;
  console.log(`\n================ SECTION: ${id} ================`);
  const grids = sec.match(/<div[^>]*class="[^"]*grid[^"]*"[^>]*>/gi) || [];
  grids.forEach((g, gIdx) => {
    console.log(`  Grid ${gIdx + 1}: ${g.replace(/\s+/g, ' ')}`);
  });
});
