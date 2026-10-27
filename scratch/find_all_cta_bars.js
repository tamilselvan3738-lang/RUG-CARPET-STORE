const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('flex flex-col md:flex-row items-center justify-between') || line.includes('flex flex-col lg:flex-row items-center justify-between') || (line.includes('border-gold-500/30') && line.includes('rounded-3xl'))) {
      console.log(`${file}:${idx + 1}: ${line.trim()}`);
    }
  });
}
