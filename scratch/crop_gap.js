const fs = require('fs');
const zlib = require('zlib');

function cropPNG(inputPath, topOut, bottomOut) {
  const buf = fs.readFileSync(inputPath);
  let offset = 8, idatBuffers = [];
  let width, height;
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
    } else if (type === 'IDAT') {
      idatBuffers.push(buf.subarray(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }
  const decomp = zlib.inflateSync(Buffer.concat(idatBuffers));
  const stride = 1 + width * 4;

  function makePNG(cropYStart, cropHeight, outFile) {
    const cropData = Buffer.alloc(cropHeight * stride);
    for (let y = 0; y < cropHeight; y++) {
      const srcY = cropYStart + y;
      const srcLine = srcY * stride;
      const destLine = y * stride;
      decomp.copy(cropData, destLine, srcLine, srcLine + stride);
    }
    const compressed = zlib.deflateSync(cropData);

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(cropHeight, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    function chunk(type, data) {
      const c = Buffer.alloc(12 + data.length);
      c.writeUInt32BE(data.length, 0);
      c.write(type, 4, 4, 'ascii');
      data.copy(c, 8);
      // CRC
      const crcVal = crc32(c.subarray(4, 8 + data.length));
      c.writeUInt32BE(crcVal, 8 + data.length);
      return c;
    }

    const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const finalBuf = Buffer.concat([
      pngHeader,
      chunk('IHDR', ihdr),
      chunk('IDAT', compressed),
      chunk('IEND', Buffer.alloc(0))
    ]);
    fs.writeFileSync(outFile, finalBuf);
    console.log(`Saved ${outFile}`);
  }

  makePNG(0, 40, topOut);
  makePNG(height - 45, 45, bottomOut);
}

// Simple CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c >>> 0;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

cropPNG(
  'C:/Users/Tamiluuu/.gemini/antigravity/brain/fc9b38c4-0bc8-49b6-979b-571340e330f9/.user_uploaded/media_1791273532532.png',
  'C:/Users/Tamiluuu/gap_top.png',
  'C:/Users/Tamiluuu/gap_bottom.png'
);
