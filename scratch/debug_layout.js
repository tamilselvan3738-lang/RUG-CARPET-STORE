const http = require('http');
const { spawn } = require('child_process');

async function debugLayout() {
  const port = 9585;
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
        const target = pages.find(p => p.type === 'page' && p.url.includes('5500')) || pages[0];
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
                const cta = document.getElementById('homeExploreCtaBar');
                const ctaP = cta.querySelector('p');
                const sec = document.getElementById('home-care-explore');
                const main = document.querySelector('main');
                const footer = document.getElementById('mainFooter');
                const card = document.querySelector('.footer-card');
                const colHeader = card.querySelector('span'); // first span

                function getInfo(el, name) {
                  const r = el.getBoundingClientRect();
                  const s = window.getComputedStyle(el);
                  return {
                    name,
                    top: Math.round(r.top),
                    bottom: Math.round(r.bottom),
                    height: Math.round(r.height),
                    pt: s.paddingTop,
                    pb: s.paddingBottom,
                    mt: s.marginTop,
                    mb: s.marginBottom
                  };
                }

                return {
                  ctaP: getInfo(ctaP, 'ctaP'),
                  cta: getInfo(cta, 'cta'),
                  sec: getInfo(sec, 'sec'),
                  main: getInfo(main, 'main'),
                  footer: getInfo(footer, 'footer'),
                  card: getInfo(card, 'card'),
                  ctaToCardGap: Math.round(card.getBoundingClientRect().top - cta.getBoundingClientRect().bottom)
                };
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
            console.log(JSON.stringify(resp.result, null, 2));
            ws.close();
            chrome.kill();
            process.exit(0);
          }
        };
      });
    });
  }, 1800);
}

debugLayout();
