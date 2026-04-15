const fs = require('fs');

const file = 'e:\\zf_Word\\src\\views\\word\\index.vue';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace("import docxPlugin from '@hufe921/canvas-editor-plugin-docx';", "import { exportDocx } from './utils/docxExport';\n  import { importDocx } from './utils/docxImport';");

// Remove plugin load
content = content.replace(/\s*\/\/ load plugin\s*instance\.use\(docxPlugin\);/, '');

// Replace export
const oldExport = /const handleExportWord = \(\) => \{[\s\S]*?\n  \};/;
const newExport = `const handleExportWord = () => {
    if (!instance) return;
    exportDocx(instance);
  };`;
content = content.replace(oldExport, newExport);

// Replace import
const oldImport = /const handleImportWord = \(e: Event\) => \{[\s\S]*?\n  \};/;
const newImport = `const handleImportWord = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file || !instance) return;
    importDocx(file, instance);
    (e.target as HTMLInputElement).value = '';
  };`;
content = content.replace(oldImport, newImport);

fs.writeFileSync(file, content, 'utf8');
console.log('index.vue integrated successfully.');
