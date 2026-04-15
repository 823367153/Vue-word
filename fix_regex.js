const fs = require('fs');

const file = 'e:\\zf_Word\\src\\views\\word\\index.vue';
let content = fs.readFileSync(file, 'utf8');

const brokenCode = `const handleExportWord = () => {
    if (!instance) return;
    exportDocx(instance);
  };
  reader.readAsArrayBuffer(file);
  (e.target as HTMLInputElement).value = '';
};`;

// Also handle CRLF if needed
const regex = /const handleExportWord = \(\) => \{[\s\S]*?reader\.readAsArrayBuffer\(file\);\s*\(\w\.target as HTMLInputElement\)\.value = '';\s*\};/;

const fixedCode = `const handleExportWord = () => {
  if (!instance) return;
  exportDocx(instance);
};

const handleImportWord = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !instance) return;
  importDocx(file, instance);
  (e.target as HTMLInputElement).value = '';
};`;

if (regex.test(content)) {
  content = content.replace(regex, fixedCode);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed broken script tags.');
} else {
  console.log('Could not match regex.');
}
