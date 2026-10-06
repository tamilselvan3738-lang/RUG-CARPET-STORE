const fs = require('fs');

const indexContent = fs.readFileSync('index.html', 'utf8');
const startMarker = '/* MASTER MOBILE-FIRST RESPONSIVE ARCHITECTURE';
const endMarker = '</style>';

const startIndex = indexContent.indexOf(startMarker);
if (startIndex === -1) {
  throw new Error('Start marker not found in index.html');
}
// Find the comment box right before the startMarker
const commentBoxStart = indexContent.lastIndexOf('/* ========================================================================== */', startIndex);
const endIndex = indexContent.indexOf(endMarker, startIndex);
if (endIndex === -1) {
  throw new Error('End marker not found in index.html');
}

const masterCss = indexContent.substring(commentBoxStart, endIndex);

console.log(`Extracted master CSS: ${masterCss.length} bytes`);

const targetFiles = [
  'home-2.html',
  'about.html',
  'collections.html',
  'craftmanship.html',
  'craftsmanship.html',
  'custom-rugs.html',
  'inspiration.html',
  'products.html',
  'rug-guide.html',
  'showroom.html',
  'contact.html',
  'navbar.html',
  'login.html',
  'registeration.html',
  'registration.html',
  '404.html'
];

function updateBadgeContent(html) {
  return html.replace(
    /(<div class="inline-flex items-center[^"]*rounded-full border[^"]*">[\s\S]*?<i data-lucide="[^"]*"[^>]*><\/i>[\s\S]*?<span>)([^<&]+?)\s*(&bull;|•)\s*([^<]+?)(<\/span>[\s\S]*?<\/div>)/g,
    (match, before, part1, bull, part2, after) => {
      if (match.includes('hidden sm:inline')) return match;
      const trimmedPart1 = part1.trim();
      const trimmedPart2 = part2.trim();
      return `${before}${trimmedPart1} <span class="hidden sm:inline">&bull; ${trimmedPart2}</span>${after}`;
    }
  );
}

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`Skipping non-existent file: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Replace CSS block
  const fileStartMarker = content.indexOf(startMarker);
  if (fileStartMarker !== -1) {
    const fileCommentStart = content.lastIndexOf('/* ========================================================================== */', fileStartMarker);
    const fileEnd = content.indexOf(endMarker, fileStartMarker);
    if (fileCommentStart !== -1 && fileEnd !== -1) {
      content = content.substring(0, fileCommentStart) + masterCss + content.substring(fileEnd);
      console.log(`[${file}] CSS block successfully updated`);
    } else {
      console.log(`[${file}] Warning: couldn't find exact bounds for CSS`);
    }
  } else {
    console.log(`[${file}] Start marker not found`);
  }

  // 2. Update badges
  const updatedHtml = updateBadgeContent(content);
  fs.writeFileSync(file, updatedHtml, 'utf8');
  console.log(`[${file}] Badges processed & file written`);
});

console.log('All files updated successfully!');
