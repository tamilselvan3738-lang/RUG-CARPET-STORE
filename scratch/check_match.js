const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Check line endings
console.log('Includes CRLF:', content.includes('\r\n'));
console.log('Includes BALANCED SECTION:', content.includes('BALANCED SECTION'));
