const fs = require('fs');

const vueFile = 'e:\\zf_Word\\src\\views\\word\\index.vue';
const bindFile = 'e:\\zf_Word\\src\\views\\word\\official-ui\\menu-bindings.ts';

const vueContent = fs.readFileSync(vueFile, 'utf8');
const bindContent = fs.readFileSync(bindFile, 'utf8');

const regex = /querySelector[All]*<[^>]+>\s*\(\s*['"]([^'"]+)['"]\s*\)\s*!/g;
let match;
let missing = [];

while ((match = regex.exec(bindContent)) !== null) {
  const selector = match[1];
  if (selector.startsWith('.')) {
    const className = selector.slice(1);
    if (!vueContent.includes(`class="${className}"`) && !vueContent.includes(`class="${className} `) && !vueContent.includes(` ${className}"`)) {
      missing.push(selector);
    }
  } else if (selector.startsWith('#')) {
    const id = selector.slice(1);
    if (!vueContent.includes(`id="${id}"`)) {
      missing.push(selector);
    }
  }
}

console.log('Missing selectors:', missing);
