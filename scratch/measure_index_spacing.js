const http = require('http');
const { spawn } = require('child_process');

async function measureIndex() {
  const port = 9593;
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    'http://127.0.0.1:5500/index.html'
  ]);

  await new Promise(r => setTimeout(r, 1000));

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
            id: 1,
            method: 'Emulation.setDeviceMetricsOverride',
            params: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }
          }));

          setTimeout(() => {
            const evalCode = `
              (() => {
                const results = [];
                const sections = Array.from(document.querySelectorAll('section, footer'));
                for (let i = 0; i < sections.length; i++) {
                  const s = sections[i];
                  const rect = s.getBoundingClientRect();
                  const style = window.getComputedStyle(s);
                  results.push({
                    id: s.id || s.tagName,
                    top: Math.round(rect.top + window.scrollY),
                    bottom: Math.round(rect.bottom + window.scrollY),
                    height: Math.round(rect.height),
                    paddingTop: style.paddingTop,
                    paddingBottom: style.paddingBottom,
                    marginTop: style.marginTop,
                    marginBottom: style.marginBottom
                  });
                }
                
                const cta = document.getElementById('homeExploreCtaBar');
                const ctaRect = cta ? cta.getBoundingClientRect() : null;
                const footerCard = document.querySelector('.footer-card');
                const footerCardRect = footerCard ? footerCard.getBoundingClientRect() : null;
                
                const heroLeft = document.getElementById('homeHeroPillarsCol');
                const heroRight = document.getElementById('homeHeroVisualCol');
                const heroLeftRect = heroLeft ? heroLeft.getBoundingClientRect() : null;
                const heroRightRect = heroRight ? heroRight.getBoundingClientRect() : null;

                return {
                  sections: results,
                  ctaBottom: ctaRect ? Math.round(ctaRect.bottom + window.scrollY) : null,
                  footerCardTop: footerCardRect ? Math.round(footerCardRect.top + window.scrollY) : null,
                  ctaToFooterGap: (footerCardRect && ctaRect) ? Math.round(footerCardRect.top - ctaRect.bottom) : null,
                  heroLeft: heroLeftRect ? { height: Math.round(heroLeftRect.height), top: Math.round(heroLeftRect.top), bottom: Math.round(heroLeftRect.bottom) } : null,
                  heroRight: heroRightRect ? { height: Math.round(heroRightRect.height), top: Math.round(heroRightRect.top), bottom: Math.round(heroRightRect.bottom) } : null
                };
              })()
            `;
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: { expression: evalCode, returnByValue: true }
            }));
          }, 600);
        };

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data);
          if (resp.id === 2) {
            const val = resp.result && resp.result.result ? resp.result.result.value : resp;
            console.log(JSON.stringify(val, null, 2));
            ws.close();
            chrome.kill();
            resolve();
          }
        };
      });
    }).on('error', (err) => {
      chrome.kill();
      reject(err);
    });
  });
}

measureIndex().catch(console.error);
