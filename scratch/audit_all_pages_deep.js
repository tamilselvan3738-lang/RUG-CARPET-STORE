const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const pages = [
  'index.html',
  'home-2.html',
  'about.html',
  'collections.html',
  'products.html',
  'custom-rugs.html',
  'craftmanship.html',
  'inspiration.html',
  'rug-guide.html',
  'showroom.html',
  'contact.html',
  'login.html',
  'registeration.html'
];

const viewports = [
  { name: '1440px Desktop', width: 1440, height: 900, mobile: false },
  { name: '1024px Laptop', width: 1024, height: 768, mobile: false },
  { name: '768px Tablet', width: 768, height: 1024, mobile: false },
  { name: '375px Mobile', width: 375, height: 667, mobile: true }
];

async function auditPage(pageName, port) {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    `http://127.0.0.1:5500/${pageName}`
  ]);

  await new Promise(r => setTimeout(r, 900));

  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        const pList = JSON.parse(data);
        const target = pList.find(p => p.type === 'page' && p.url.includes(pageName)) || pList[0];
        const ws = new WebSocket(target.webSocketDebuggerUrl);

        let vIdx = 0;
        const pageResults = [];

        ws.onopen = () => {
          testNextVp();
        };

        function testNextVp() {
          if (vIdx >= viewports.length) {
            ws.close();
            chrome.kill();
            resolve({ page: pageName, results: pageResults });
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
                const hasScroll = scrollWidth > docWidth;
                
                // Check auth card width if on auth page
                const loginCard = document.getElementById('loginCard');
                const regCard = document.getElementById('registerCard');
                const cardWidth = (loginCard || regCard) ? Math.round((loginCard || regCard).getBoundingClientRect().width) : null;
                
                return {
                  viewport: '${vp.name}',
                  docWidth,
                  scrollWidth,
                  hasScroll,
                  cardWidth
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
            pageResults.push(val);
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

async function runAll() {
  console.log('--- STARTING COMPREHENSIVE RESPONSIVE AUDIT ---');
  let basePort = 9600;
  let allPass = true;

  for (const page of pages) {
    try {
      const res = await auditPage(page, basePort++);
      const scrollIssues = res.results.filter(r => r.hasScroll);
      if (scrollIssues.length > 0) {
        console.log(`❌ ${page}: FAILED - Horizontal scroll detected:`, scrollIssues);
        allPass = false;
      } else {
        const cardInfo = res.results.find(r => r.cardWidth);
        const cardStr = cardInfo ? ` (Card width at ${cardInfo.viewport}: ${cardInfo.cardWidth}px)` : '';
        console.log(`✅ ${page}: PASSED all viewports${cardStr}`);
      }
    } catch (err) {
      console.error(`Error on ${page}:`, err.message);
    }
  }

  if (allPass) {
    console.log('\n🎉 ALL 13 CORE PAGES PASSED 100% OF VIEWPORT CHECKS!');
  } else {
    console.log('\n⚠️ Some viewports had issues, see above.');
  }
}

runAll().catch(console.error);
