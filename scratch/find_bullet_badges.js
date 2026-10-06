const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('rounded-full')) {
      const chunk = [l, lines[i+1] || '', lines[i+2] || ''].join('\n');
      if (chunk.includes('&bull;') || chunk.includes('•')) {
        console.log(`[${f}:${i+1}]`);
        if (chunk.includes('&bull;')) {
          const match = chunk.match(/<span>([^<]+(?:<span[^>]*>[^<]*<\/span>[^<]*)*)<\/span>/);
          if (match) console.log('   Span text:', match[0]);
        }
      }
    }
  });
});
