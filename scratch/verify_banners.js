const http = require('http');
const { spawn } = require('child_process');

const testCases = [
  { file: 'products.html', id: 'productsCtaBanner', widths: [375, 768, 820, 1024, 1440] },
  { file: 'index.html', id: 'homeExploreCtaBar', widths: [375, 768, 820, 1024, 1440] },
  { file: 'rug-guide.html', id: 'guideConsultCtaBar', widths: [375, 768, 820, 1024, 1440] }
];

async function testBanner(tc) {
  console.log(`\n================ Testing ${tc.file} (${tc.id}) ================`);
  const port = 9780 + Math.floor(Math.random() * 50);
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    `http://127.0.0.1:5500/${tc.file}`
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
          if (wIdx >= tc.widths.length) {
            ws.close();
            chrome.kill();
            resolve();
            return;
          }

          const w = tc.widths[wIdx];
          ws.send(JSON.stringify({
            id: 10 + wIdx,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const el = document.getElementById('${tc.id}');
                if (!el) return { error: 'element not found' };
                const cRect = el.getBoundingClientRect();
                const h3 = el.querySelector('h3');
                const p = el.querySelector('p');
                const btnBox = el.querySelector('.flex.flex-wrap, .flex.flex-wrap.sm\\\\:flex-nowrap');
                
                return {
                  viewport: ${w},
                  cardWidth: Math.round(cRect.width),
                  cardHeight: Math.round(cRect.height),
                  h3Width: h3 ? Math.round(h3.getBoundingClientRect().width) : null,
                  h3Height: h3 ? Math.round(h3.getBoundingClientRect().height) : null,
                  btnWidth: btnBox ? Math.round(btnBox.getBoundingClientRect().width) : null,
                  flexDir: window.getComputedStyle(el).flexDirection,
                  hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 100 + wIdx,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 350);
        }

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id >= 100) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            console.log(`Viewport ${tc.widths[wIdx]}px:`, val);
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

async function run() {
  for (const tc of testCases) {
    await testBanner(tc);
    await new Promise(r => setTimeout(r, 600));
  }
}

run().catch(console.error);
