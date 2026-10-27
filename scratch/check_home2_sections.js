const fs = require('fs');

const h2 = fs.readFileSync('home-2.html', 'utf8');
const sections = h2.match(/<section[\s\S]*?>/gi) || [];
console.log('home-2.html sections:');
sections.forEach(s => {
  const id = s.match(/id="([^"]+)"/);
  console.log(`  id="${id ? id[1] : 'none'}"`);
});
