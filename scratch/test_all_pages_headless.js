const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const allHtmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

async function testPage(file, port) {
  const absPath = path.resolve(file).replace(/\\/g, '/');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    'file:///' + absPath
  ]);

  await new Promise(r => setTimeout(r, 1800));

  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const pages = JSON.parse(d);
          const target = pages.find(x => x.type === 'page');
          const ws = new WebSocket(target.webSocketDebuggerUrl);
          const exceptions = [];

          ws.onopen = () => {
            ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
            setTimeout(() => {
              ws.close();
              chrome.kill();
              resolve({ file, exceptions });
            }, 1200);
          };

          ws.onmessage = (msg) => {
            const resp = JSON.parse(msg.data);
            if (resp.method === 'Runtime.exceptionThrown') {
              exceptions.push(resp.params.exceptionDetails.text);
            }
          };
        } catch (e) {
          chrome.kill();
          resolve({ file, exceptions: [e.message] });
        }
      });
    }).on('error', (err) => {
      chrome.kill();
      resolve({ file, exceptions: [err.message] });
    });
  });
}

async function runAll() {
  console.log(`Testing all ${allHtmlFiles.length} HTML files...`);
  let totalErrors = 0;
  let port = 9630;

  for (const file of allHtmlFiles) {
    const res = await testPage(file, port++);
    if (res.exceptions.length > 0) {
      console.log(`❌ [${file}] had ${res.exceptions.length} exception(s):`, res.exceptions);
      totalErrors += res.exceptions.length;
    } else {
      console.log(`✓ [${file}] passed with 0 exceptions`);
    }
  }

  console.log(`\n================================`);
  console.log(`All files tested. Total exceptions: ${totalErrors}`);
  console.log(`================================`);
  process.exit(totalErrors === 0 ? 0 : 1);
}

runAll();
