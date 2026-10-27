const { spawn } = require('child_process');
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9447',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1200,900'
]);

async function check() {
  await new Promise(r => setTimeout(r, 1200));
  const tabs = await (await fetch('http://127.0.0.1:9447/json/list')).json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
      const curId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg);
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

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('#dossierEnquiryForm button, #dossierEnquiryForm a'));
        const btn = btns[0];
        if (!btn) return { error: 'btn not found', formFound: !!document.querySelector('#dossierEnquiryForm') };
        const s = window.getComputedStyle(btn);
        const p = window.getComputedStyle(btn.parentElement);
        return {
          btnStyle: {
            width: s.width,
            height: s.height,
            flex: s.flex,
            flexGrow: s.flexGrow,
            flexShrink: s.flexShrink,
            flexBasis: s.flexBasis,
            minWidth: s.minWidth,
            maxWidth: s.maxWidth,
            padding: s.padding,
            border: s.border,
            display: s.display,
            position: s.position,
            boxSizing: s.boxSizing
          },
          parentStyle: {
            display: p.display,
            flexDirection: p.flexDirection,
            alignItems: p.alignItems,
            justifyContent: p.justifyContent,
            width: p.width,
            height: p.height
          },
          btnInnerHTML: btn.innerHTML
        };
      })()`,
      returnByValue: true
    });

    console.log('FULL RES:', JSON.stringify(res, null, 2));
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
check();
