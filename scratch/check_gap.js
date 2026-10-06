const http = require('http');
const { spawn } = require('child_process');

async function checkGap() {
  const port = 9599;
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
            method: 'Page.navigate',
            params: { url: 'http://127.0.0.1:5500/index.html' }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Emulation.setDeviceMetricsOverride',
              params: { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false }
            }));
            setTimeout(() => {
            const evalCode = `
              (() => {
                try {
                  const cta = document.getElementById('homeExploreCtaBar');
                  const sec = document.getElementById('home-care-explore');
                  const footer = document.getElementById('mainFooter');
                  const footerCard = document.querySelector('.footer-card');
                  if (!cta || !sec || !footer || !footerCard) {
                    return { error: 'elements not found', cta: !!cta, sec: !!sec, footer: !!footer, footerCard: !!footerCard };
                  }
                  const ctaRect = cta.getBoundingClientRect();
                  const secRect = sec.getBoundingClientRect();
                  const footerRect = footer.getBoundingClientRect();
                  const cardRect = footerCard.getBoundingClientRect();
                  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                  return {
                    ctaBottom: Math.round(ctaRect.bottom + scrollY),
                    secBottom: Math.round(secRect.bottom + scrollY),
                    footerTop: Math.round(footerRect.top + scrollY),
                    cardTop: Math.round(cardRect.top + scrollY),
                    gapFromCtaToFooterCard: Math.round(cardRect.top - ctaRect.bottom),
                    secPaddingBottom: window.getComputedStyle(sec).paddingBottom,
                    footerPaddingTop: window.getComputedStyle(footer).paddingTop,
                    footerMarginTop: window.getComputedStyle(footer).marginTop
                  };
                } catch(e) {
                  return { error: e.message };
                }
              })()
            `;
            ws.send(JSON.stringify({
              id: 3,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
            }, 800);
          }, 800);
        };
        ws.onmessage = (event) => {
          const resp = JSON.parse(event.data);
          if (resp.id === 3) {
            console.log('Result:', JSON.stringify(resp.result.result.value, null, 2));
            ws.close();
            chrome.kill();
            process.exit(0);
          }
        };
      });
    });
  }, 1800);
}

checkGap();
