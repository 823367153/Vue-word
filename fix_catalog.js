const fs = require('fs');

const file = 'e:\\zf_Word\\src\\views\\word\\official-ui\\menu-bindings.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const catalogModeDom =([\s\S]*?)document\.querySelector<HTMLDivElement>\('\.catalog-mode'\)!/g, `const catalogModeDoms =$1document.querySelectorAll<HTMLDivElement>('.catalog-mode')!`);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed undefined catalogModeDoms');
