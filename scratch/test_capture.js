const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function testScroll(scrollY) {
  const port = 9588;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
  ]);

  setTimeout(() => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        const ws = new WebSocket(pages[0].webSocketDebuggerUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 412, height: 922, deviceScaleFactor: 2.625, mobile: true }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: { expression: `window.scrollTo(0, ${scrollY});` }
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
        ws.onmessage = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === 3) {
            fs.writeFileSync('C:\\Users\\Tamiluuu\\mobile_scroll_badge.png', Buffer.from(resp.result.data, 'base64'));
            console.log('Saved mobile_scroll_badge.png');
            ws.close();
            chrome.kill();
            process.exit(0);
          }
        };
      });
    });
  }, 1800);
}

testScroll(1400);
