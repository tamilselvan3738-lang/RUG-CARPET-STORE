const { spawn } = require('child_process');
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9462',
  '--disable-gpu',
  '--no-sandbox'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const tabs = await (await fetch('http://127.0.0.1:9462/json/list')).json();
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

    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const qn = document.getElementById('productsQuickNav');
        const main = document.querySelector('main');
        const prev = qn.previousElementSibling;
        const parent = qn.parentElement;
        return {
          qnOffsetTop: qn.offsetTop,
          qnOffsetHeight: qn.offsetHeight,
          mainOffsetTop: main.offsetTop,
          parentTag: parent.tagName,
          parentClass: parent.className,
          computedTop: window.getComputedStyle(qn).top,
          computedPosition: window.getComputedStyle(qn).position,
          zIndex: window.getComputedStyle(qn).zIndex
        };
      })()`,
      returnByValue: true
    });

    console.log('RES:', JSON.stringify(res, null, 2));
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
run();
