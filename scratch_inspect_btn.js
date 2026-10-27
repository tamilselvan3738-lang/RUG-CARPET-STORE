const { spawn } = require('child_process');
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9445',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1200,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const listRes = await fetch('http://127.0.0.1:9445/json/list');
  const tabs = await listRes.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

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
        const btn = document.querySelector('#dossierEnquiryForm button[type="submit"]');
        const parent = btn.parentElement;
        const form = document.querySelector('#dossierEnquiryForm');
        
        function getInfo(el) {
          const s = window.getComputedStyle(el);
          return {
            tagName: el.tagName,
            className: el.className,
            width: el.offsetWidth,
            height: el.offsetHeight,
            flex: s.flex,
            flexDirection: s.flexDirection,
            alignItems: s.alignItems,
            justifyContent: s.justifyContent,
            display: s.display,
            boxSizing: s.boxSizing,
            overflow: s.overflow,
            minWidth: s.minWidth,
            maxWidth: s.maxWidth
          };
        }

        return {
          btn: getInfo(btn),
          parent: getInfo(parent),
          form: getInfo(form),
          childrenOfParent: Array.from(parent.children).map(c => ({
            tag: c.tagName,
            text: c.innerText.trim(),
            rect: c.getBoundingClientRect()
          }))
        };
      })()`,
      returnByValue: true
    });

    console.log('BTN INFO:', JSON.stringify(evalRes.result.value, null, 2));
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
run();
