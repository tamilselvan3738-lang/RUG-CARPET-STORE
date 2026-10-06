const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const badges = [];
  lines.forEach((line, idx) => {
    if (line.includes('rounded-full') && line.includes('border') && (line.includes('tracking') || line.includes('inline-flex'))) {
      badges.push({ line: idx + 1, text: line.trim() });
    }
  });
  if (badges.length > 0) {
    console.log(`=== ${file} (${badges.length} badges) ===`);
    badges.slice(0, 5).forEach(b => console.log(`  L${b.line}: ${b.text.slice(0, 100)}...`));
  }
});
