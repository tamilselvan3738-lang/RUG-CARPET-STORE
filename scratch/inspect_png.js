const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let idatBuffers = [];
  let width, height;

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatBuffers.push(buf.subarray(offset + 8, offset + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }

  const compressed = Buffer.concat(idatBuffers);
  const decompressed = zlib.inflateSync(compressed);

  console.log(`Dimensions: ${width}x${height}`);

  // Scan top 20 rows and bottom 20 rows for non-dark pixels
  // Each scanline: 1 filter byte + width * 4 (RGBA)
  const bytesPerPixel = 4;
  const stride = 1 + width * bytesPerPixel;

  const topBrightPixels = [];
  const bottomBrightPixels = [];

  for (let y = 0; y < height; y++) {
    const lineStart = y * stride + 1; // skip filter byte
    for (let x = 0; x < width; x++) {
      const idx = lineStart + x * bytesPerPixel;
      const r = decompressed[idx];
      const g = decompressed[idx + 1];
      const b = decompressed[idx + 2];
      // Check if significantly bright or golden (like yellow button or border)
      if (r > 150 && g > 150) {
        if (y < 40) topBrightPixels.push({ x, y, r, g, b });
        if (y > height - 40) bottomBrightPixels.push({ x, y, r, g, b });
      }
    }
  }

  console.log(`Top bright pixels count: ${topBrightPixels.length}`);
  if (topBrightPixels.length > 0) {
    console.log('Sample top bright:', topBrightPixels.slice(0, 5));
  }
  console.log(`Bottom bright pixels count: ${bottomBrightPixels.length}`);
  if (bottomBrightPixels.length > 0) {
    console.log('Sample bottom bright:', bottomBrightPixels.slice(0, 5));
  }
}

decodePNG('C:/Users/Tamiluuu/.gemini/antigravity/brain/fc9b38c4-0bc8-49b6-979b-571340e330f9/.user_uploaded/media_1791273532532.png');
