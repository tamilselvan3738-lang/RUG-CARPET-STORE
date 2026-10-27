const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

async function testIndexWithPolyfill() {
  const absPath = path.resolve('index.html').replace(/\\/g, '/');
  const port = 9592;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    'file:///' + absPath
  ]);

  await new Promise(r => setTimeout(r, 1600));

  http.get(`http://127.0.0.1:${port}/json`, (res) => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const pages = JSON.parse(d);
      const target = pages.find(x => x.type === 'page');
      const ws = new WebSocket(target.webSocketDebuggerUrl);

      ws.onopen = () => {
        // Evaluate with Motion.spring defined
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              window.Motion.spring = function() { return [0.16, 1, 0.3, 1]; };
              try {
                Motion.animate('#mainHeader', { y: [-50, 0] }, { duration: 0.6, easing: Motion.spring({ stiffness: 220, damping: 22 }) });
                'Spring animation succeeded!';
              } catch(e) {
                'Caught: ' + e.message;
              }
            `
          }
        }));
      };

      ws.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        if (resp.id === 1) {
          console.log('Result:', resp.result?.result?.value);
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}

testIndexWithPolyfill();
