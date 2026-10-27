const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9444',
  '--disable-gpu',
  '--no-sandbox',
  '--window-size=1200,900'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
  const listRes = await fetch('http://127.0.0.1:9444/json/list');
  const tabs = await listRes.json();
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

    // Wait 2.5s for page to render and scripts to run
    await new Promise(r => setTimeout(r, 2500));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const catButtons = Array.from(document.querySelectorAll('#prod-categories .prod-card-glass')).map(c => {
          return Array.from(c.querySelectorAll('button, a')).map(b => ({
            text: b.innerText.replace(/\\s+/g, ' ').trim(),
            width: b.offsetWidth,
            height: b.offsetHeight
          }));
        });

        const formButtons = Array.from(document.querySelectorAll('#dossierEnquiryForm button, #dossierEnquiryForm a')).map(b => {
          const s = window.getComputedStyle(b);
          const p = window.getComputedStyle(b.parentElement);
          return {
            tag: b.tagName,
            text: b.innerText.replace(/\\s+/g, ' ').trim(),
            width: b.offsetWidth,
            height: b.offsetHeight,
            computedWidth: s.width,
            computedHeight: s.height,
            flex: s.flex,
            parentFlexDir: p.flexDirection,
            parentAlignItems: p.alignItems,
            parentWidth: p.width,
            parentHeight: p.height
          };
        });

        const pillsEl = document.querySelector('#productsQuickNav > div > div:first-child');
        const actionsEl = document.querySelector('#productsQuickNav > div > div:last-child');
        const navWrap = {
          containerWidth: document.querySelector('#productsQuickNav > div')?.offsetWidth,
          pillsRect: pillsEl?.getBoundingClientRect(),
          actionsRect: actionsEl?.getBoundingClientRect()
        };

        return { catButtons, formButtons, navWrap };
      })()`,
      returnByValue: true
    });

    console.log('RESULTS:', JSON.stringify(evalRes.result.value, null, 2));

    // Scroll to quick nav and capture
    await send('Runtime.evaluate', { expression: `document.getElementById('productsQuickNav').scrollIntoView();` });
    await new Promise(r => setTimeout(r, 500));
    const ssNav = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/fixed_quicknav.png', Buffer.from(ssNav.data, 'base64'));

    // Scroll to categories and capture
    await send('Runtime.evaluate', { expression: `document.getElementById('prod-categories').scrollIntoView();` });
    await new Promise(r => setTimeout(r, 500));
    const ssCat = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/fixed_categories.png', Buffer.from(ssCat.data, 'base64'));

    // Scroll directly to dossier form and capture
    await send('Runtime.evaluate', {
      expression: `document.getElementById('dossierEnquiryForm').scrollIntoView({ block: 'center' });`
    });
    await new Promise(r => setTimeout(r, 600));

    const ssForm = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Tamiluuu/.gemini/antigravity/brain/75b8aa23-7509-4be0-915c-bc68073b0a30/fixed_dossier_form.png', Buffer.from(ssForm.data, 'base64'));

    ws.close();
    chrome.kill();
    process.exit(0);
  };
}

run().catch(err => {
  console.error(err);
  chrome.kill();
  process.exit(1);
});
