const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function captureSlices() {
  const port = 9560;
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

          let step = 0;
          const scrollPositions = [0, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8600];

          function nextCapture() {
            if (step >= scrollPositions.length) {
              ws.close();
              chrome.kill();
              console.log('All slices captured!');
              process.exit(0);
              return;
            }
            const y = scrollPositions[step];
            ws.send(JSON.stringify({
              id: 100 + step,
              method: 'Runtime.evaluate',
              params: { expression: `window.scrollTo(0, ${y});` }
            }));
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 200 + step,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 300);
          }

          ws.onmessage = (event) => {
            const resp = JSON.parse(event.data);
            if (resp.id >= 200 && resp.id < 300) {
              const currentStep = resp.id - 200;
              const y = scrollPositions[currentStep];
              const buf = Buffer.from(resp.result.data, 'base64');
              fs.writeFileSync(`C:\\Users\\Tamiluuu\\slice_${y}.png`, buf);
              console.log(`Saved slice_${y}.png`);
              step++;
              setTimeout(nextCapture, 200);
            }
          };

          setTimeout(nextCapture, 1000);
        };
      });
    });
  }, 1800);
}

captureSlices();
