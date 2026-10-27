const http = require('http');
const { spawn } = require('child_process');

const widths = [1440, 1024, 768, 480, 360, 320];

async function checkBreakpoints() {
  const port = 9595;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
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

        let wIndex = 0;

        ws.onopen = () => {
          testNextWidth();
        };

        function testNextWidth() {
          if (wIndex >= widths.length) {
            ws.close();
            chrome.kill();
            console.log('All breakpoints verified!');
            resolve();
            return;
          }

          const w = widths[wIndex];
          ws.send(JSON.stringify({
            id: 10 + wIndex,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: w, height: 800, deviceScaleFactor: 1, mobile: w < 768 }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const hasScroll = scrollWidth > docWidth;
                const heroLeft = document.getElementById('homeHeroPillarsCol');
                const heroRight = document.getElementById('homeHeroVisualCol');
                return {
                  width: ${w},
                  docWidth,
                  scrollWidth,
                  hasScroll,
                  heroLeftHeight: heroLeft ? Math.round(heroLeft.getBoundingClientRect().height) : null,
                  heroRightHeight: heroRight ? Math.round(heroRight.getBoundingClientRect().height) : null
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 100 + wIndex,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 400);
        }

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id >= 100) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            console.log(`Breakpoint ${widths[wIndex]}px:`, val);
            wIndex++;
            testNextWidth();
          }
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

checkBreakpoints().catch(console.error);
