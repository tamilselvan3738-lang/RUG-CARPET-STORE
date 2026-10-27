const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function captureSections() {
  const absPath = path.resolve('products.html').replace(/\\/g, '/');
  const fileUrl = 'file:///' + absPath;
  const port = 9586;

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get(`http://127.0.0.1:${port}/json`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', async () => {
      const pages = JSON.parse(data);
      const target = pages.find(p => p.type === 'page') || pages[0];
      const ws = new WebSocket(target.webSocketDebuggerUrl);

      const sections = [
        { id: 'prod-categories', name: 'categories' },
        { id: 'prod-showcase', name: 'featured' },
        { id: 'prod-material', name: 'materials' },
        { id: 'prod-style', name: 'styles' },
        { id: 'prod-bestsellers', name: 'bestsellers' },
        { id: 'prod-size', name: 'pricing' },
        { id: 'product-details', name: 'details' },
        { id: 'prod-store-info', name: 'store_info' }
      ];

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
        }));

        let step = 0;
        function captureNext() {
          if (step >= sections.length) {
            console.log('All sections captured!');
            ws.close();
            chrome.kill();
            process.exit(0);
            return;
          }

          const sec = sections[step];
          ws.send(JSON.stringify({
            id: 100 + step,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                const el = document.getElementById('${sec.id}');
                if (el) el.scrollIntoView();
              `
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 200 + step,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 450);
        }

        setTimeout(captureNext, 1200);

        ws.onmessage = (msg) => {
          const resp = JSON.parse(msg.data);
          if (resp.id >= 200 && resp.id < 300) {
            const sec = sections[resp.id - 200];
            fs.writeFileSync(`scratch/section_${sec.name}.png`, Buffer.from(resp.result.data, 'base64'));
            console.log(`Saved scratch/section_${sec.name}.png`);
            step++;
            setTimeout(captureNext, 150);
          }
        };
      };
    });
  });
}

captureSections();
