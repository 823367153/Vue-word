const fs = require('fs');

const vueFile = 'e:\\zf_Word\\src\\views\\word\\index.vue';
let content = fs.readFileSync(vueFile, 'utf8');

const cssToAppend = `
/* Fix catalog overlapping tabs due to old hardcoded top: 60px */
.word-container-pro :deep(.catalog) {
  top: 90px !important; 
  height: calc(100vh - 90px - 30px) !important; 
}
.word-container-pro .catalog {
  top: 90px !important;
  height: calc(100vh - 90px - 30px) !important;
}

/* Fix content document gap (was margin: 80px causing too much empty space on top) */
.word-container-pro :deep(.editor > div) {
  margin: 20px auto 60px auto !important; 
}
.word-container-pro .editor > div {
  margin: 20px auto 60px auto !important;
}

/* Make editor flex container aware of new bounds */
.word-container-pro .editor {
  flex: 1;
  overflow-y: auto;
  position: relative;
}
`;

if (!content.includes('Fix catalog overlapping')) {
  // Insert before trailing </style>
  const insertIndex = content.lastIndexOf('</style>');
  if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + cssToAppend + content.slice(insertIndex);
    fs.writeFileSync(vueFile, content, 'utf8');
    console.log('Styles appended successfully.');
  } else {
    console.error('Could not find </style> tag.');
  }
} else {
  console.log('Styles already appended.');
}
