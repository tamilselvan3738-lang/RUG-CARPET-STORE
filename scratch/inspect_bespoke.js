const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const bespoke = indexHtml.match(/<section id="home-bespoke"[\s\S]*?<\/section>/);
if (bespoke) {
  console.log(bespoke[0]);
}
