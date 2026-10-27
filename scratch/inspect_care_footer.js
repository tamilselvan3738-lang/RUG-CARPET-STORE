const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const careSec = indexHtml.match(/<section id="home-care-explore"[\s\S]*?<\/section>/);
if (careSec) {
  const lines = careSec[0].split('\n');
  console.log('--- CARE EXPLORE END (last 30 lines) ---');
  console.log(lines.slice(-30).join('\n'));
}

const footerPart = indexHtml.match(/<footer[\s\S]*?<\/footer>/);
if (footerPart) {
  const lines = footerPart[0].split('\n');
  console.log('--- FOOTER START (first 30 lines) ---');
  console.log(lines.slice(0, 30).join('\n'));
}
