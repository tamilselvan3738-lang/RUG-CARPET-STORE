const fs = require('fs');

// Fix login.html
let login = fs.readFileSync('login.html', 'utf8');

// Replace 1024px section padding and add #loginCard max-width
login = login.replace(
  /@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{\s*padding-top:\s*5\.5rem\s*!important;\s*padding-bottom:\s*5\.5rem\s*!important;\s*\}\s*\}/,
  `@media (min-width: 1024px) {
      section {
        padding-top: 3.5rem !important;
        padding-bottom: 3.5rem !important;
      }
      #loginCard {
        max-width: 330px !important;
        padding: 1.25rem 1.25rem !important;
      }
    }`
);

// Update loginCard element classes
login = login.replace(
  'id="loginCard" class="login-glass-card rounded-[22px] sm:rounded-[24px] w-full max-w-[365px] p-4 sm:p-5 space-y-3 relative transition-all duration-300"',
  'id="loginCard" class="login-glass-card rounded-[22px] sm:rounded-[24px] w-full max-w-[350px] lg:max-w-[330px] p-4 sm:p-5 lg:p-5 space-y-3 relative transition-all duration-300"'
);

fs.writeFileSync('login.html', login, 'utf8');
console.log('login.html updated!');

// Fix registeration.html
let reg = fs.readFileSync('registeration.html', 'utf8');

reg = reg.replace(
  /@media\s*\(min-width:\s*1024px\)\s*\{\s*section\s*\{\s*padding-top:\s*5\.5rem\s*!important;\s*padding-bottom:\s*5\.5rem\s*!important;\s*\}\s*\}/,
  `@media (min-width: 1024px) {
      section {
        padding-top: 3.5rem !important;
        padding-bottom: 3.5rem !important;
      }
      #registerCard {
        max-width: 380px !important;
        padding: 1.25rem 1.5rem !important;
      }
    }`
);

// Update registerCard element classes
reg = reg.replace(
  'id="registerCard" class="login-glass-card rounded-[26px] sm:rounded-[28px] w-full max-w-[430px] p-6 sm:p-7 space-y-4 relative transition-all duration-300"',
  'id="registerCard" class="login-glass-card rounded-[26px] sm:rounded-[28px] w-full max-w-[410px] lg:max-w-[380px] p-5 sm:p-6 lg:p-6 space-y-3.5 relative transition-all duration-300"'
);

fs.writeFileSync('registeration.html', reg, 'utf8');
console.log('registeration.html updated!');

// Also write identical copy to registration.html
fs.writeFileSync('registration.html', reg, 'utf8');
console.log('registration.html mirrored!');
