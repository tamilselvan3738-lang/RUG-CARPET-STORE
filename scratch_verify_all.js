const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9455',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1280,950'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const tabs = await (await fetch('http://127.0.0.1:9455/json/list')).json();
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
    await new Promise(r => setTimeout(r, 2500));

    // Scroll to productsQuickNav with offset so it is visible below the header
    await send('Runtime.evaluate', {
      expression: `(() => {
        const qn = document.getElementById('productsQuickNav');
        const rect = qn.getBoundingClientRect();
        window.scrollBy(0, rect.top - 90);
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const ssNav = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/verified_quicknav.png', Buffer.from(ssNav.data, 'base64'));

    // Scroll to dossier form and make sure Motion animation has run
    await send('Runtime.evaluate', {
      expression: `(() => {
        const form = document.getElementById('dossierEnquiryForm');
        form.scrollIntoView({ block: 'center' });
        const vCol = document.getElementById('dossierVisualCol');
        const dCol = document.getElementById('dossierDetailsCol');
        if (vCol) vCol.style.opacity = '1';
        if (dCol) dCol.style.opacity = '1';
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const ssForm = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/verified_dossier_form.png', Buffer.from(ssForm.data, 'base64'));

    console.log('Screenshots captured successfully!');
    ws.close();
    chrome.kill();
    process.exit(0);
  };
}
run();
