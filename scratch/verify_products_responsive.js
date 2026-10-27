const http = require('http');
const { spawn } = require('child_process');

const widths = [1440, 1024, 768, 480, 375, 320];

async function verifyProductsResponsive() {
  const port = 9850;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/products.html'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        const pages = JSON.parse(data);
        const target = pages.find(p => p.type === 'page' && p.url.includes('5500')) || pages[0];
        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let wIdx = 0;

        ws.onopen = () => testNext();

        function testNext() {
          if (wIdx >= widths.length) {
            ws.close();
            chrome.kill();
            console.log('All products.html responsive checks completed!');
            resolve();
            return;
          }

          const w = widths[wIdx];
          ws.send(JSON.stringify({
            id: 10 + wIdx,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const firstSec = document.querySelector('main > section:first-of-type');
                const firstSecRect = firstSec ? firstSec.getBoundingClientRect() : null;
                const firstSecStyle = firstSec ? window.getComputedStyle(firstSec) : null;
                
                return {
                  viewport: ${w},
                  docWidth,
                  scrollWidth,
                  hasScroll: scrollWidth > docWidth,
                  firstSectionId: firstSec ? firstSec.id : null,
                  firstSecPaddingTop: firstSecStyle ? firstSecStyle.paddingTop : null
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 100 + wIdx,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 400);
        }

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id >= 100) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            console.log(`Viewport ${widths[wIdx]}px:`, val);
            wIdx++;
            testNext();
          }
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

verifyProductsResponsive().catch(console.error);
