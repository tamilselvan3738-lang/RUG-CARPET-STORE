const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

async function test404() {
  const absPath = path.resolve('404.html').replace(/\\/g, '/');
  const port = 9620;
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
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
        setTimeout(() => {
          ws.close();
          chrome.kill();
          process.exit(0);
        }, 1500);
      };

      ws.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        if (resp.method === 'Runtime.exceptionThrown') {
          console.log('\n--- 404.HTML EXCEPTION ---');
          console.log(resp.params.exceptionDetails);
        }
      };
    });
  });
}

test404();
