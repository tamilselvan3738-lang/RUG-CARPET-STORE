const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function captureCtaScreenshot() {
  const port = 9770;
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

        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 820, height: 900, deviceScaleFactor: 2, mobile: false }
          }));

          setTimeout(() => {
            // Scroll to the CTA banner
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: {
                expression: `
                  (() => {
                    const cta = document.getElementById('productsCtaBanner');
                    if (cta) cta.scrollIntoView({ block: 'center' });
                    return cta ? cta.getBoundingClientRect() : null;
                  })()
                `,
                returnByValue: true
              }
            }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 3,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 600);
          }, 600);
        };

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id === 3) {
            const outPath = 'C:\\Users\\Tamiluuu\\.gemini\\antigravity\\brain\\fc9b38c4-0bc8-49b6-979b-571340e330f9\\fixed_cta_banner_820px.png';
            fs.writeFileSync(outPath, Buffer.from(resp.result.data, 'base64'));
            console.log(`Saved screenshot to ${outPath}`);
            ws.close();
            chrome.kill();
            resolve();
          }
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

captureCtaScreenshot().catch(console.error);
