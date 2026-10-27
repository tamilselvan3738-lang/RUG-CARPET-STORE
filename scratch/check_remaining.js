const http = require('http');
const { spawn } = require('child_process');

const remainingPages = [
  'home-2.html',
  'products.html',
  'craftmanship.html',
  'showroom.html'
];

const viewports = [
  { name: '1440px Desktop', width: 1440, height: 900, mobile: false },
  { name: '1024px Laptop', width: 1024, height: 768, mobile: false },
  { name: '768px Tablet', width: 768, height: 1024, mobile: false },
  { name: '375px Mobile', width: 375, height: 667, mobile: true }
];

async function checkSinglePage(pageName, port) {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    `http://127.0.0.1:5500/${pageName}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        const pList = JSON.parse(data);
        const target = pList.find(p => p.type === 'page' && p.url.includes(pageName)) || pList[0];
        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let vIdx = 0;
        const results = [];

        ws.onopen = () => testNextVp();

        function testNextVp() {
          if (vIdx >= viewports.length) {
            ws.close();
            chrome.kill();
            resolve({ page: pageName, results });
            return;
          }

          const vp = viewports[vIdx];
          ws.send(JSON.stringify({
            id: 10 + vIdx,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                return {
                  viewport: '${vp.name}',
                  docWidth,
                  scrollWidth,
                  hasScroll: scrollWidth > docWidth
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 100 + vIdx,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 350);
        }

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id >= 100) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            results.push(val);
            vIdx++;
            testNextVp();
          }
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

async function runRemaining() {
  let port = 9650;
  for (const p of remainingPages) {
    const res = await checkSinglePage(p, port++);
    const failed = res.results.filter(r => r.hasScroll);
    if (failed.length > 0) {
      console.log(`❌ ${p}: FAILED - Horizontal scroll detected:`, failed);
    } else {
      console.log(`✅ ${p}: PASSED all 4 viewports!`);
    }
    await new Promise(r => setTimeout(r, 600));
  }
}

runRemaining().catch(console.error);
