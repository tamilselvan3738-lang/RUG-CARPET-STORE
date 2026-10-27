const http = require('http');
const { spawn } = require('child_process');

async function testCtaLayout(width) {
  const port = 9700 + Math.floor(Math.random() * 50);
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
            params: { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const ctaH3 = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Ready to Explore'));
                if (!ctaH3) return { error: 'not found' };
                const ctaCard = ctaH3.closest('.rounded-3xl');
                const textCol = ctaH3.parentElement;
                const btnCol = ctaCard.querySelector('.flex.flex-wrap');
                
                return {
                  viewportWidth: ${width},
                  cardRect: ctaCard.getBoundingClientRect(),
                  textColRect: textCol.getBoundingClientRect(),
                  btnColRect: btnCol ? btnCol.getBoundingClientRect() : null,
                  cardFlexDir: window.getComputedStyle(ctaCard).flexDirection,
                  h3ClientWidth: ctaH3.clientWidth,
                  h3ScrollWidth: ctaH3.scrollWidth,
                  h3Text: ctaH3.innerText.replace(/\\n/g, ' / ')
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 500);
        };

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id === 2) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            console.log(`\nWidth ${width}px:`, JSON.stringify(val, null, 2));
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

async function run() {
  await testCtaLayout(768);
  await testCtaLayout(820);
  await testCtaLayout(912);
  await testCtaLayout(1024);
}

run().catch(console.error);
