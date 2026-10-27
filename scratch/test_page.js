const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

async function testPage(file) {
  const absPath = path.resolve(file).replace(/\\/g, '/');
  const port = 9588;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    'file:///' + absPath
  ]);

  await new Promise(r => setTimeout(r, 1600));

  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const pages = JSON.parse(d);
        const target = pages.find(x => x.type === 'page');
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        const exceptions = [];

        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          setTimeout(() => {
            ws.close();
            chrome.kill();
            console.log(`[${file}] Tested - Exceptions: ${exceptions.length}`);
            resolve(exceptions);
          }, 1500);
        };

        ws.onmessage = (msg) => {
          const resp = JSON.parse(msg.data);
          if (resp.method === 'Runtime.exceptionThrown') {
            exceptions.push(resp.params.exceptionDetails.text);
            console.log(`[${file} EXCEPTION]:`, resp.params.exceptionDetails.text);
          }
        };
      });
    });
  });
}

async function run() {
  await testPage('index.html');
  await testPage('products.html');
  await testPage('collections.html');
  process.exit(0);
}

run();
