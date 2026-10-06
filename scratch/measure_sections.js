const http = require('http');
const { spawn } = require('child_process');

async function measure() {
  const port = 9533;
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
        const target = pages.find(p => p.type === 'page' && p.url.includes('5500')) || pages.find(p => p.type === 'page') || pages[0];
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        ws.onopen = () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
          }));
          setTimeout(() => {
            const evalCode = `
              (() => {
                const elements = Array.from(document.querySelectorAll('header, section, footer, main > *'));
                return elements.map(s => {
                  const rect = s.getBoundingClientRect();
                  const style = window.getComputedStyle(s);
                  return {
                    id: s.id || s.tagName,
                    top: Math.round(rect.top + window.scrollY),
                    bottom: Math.round(rect.bottom + window.scrollY),
                    height: Math.round(rect.height),
                    paddingTop: style.paddingTop,
                    paddingBottom: style.paddingBottom,
                    marginTop: style.marginTop,
                    marginBottom: style.marginBottom
                  };
                });
              })()
            `;
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 800);
        };
        ws.onmessage = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === 2) {
            console.log(JSON.stringify(resp.result.result.value, null, 2));
            ws.close();
            chrome.kill();
            process.exit(0);
          }
        };
      });
    });
  }, 1800);
}

measure();
