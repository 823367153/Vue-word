const fs = require('fs');

const file = 'e:\\zf_Word\\src\\views\\word\\official-ui\\menu-bindings.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace page-scale-percentage click
content = content.replace(
  /document\.querySelector<HTMLDivElement>\('\.page-scale-percentage'\)!\.onclick\s*=\s*(function \(\) {[\s\S]*?instance\.command\.executePageScaleRecovery\(\)[\s\S]*?})/,
  `document.querySelectorAll<HTMLDivElement>('.page-scale-percentage').forEach(dom => {
    dom.onclick = $1;
  })`
);

// Replace page-scale-minus click
content = content.replace(
  /document\.querySelector<HTMLDivElement>\('\.page-scale-minus'\)!\.onclick\s*=\s*(function \(\) {[\s\S]*?instance\.command\.executePageScaleMinus\(\)[\s\S]*?})/,
  `document.querySelectorAll<HTMLDivElement>('.page-scale-minus').forEach(dom => {
    dom.onclick = $1;
  })`
);

// Replace page-scale-add click
content = content.replace(
  /document\.querySelector<HTMLDivElement>\('\.page-scale-add'\)!\.onclick\s*=\s*(function \(\) {[\s\S]*?instance\.command\.executePageScaleAdd\(\)[\s\S]*?})/,
  `document.querySelectorAll<HTMLDivElement>('.page-scale-add').forEach(dom => {
    dom.onclick = $1;
  })`
);

console.log('Writing patched content...');
fs.writeFileSync(file, content, 'utf8');
