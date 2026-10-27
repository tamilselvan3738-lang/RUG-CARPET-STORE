const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

async function testMotionSpring() {
  const absPath = path.resolve('products.html').replace(/\\/g, '/');
  const port = 9591;
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
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `
              ({
                type: typeof window.Motion.spring,
                fnStr: window.Motion.spring.toString(),
                callRes: window.Motion.spring({ stiffness: 220, damping: 22 })
              })
            `,
            returnByValue: true
          }
        }));
      };

      ws.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        if (resp.id === 1) {
          console.log('Motion.spring info:', resp.result?.result?.value);
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}

testMotionSpring();
