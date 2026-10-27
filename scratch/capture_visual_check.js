const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function captureIndexSlices() {
  const port = 9594;
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
            params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
          }));

          setTimeout(() => {
            // Capture Hero at y=0
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 600);
        };

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id === 2) {
            fs.writeFileSync('C:\\Users\\Tamiluuu\\.gemini\\antigravity\\brain\\fc9b38c4-0bc8-49b6-979b-571340e330f9\\index_hero_check.png', Buffer.from(resp.result.data, 'base64'));
            console.log('Saved index_hero_check.png');

            // Now scroll to footer area (around 7300px)
            ws.send(JSON.stringify({
              id: 3,
              method: 'Runtime.evaluate',
              params: { expression: 'window.scrollTo(0, 7400);' }
            }));

            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 4,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 600);
          } else if (resp.id === 4) {
            fs.writeFileSync('C:\\Users\\Tamiluuu\\.gemini\\antigravity\\brain\\fc9b38c4-0bc8-49b6-979b-571340e330f9\\index_footer_check.png', Buffer.from(resp.result.data, 'base64'));
            console.log('Saved index_footer_check.png');
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

captureIndexSlices().catch(console.error);
