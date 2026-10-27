const fs = require('fs');
let c = fs.readFileSync('404.html', 'utf8');
c = c.replace('startCanvasAnimation();', 'if (typeof startCanvasAnimation === "function") startCanvasAnimation();');
fs.writeFileSync('404.html', c, 'utf8');
console.log('Fixed startCanvasAnimation in 404.html');
