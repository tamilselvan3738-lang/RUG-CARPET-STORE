const fs = require('fs');
const zlib = require('zlib');

function getDecomp(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8, idat = [];
  let width, height;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idat.push(buf.subarray(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }
  return { decomp: zlib.inflateSync(Buffer.concat(idat)), width, height };
}

const userBuf = fs.readFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/fc9b38c4-0bc8-49b6-979b-571340e330f9/.user_uploaded/media_1791273532532.png');
// Let's sample a few points from the user image
// In user image: row 10 has some text, row 400 has some text, rows 50-350 are dark background
console.log('Comparing user image with slices...');

const files = fs.readdirSync('C:/Users/Tamiluuu').filter(f => f.startsWith('slice1024_') && f.endsWith('.png'));

// Sort by scroll Y
files.sort((a, b) => {
  const numA = parseInt(a.replace('slice1024_', '').replace('.png', ''));
  const numB = parseInt(b.replace('slice1024_', '').replace('.png', ''));
  return numA - numB;
});

files.forEach(f => {
  const { decomp, width, height } = getDecomp(`C:/Users/Tamiluuu/${f}`);
  const stride = 1 + width * 4;
  // Count how many consecutive dark/empty rows exist in this slice
  let maxConsecutiveEmptyRows = 0;
  let currentEmpty = 0;
  let emptyStart = 0;
  let bestStart = 0;

  for (let y = 0; y < height; y++) {
    let rowBrightPixels = 0;
    for (let x = 60; x < width - 60; x++) {
      const idx = y * stride + 1 + x * 4;
      const r = decomp[idx], g = decomp[idx+1], b = decomp[idx+2];
      // Exclude background particles (subtle gold dots: r ~ 100-200, g ~ 80-160, b < 60, but small)
      if (r > 160 && g > 160 && b > 160) {
        rowBrightPixels++;
      }
    }
    // If fewer than 5 bright pixels in this row, consider it background/empty
    if (rowBrightPixels < 5) {
      if (currentEmpty === 0) emptyStart = y;
      currentEmpty++;
      if (currentEmpty > maxConsecutiveEmptyRows) {
        maxConsecutiveEmptyRows = currentEmpty;
        bestStart = emptyStart;
      }
    } else {
      currentEmpty = 0;
    }
  }

  console.log(`[${f}] max consecutive empty rows: ${maxConsecutiveEmptyRows} (starts at y=${bestStart})`);
});
