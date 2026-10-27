const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const hero = indexHtml.match(/<section id="home-hero"[\s\S]*?<\/section>/);
if (hero) {
  const lines = hero[0].split('\n');
  console.log(lines.slice(60).join('\n'));
}
