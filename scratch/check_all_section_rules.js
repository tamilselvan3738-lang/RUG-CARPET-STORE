const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const sectionRules = content.match(/section\s*\{[^}]*padding[^}]*\}/gi) || [];
  if (sectionRules.length > 0) {
    console.log(`\n${file}: ${sectionRules.length} section padding rules`);
    sectionRules.forEach(r => console.log('  ', r.replace(/\s+/g, ' ')));
  }
}
