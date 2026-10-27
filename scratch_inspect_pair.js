const { spawn } = require('child_process');
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9448',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1200,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const tabs = await (await fetch('http://127.0.0.1:9448/json/list')).json();
  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  ws.onopen = async () => {
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'file:///d:/Projects/RUG%20&%20CARPET%20STORE/products.html' });
    await new Promise(r => setTimeout(r, 2000));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.querySelector('#dossierEnquiryForm');
        const btn1 = form.querySelector('button[type="submit"]');
        const btn2 = form.querySelector('a');

        const btn2 = form.querySelector('a');
        const matched = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const r of sheet.cssRules) {
              if (r.selectorText && btn2.matches(r.selectorText)) {
                matched.push(r.cssText);
              }
              if (r.cssRules) {
                for (const sub of r.cssRules) {
                  if (sub.selectorText && btn2.matches(sub.selectorText)) {
                    matched.push(sub.cssText);
                  }
                }
              }
            }
          } catch(e) {}
        }
        return { matched, width: window.getComputedStyle(btn2).width };
      })()`,
      returnByValue: true
    });

    console.log('BTN1 & BTN2 COMPUTED:', JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
run();
