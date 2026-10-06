const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

async function capture1024() {
  const port = 9568;
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
            params: { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false }
          }));

          let step = 0;
          // Capture every 500px from 0 to 9000
          const scrollPositions = [];
          for (let y = 0; y <= 9000; y += 600) {
            scrollPositions.push(y);
          }

          function nextCapture() {
            if (step >= scrollPositions.length) {
              ws.close();
              chrome.kill();
              console.log('Finished 1024 captures!');
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
              fs.writeFileSync(`C:\\Users\\Tamiluuu\\slice1024_${y}.png`, buf);
              step++;
              setTimeout(nextCapture, 150);
            }
          };

          setTimeout(nextCapture, 800);
        };
      });
    });
  }, 1800);
}

capture1024();
