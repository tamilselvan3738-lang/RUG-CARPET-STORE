const fs = require('fs');

const content = fs.readFileSync('products.html', 'utf8');

const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let m;
let scripts = [];
while ((m = regex.exec(content)) !== null) {
  scripts.push(m[1]);
}
const mainScript = scripts[scripts.length - 1];

// Test with real getElementById returning null when element is not in DOM
const sandbox = {
  lucide: { createIcons: () => {} },
  window: {
    addEventListener: () => {},
    location: { pathname: '/products.html' },
    innerWidth: 1400
  },
  document: {
    documentElement: { classList: { add: ()=>{}, remove: ()=>{} }, setAttribute: ()=>{} },
    body: { classList: { add: ()=>{}, remove: ()=>{} } },
    getElementById: (id) => {
      // Check if id actually exists in products.html
      if (content.includes(`id="${id}"`)) {
        return {
          addEventListener: () => {},
          classList: { add: ()=>{}, remove: ()=>{}, contains: ()=>false },
          setAttribute: () => {},
          style: {},
          textContent: '',
          value: ''
        };
      }
      return null;
    },
    querySelectorAll: (sel) => [],
    querySelector: (sel) => null,
    addEventListener: () => {}
  },
  console: console
};

try {
  const fn = new Function('lucide', 'window', 'document', 'console', mainScript);
  fn(sandbox.lucide, sandbox.window, sandbox.document, sandbox.console);
  console.log('Main script executed with real element IDs without throwing!');
} catch (e) {
  console.log('RUNTIME ERROR when getElementById returns null for missing elements:', e.message);
  console.log(e.stack);
}
