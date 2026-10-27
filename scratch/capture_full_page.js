const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function capture() {
  const absPath = path.resolve('products.html').replace(/\\/g, '/');
  const fileUrl = 'file:///' + absPath;
  const port = 9585;

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

      ws.onopen = () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
        }));

        setTimeout(() => {
          // Take screenshot of top
          ws.send(JSON.stringify({
            id: 2,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1200);
      };

      ws.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        if (resp.id === 2 && resp.result?.data) {
          fs.writeFileSync('scratch/screenshot_top.png', Buffer.from(resp.result.data, 'base64'));
          console.log('Saved scratch/screenshot_top.png');

          // Now click View Details
          ws.send(JSON.stringify({
            id: 3,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                openProductDetails('ART-8492');
              `
            }
          }));

          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 4,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 600);
        } else if (resp.id === 4 && resp.result?.data) {
          fs.writeFileSync('scratch/screenshot_modal.png', Buffer.from(resp.result.data, 'base64'));
          console.log('Saved scratch/screenshot_modal.png');
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}

capture();
