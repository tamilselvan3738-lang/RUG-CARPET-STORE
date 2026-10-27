const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

async function testWithWait() {
  const absPath = path.resolve('products.html').replace(/\\/g, '/');
  const fileUrl = 'file:///' + absPath;
  const port = 9584;
  
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
        // Wait 1.5 seconds for all CDN scripts to load and DOMContentLoaded to fire
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `
                ({
                  hasOpenModal: typeof openProductDetails === 'function',
                  hasCloseModal: typeof closeQuickViewModal === 'function',
                  hasFilter: typeof filterCatalogBy === 'function',
                  hasQuickShop: typeof quickShopProduct === 'function'
                })
              `,
              returnByValue: true
            }
          }));
        }, 1500);
      };

      ws.onmessage = (msg) => {
        const resp = JSON.parse(msg.data);
        if (resp.id === 1) {
          console.log('Functions check in real browser:', resp.result?.result?.value);
          ws.close();
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}

testWithWait();
