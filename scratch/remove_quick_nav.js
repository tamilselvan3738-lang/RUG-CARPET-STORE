const fs = require('fs');

let prod = fs.readFileSync('products.html', 'utf8');

// 1. Remove the entire section productsQuickNav
const navRegex = /\s*<!-- =+ -->\s*<!-- STICKY IN-PAGE QUICK NAVIGATION BAR & KEY ACTIONS -->\s*<!-- =+ -->\s*<section id="productsQuickNav"[\s\S]*?<\/section>/;

if (navRegex.test(prod)) {
  prod = prod.replace(navRegex, '');
  console.log('Removed productsQuickNav section successfully via regex 1!');
} else {
  // Fallback direct match
  const directMatch = /<section id="productsQuickNav"[\s\S]*?<\/section>/;
  if (directMatch.test(prod)) {
    prod = prod.replace(directMatch, '');
    console.log('Removed productsQuickNav section successfully via direct match!');
  } else {
    console.error('Could not find productsQuickNav section!');
  }
}

// Clean up duplicate comment
prod = prod.replace(
  '  <!-- Central semantic canvas -->\n    <!-- Central semantic canvas -->',
  '  <!-- Central semantic canvas -->'
);

// 2. Remove quickNav animation block in JS
const jsRegex = /\s*\/\/\s*Quick Nav & Header Animations\s*const quickNav = document\.getElementById\('productsQuickNav'\);\s*if \(quickNav\) \{\s*Motion\.animate\(quickNav, \{ y: \[-15, 0\], opacity: \[0, 1\] \}, \{ duration: 0\.5 \}\);\s*\}/;

if (jsRegex.test(prod)) {
  prod = prod.replace(jsRegex, '');
  console.log('Removed quickNav JS animation block!');
} else {
  console.log('Note: JS animation block not matched via exact regex, checking alternate pattern');
  prod = prod.replace(
    /const quickNav = document\.getElementById\('productsQuickNav'\);\s*if\s*\(quickNav\)\s*\{\s*Motion\.animate\([\s\S]*?\);\s*\}/,
    ''
  );
}

fs.writeFileSync('products.html', prod, 'utf8');
console.log('products.html saved!');
