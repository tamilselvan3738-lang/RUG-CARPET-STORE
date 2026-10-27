const { execSync } = require('child_process');

try {
  const showLogin = execSync('git show 7643db4:login.html', { encoding: 'utf8' });
  const cardMatch = showLogin.match(/id="loginCard"[\s\S]*?>/);
  console.log('7643db4 loginCard:', cardMatch ? cardMatch[0] : 'not found');
  
  const widthMatches = showLogin.match(/max-w-[^\s"'>]+/g) || [];
  console.log('7643db4 max-w classes in login.html:', Array.from(new Set(widthMatches)));

  const showReg = execSync('git show 7643db4:registeration.html', { encoding: 'utf8' });
  const regCardMatch = showReg.match(/id="registerCard"[\s\S]*?>/);
  console.log('7643db4 registerCard:', regCardMatch ? regCardMatch[0] : 'not found');
} catch (e) {
  console.error(e.message);
}
