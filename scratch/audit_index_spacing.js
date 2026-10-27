const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Look for all <section> tags in index.html
const sectionRegex = /<section[\s\S]*?>/gi;
let match;
console.log('--- ALL SECTIONS IN index.html ---');
while ((match = sectionRegex.exec(indexHtml)) !== null) {
  const tag = match[0];
  const idMatch = tag.match(/id="([^"]+)"/);
  const classMatch = tag.match(/class="([^"]+)"/);
  console.log(`Section id="${idMatch ? idMatch[1] : 'none'}" class="${classMatch ? classMatch[1] : 'none'}"`);
}

// Look for media queries for section in style tags
console.log('\n--- SECTION CSS RULES IN index.html ---');
const styleMatches = indexHtml.match(/section\s*\{[^}]+\}/gi) || [];
styleMatches.forEach((rule, i) => console.log(`Rule ${i+1}: ${rule.replace(/\s+/g, ' ')}`));

// Check hero section markup
console.log('\n--- HERO SECTION IN index.html ---');
const heroMatch = indexHtml.match(/<section[^>]*id="home-hero"[\s\S]*?<\/section>/i);
if (heroMatch) {
  console.log('Hero tag:', heroMatch[0].match(/<section[\s\S]*?>/)[0]);
  const cols = heroMatch[0].match(/<div[^>]*class="[^"]*col-span[^"]*"[^>]*>/gi);
  console.log('Hero cols:', cols);
}

// Check footer markup
console.log('\n--- FOOTER IN index.html ---');
const footerMatch = indexHtml.match(/<footer[\s\S]*?>/i);
if (footerMatch) {
  console.log('Footer tag:', footerMatch[0]);
}

// Check Section 7 / care section
const sec7Match = indexHtml.match(/<section[^>]*id="home-care-explore"[\s\S]*?>/i);
if (sec7Match) {
  console.log('Care explore tag:', sec7Match[0]);
}
