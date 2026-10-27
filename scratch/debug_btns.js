const http = require('http');
const { spawn } = require('child_process');

async function debugBtns() {
  const port = 9801;
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

        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 1024, height: 900, deviceScaleFactor: 1, mobile: false }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const bar = document.getElementById('homeExploreCtaBar');
                const btns = bar.children[1];
                return {
                  btnsTag: btns.tagName,
                  btnsClass: btns.className,
                  btnsWidth: window.getComputedStyle(btns).width,
                  btnsFlex: window.getComputedStyle(btns).flex,
                  btnsFlexShrink: window.getComputedStyle(btns).flexShrink,
                  barWidth: window.getComputedStyle(bar).width,
                  barChildren: Array.from(bar.children).map(c => ({ tag: c.tagName, class: c.className, width: window.getComputedStyle(c).width }))
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
            console.log(JSON.stringify(resp.result.result.value, null, 2));
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

debugBtns().catch(console.error);
