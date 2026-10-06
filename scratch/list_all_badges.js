const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('rounded-full') && line.includes('border') && (line.includes('inline-flex') || line.includes('items-center'))) {
      const next1 = lines[i+1] ? lines[i+1].trim() : '';
      const next2 = lines[i+2] ? lines[i+2].trim() : '';
      const next3 = lines[i+3] ? lines[i+3].trim() : '';
      console.log(`[${f}:${i+1}]`);
      console.log(`   L${i+1}: ${line.trim().slice(0, 80)}`);
      if (next1) console.log(`   +1: ${next1.slice(0, 80)}`);
      if (next2) console.log(`   +2: ${next2.slice(0, 80)}`);
      if (next3) console.log(`   +3: ${next3.slice(0, 80)}`);
    }
  });
});
