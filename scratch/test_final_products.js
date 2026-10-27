const http = require('http');
const { spawn } = require('child_process');

async function testFinalProducts() {
  const port = 9891;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/products.html'
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
            id: 2,
            method: 'Runtime.evaluate',
            params: {
              expression: `({
                hasProductsQuickNav: !!document.getElementById('productsQuickNav'),
                hasQuickJumpText: document.body.innerText.includes('Quick Jump'),
                firstHeading: document.querySelector('h1')?.innerText,
                hasScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
              })`,
              returnByValue: true
            }
          }));
        };

        ws.onmessage = (e) => {
          console.log('Raw message:', e.data);
          ws.close();
          chrome.kill();
          resolve();
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

testFinalProducts().catch(console.error);
