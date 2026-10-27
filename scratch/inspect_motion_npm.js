const https = require('https');

https.get('https://cdn.jsdelivr.net/npm/motion@11.11.17/dist/motion.js', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('Downloaded motion.js, length:', data.length);
    const window = {};
    const fn = new Function('window', data);
    fn(window);
    console.log('window.Motion keys:', Object.keys(window.Motion));
    console.log('window.Motion.spring:', typeof window.Motion.spring);
    if (typeof window.Motion.spring === 'function') {
      try {
        const res = window.Motion.spring({ stiffness: 220, damping: 22 });
        console.log('spring() call result:', res);
      } catch(e) {
        console.log('spring() error:', e.message);
      }
    }
  });
});
