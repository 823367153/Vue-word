const fs = require('fs');

const file = 'e:\\zf_Word\\src\\views\\word\\official-ui\\menu-bindings.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace catalog mode binding
content = content.replace(
  `  const catalogModeDom =
    document.querySelector<HTMLDivElement>('.catalog-mode')!`,
  `  const catalogModeDoms = document.querySelectorAll<HTMLDivElement>('.catalog-mode')!`
);

content = content.replace(
  `  catalogModeDom.onclick = switchCatalog`,
  `  catalogModeDoms.forEach(dom => { dom.onclick = switchCatalog; })`
);

// Replace scale percentage click binding
content = content.replace(
  `  document.querySelector<HTMLDivElement>('.page-scale-percentage')!.onclick =
    function () {
      console.log('page-scale-recovery')
      instance.command.executePageScaleRecovery()
    }`,
  `  document.querySelectorAll<HTMLDivElement>('.page-scale-percentage').forEach(dom => {
    dom.onclick = function () {
      console.log('page-scale-recovery')
      instance.command.executePageScaleRecovery()
    }
  })`
);

// Replace minus click binding
content = content.replace(
  `  document.querySelector<HTMLDivElement>('.page-scale-minus')!.onclick =
    function () {
      console.log('page-scale-minus')
      instance.command.executePageScaleMinus()
    }`,
  `  document.querySelectorAll<HTMLDivElement>('.page-scale-minus').forEach(dom => {
    dom.onclick = function () {
      console.log('page-scale-minus')
      instance.command.executePageScaleMinus()
    }
  })`
);

// Replace add click binding
content = content.replace(
  `  document.querySelector<HTMLDivElement>('.page-scale-add')!.onclick =
    function () {
      console.log('page-scale-add')
      instance.command.executePageScaleAdd()
    }`,
  `  document.querySelectorAll<HTMLDivElement>('.page-scale-add').forEach(dom => {
    dom.onclick = function () {
      console.log('page-scale-add')
      instance.command.executePageScaleAdd()
    }
  })`
);

// Replace listener update
content = content.replace(
  `  // 监听
  instance.listener.pageScaleChange = function (payload: any) {
    document.querySelector<HTMLSpanElement>(
      '.page-scale-percentage'
    )!.innerText = \`\${Math.floor(payload * 10 * 10)}%\`
  }`,
  `  // 监听
  instance.listener.pageScaleChange = function (payload: any) {
    document.querySelectorAll<HTMLSpanElement>(
      '.page-scale-percentage'
    ).forEach(dom => { dom.innerText = \`\${Math.floor(payload * 10 * 10)}%\` })
  }`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Patch complete.');
