const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9461',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1280,800'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const tabs = await (await fetch('http://127.0.0.1:9461/json/list')).json();
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

    // Scroll down 200px so productsQuickNav sticks right below the main navbar
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 200);`
    });
    await new Promise(r => setTimeout(r, 500));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/verified_quicknav_sticky.png', Buffer.from(ss.data, 'base64'));

    console.log('Saved verified_quicknav_sticky.png');
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
run();
