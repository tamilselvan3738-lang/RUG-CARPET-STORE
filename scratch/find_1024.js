const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('1024px')) {
    console.log(`L${idx+1}: ${line}`);
    console.log(lines.slice(idx, idx+15).join('\n'));
  }
});
