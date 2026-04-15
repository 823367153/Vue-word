import JSZip from 'jszip';
import { ElementType, IElement, ListStyle, ListType, RowFlex, TitleLevel } from '../canvas-editor';

/**
 * 字体归一化映射表：将 Word 中的字体名称映射为编辑器兼容的名称
 */
const fontFamilyMap: Record<string, string> = {
  'SimSun': '宋体',
  'NSimSun': '新宋体',
  'SimHei': '黑体',
  'FangSong': '仿宋',
  'KaiTi': '楷体',
  'Microsoft YaHei': '微软雅黑',
  'STSong': '华文宋体',
  'STHeiti': '华文黑体',
  'STKaiti': '华文楷体',
  'STFangsong': '华文仿宋',
  'STXihei': '华文细黑',
  'STZhongsong': '华文中宋',
  'STHupo': '华文琥珀',
  'STCaiyun': '华文彩云',
  'STXingkai': '华文行楷',
  'STXinwei': '华文新魏',
  'STLiti': '华文隶书',
  'SimSun-ExtB': '宋体',
  '細明體': 'MingLiU',
  '新細明體': 'PMingLiU'
};

function normalizeFont(font: string | undefined): string | undefined {
  if (!font) return undefined;
  const cleanFont = font.replace(/['"]/g, '').trim();
  // 某些情况下 Word 会带 " (Body)" 或 " (Headings)"
  const baseFont = cleanFont.split('(')[0].trim();
  return fontFamilyMap[baseFont] || baseFont;
}

/**
 * 原生高精度 DOCX 解释器核心
 * 解析 word/document.xml 直接转化为 Canvas-Editor 的元素对象格式
 */
export async function parseDocxToElements(file: File): Promise<IElement[]> {
  const elements: IElement[] = [];
  const zip = await JSZip.loadAsync(file);

  const docData = await zip.file('word/document.xml')?.async('text');
  const relsData = await zip.file('word/_rels/document.xml.rels')?.async('text');

  if (!docData) throw new Error('Invalid DOCX: Missing word/document.xml');

  // 解析关联媒体文件以支持图片
  const mediaMap = new Map<string, string>(); // Id -> Target path
  const mediaBase64Map = new Map<string, string>(); // Target path -> Base64 Data URL

  const parser = new DOMParser();

  if (relsData) {
    const relsDoc = parser.parseFromString(relsData, 'text/xml');
    const rels = Array.from(relsDoc.getElementsByTagName('Relationship'));
    for (const rel of rels) {
      const id = rel.getAttribute('Id');
      const target = rel.getAttribute('Target');
      if (id && target && target.startsWith('media/')) {
        mediaMap.set(id, target);
      }
    }

    // 预先转码全部多媒体文件为 Base64 Data URL (更具自洽性且支持持久化)
    for (const target of Array.from(mediaMap.values())) {
      const imgFile = zip.file(`word/${target}`);
      if (imgFile) {
        const uint8Array = await imgFile.async('uint8array');
        // 核心修复：增加内容嗅探识别 SVG 格式，解决 docx 导出时可能误设后缀名（如 .png）的问题
        let mimeType = '';
        const header = new TextDecoder().decode(uint8Array.slice(0, 100));
        if (header.includes('<svg') || header.includes('<?xml')) {
          mimeType = 'image/svg+xml';
        } else {
          const ext = target.split('.').pop()?.toLowerCase();
          const mimeMap: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'bmp': 'image/bmp',
            'webp': 'image/webp'
          };
          mimeType = mimeMap[ext || ''] || 'application/octet-stream';
        }

        const base64 = await imgFile.async('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;
        mediaBase64Map.set(target, dataUrl);
      }
    }
  }

  // 解析样式表获取默认字体和样式定义
  const stylesData = await zip.file('word/styles.xml')?.async('text');
  const styleFontMap = new Map<string, string>(); // StyleId -> Font Name
  let defaultFont: string | undefined;

  if (stylesData) {
    const stylesDoc = parser.parseFromString(stylesData, 'text/xml');
    
    // 1. 提取文档默认字体 (DocDefaults)
    const rPrDefault = stylesDoc.getElementsByTagName('w:docDefaults')[0]?.getElementsByTagName('w:rPrDefault')[0];
    if (rPrDefault) {
      const fNode = rPrDefault.getElementsByTagName('w:rFonts')[0];
      if (fNode) {
        defaultFont = fNode.getAttribute('w:eastAsia') || fNode.getAttribute('w:ascii') || fNode.getAttribute('w:hAnsi') || undefined;
      }
    }

    // 2. 提取各样式定义的字体
    const styles = Array.from(stylesDoc.getElementsByTagName('w:style'));
    for (const style of styles) {
      const styleId = style.getAttribute('w:styleId');
      if (!styleId) continue;
      const rPr = getChildNode(style, 'w:rPr');
      if (rPr) {
        const fNode = getChildNode(rPr, 'w:rFonts');
        if (fNode) {
          const font = fNode.getAttribute('w:eastAsia') || fNode.getAttribute('w:ascii') || fNode.getAttribute('w:hAnsi') || undefined;
          if (font) styleFontMap.set(styleId, font);
        }
      }
    }
  }

  // 解析列表样式定义以准确恢复序号
  const numberingData = await zip.file('word/numbering.xml')?.async('text');
  // 记录层级定义：fmt, lvlText, start
  const abstractNumMap = new Map<string, Map<number, { fmt: string, lvlText: string, start: number }>>();
  const numIdToAbstractMap = new Map<string, string>();

  if (numberingData) {
    const numDoc = parser.parseFromString(numberingData, 'text/xml');
    const abstractNums = Array.from(numDoc.getElementsByTagName('w:abstractNum'));

    for (const abs of abstractNums) {
      const absId = abs.getAttribute('w:abstractNumId');
      if (!absId) continue;

      const levelsMap = new Map<number, { fmt: string, lvlText: string, start: number }>();
      const lvls = Array.from(abs.getElementsByTagName('w:lvl'));
      for (const lvl of lvls) {
        const ilvl = parseInt(lvl.getAttribute('w:ilvl') || '0');
        const numFmtNode = getChildNode(lvl, 'w:numFmt');
        const fmt = numFmtNode?.getAttribute('w:val') || 'decimal';
        const lvlTextNode = getChildNode(lvl, 'w:lvlText');
        const lvlText = lvlTextNode?.getAttribute('w:val') || '%1.';
        const startNode = getChildNode(lvl, 'w:start');
        const start = parseInt(startNode?.getAttribute('w:val') || '1');

        levelsMap.set(ilvl, { fmt, lvlText, start });
      }
      abstractNumMap.set(absId, levelsMap);
    }

    const nums = Array.from(numDoc.getElementsByTagName('w:num'));
    for (const num of nums) {
      const numId = num.getAttribute('w:numId');
      const absRef = getChildNode(num, 'w:abstractNumId');
      const absId = absRef?.getAttribute('w:val');
      if (numId && absId) {
        numIdToAbstractMap.set(numId, absId);
      }
    }
  }

  const xmlDoc = parser.parseFromString(docData, 'text/xml');
  const body = xmlDoc.getElementsByTagName('w:body')[0];
  if (!body) return elements;

  // 全局计数器：numId -> Map<ilvl, currentCount>
  const listCounterMap = new Map<string, Map<number, number>>();

  function parseNodes(nodes: NodeList | Node[]): IElement[] {
    const list: IElement[] = [];
    const nodeArray = Array.from(nodes);

    for (const wp of nodeArray) {
      if (wp.nodeName === 'w:p') {
        const pPr = getChildNode(wp, 'w:pPr');
        const pStyle = pPr?.querySelector('pStyle, w\\:pStyle')?.getAttribute('w:val');
        // 获取当前段落层级的字体（作为 Fallback）
        const pLevelFont = pStyle ? styleFontMap.get(pStyle) : undefined;
        
        // 加强标题识别：Heading 样式或手动识别为大号字标题
        const isTitleStyle = pStyle?.toLowerCase().includes('heading') || pStyle?.toLowerCase().includes('title');
        const numPr = pPr ? getChildNode(pPr, 'w:numPr') : null;

        const pElements = parseParagraph(wp as Element, pLevelFont);

        if (numPr && !isTitleStyle) {
          const numIdNode = getChildNode(numPr, 'w:numId');
          const numId = numIdNode?.getAttribute('w:val') || '1';
          const ilvlNode = getChildNode(numPr, 'w:ilvl');
          const ilvl = parseInt(ilvlNode?.getAttribute('w:val') || '0');

          const absId = numIdToAbstractMap.get(numId);
          const levelInfo = absId ? abstractNumMap.get(absId)?.get(ilvl) : null;

          if (levelInfo) {
            // 实现全视觉仿真模式：计算物理序号并手动注入
            if (!listCounterMap.has(numId)) listCounterMap.set(numId, new Map());
            const counters = listCounterMap.get(numId)!;
            const currentCount = (counters.get(ilvl) || (levelInfo.start - 1)) + 1;
            counters.set(ilvl, currentCount);

            // 1. 根据 fmt 计算序号内容
            let markerValue = '';
            const fmt = levelInfo.fmt;
            if (fmt === 'chineseCounting') {
              const cnUnits = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
              markerValue = cnUnits[currentCount - 1] || currentCount.toString();
            } else if (fmt === 'decimal') {
              markerValue = currentCount.toString();
            } else if (fmt === 'lowerLetter') {
              markerValue = String.fromCharCode(96 + currentCount);
            } else if (fmt === 'bullet') {
              markerValue = '●';
            } else {
              markerValue = currentCount.toString();
            }

            // 2. 使用 lvlText 模版生成最终前缀（例如 "%1." 变为 "1."）
            const prefix = levelInfo.lvlText.replace(`%${ilvl + 1}`, markerValue);

            // 3. 注入前缀：作为第一个原子元素
            const markerElement: IElement = {
              value: prefix + ' ',
              bold: true,
              font: normalizeFont(pLevelFont || defaultFont),
              indent: ilvl * 2
            };

            // 4. 将缩进应用到该段落所有元素，不再使用 LIST 类型以避免黑盒错误
            pElements.forEach(el => {
              el.indent = ilvl * 2;
            });

            list.push(markerElement, ...pElements);
            if (list[list.length - 1].value !== '\n') {
              list.push({ value: '\n', indent: ilvl * 2 });
            }
            continue;
          }
        }

        list.push(...pElements);
        if (pElements.length === 0 || pElements[pElements.length - 1].value !== '\n') {
          list.push({ value: '\n' });
        }
      } else if (wp.nodeName === 'w:tbl') {
        list.push(...parseTable(wp as Element));
      }
    }
    return list;
  }

  function parseTable(tbl: Element): IElement[] {
    const tableElement: IElement = {
      type: ElementType.TABLE,
      value: '\n',
      trList: []
    };

    const trs = Array.from(tbl.childNodes).filter(n => n.nodeName === 'w:tr');

    // 注入列宽设定
    let colgroups: { width: number }[] = [];
    const tblGrid = getChildNode(tbl, 'w:tblGrid');
    if (tblGrid) {
      const cols = Array.from(tblGrid.childNodes).filter(n => n.nodeName === 'w:gridCol');
      colgroups = cols.map(c => {
        const wStr = (c as Element).getAttribute('w:w') || '1000';
        // w:w 是基于 twips 的（1/20 磅），转 px：twips / 20 * 1.333 ≈ twips / 15
        return { width: Math.max(30, Math.round(parseInt(wStr) / 15)) };
      });
    }

    // 如果未获取到 tblGrid 宽度，则回退尝试读取第一行的所有 tcW (很多非严谨导出插件的做法)
    if (colgroups.length === 0 && trs.length > 0) {
      const firstRowTcs = Array.from(trs[0].childNodes).filter(n => n.nodeName === 'w:tc');
      firstRowTcs.forEach(tc => {
        const tcPr = getChildNode(tc, 'w:tcPr');
        const tcW = tcPr ? getChildNode(tcPr, 'w:tcW') : null;
        if (tcW) {
          const wStr = tcW.getAttribute('w:w') || '1000';
          colgroups.push({ width: Math.max(30, Math.round(parseInt(wStr) / 15)) });
        } else {
          colgroups.push({ width: 100 });
        }
      });
    }

    if (colgroups.length > 0) {
      tableElement.colgroup = colgroups;
    }

    // 第一遍提取所有行和合并格标记
    for (const tr of trs) {
      let trHeight = 42;
      const trPr = getChildNode(tr, 'w:trPr');
      if (trPr) {
        const hNode = getChildNode(trPr, 'w:trHeight');
        if (hNode && hNode.getAttribute('w:val')) {
          const rawHeight = parseInt(hNode.getAttribute('w:val')!);
          trHeight = Math.max(20, Math.round(rawHeight / 15));
        }
      }

      const rowItem: any = {
        height: trHeight,
        tdList: []
      };
      const tcs = Array.from(tr.childNodes).filter(n => n.nodeName === 'w:tc');

      for (const tc of tcs) {
        let colspan = 1;
        let rowspan = 1;
        let backgroundColor: string | undefined;
        let isVerticalRestart = false;
        let isVerticalContinue = false;

        const tcPr = getChildNode(tc, 'w:tcPr');
        if (tcPr) {
          const gridSpan = getChildNode(tcPr, 'w:gridSpan');
          if (gridSpan && gridSpan.getAttribute('w:val')) {
            colspan = parseInt(gridSpan.getAttribute('w:val')!) || 1;
          }
          const vMerge = getChildNode(tcPr, 'w:vMerge');
          if (vMerge) {
            const vMergeVal = vMerge.getAttribute('w:val');
            if (vMergeVal === 'restart') {
              isVerticalRestart = true;
            } else {
              isVerticalContinue = true;
            }
          } else if (getChildNode(tcPr, 'w:vMerge') || tcPr.querySelector('w\\:vMerge')) {
            // 某些情况下无 val 默认为 continue
            isVerticalContinue = true;
          }

          const shd = getChildNode(tcPr, 'w:shd');
          if (shd && shd.getAttribute('w:fill') && shd.getAttribute('w:fill') !== 'auto') {
            backgroundColor = '#' + shd.getAttribute('w:fill');
          }
        }

        const tdElements = parseNodes(tc.childNodes);
        if (tdElements.length === 0) tdElements.push({ value: '\n' });

        rowItem.tdList.push({
          colspan,
          rowspan,
          isVerticalRestart,
          isVerticalContinue,
          backgroundColor,
          value: tdElements
        });
      }
      tableElement.trList!.push(rowItem);
    }

    // 第二遍：计算跨行数 (rowspan)
    if (tableElement.trList) {
      for (let r = 0; r < tableElement.trList.length; r++) {
        const row = tableElement.trList[r];
        let logicColIndex = 0;
        for (let c = 0; c < row.tdList.length; c++) {
          const td = row.tdList[c];
          if (td.isVerticalRestart || (!td.isVerticalContinue && !td.isVerticalRestart && td.rowspan === 1)) {
            let spans = 1;
            // 沿着当前列往下检查是否有 continue 合并格
            for (let nr = r + 1; nr < tableElement.trList.length; nr++) {
              // 简单按索引查找对应位置（受复杂 colspan 影响可能需要二维矩阵，此处采用简化直接寻址）
              const nextTd = tableElement.trList[nr].tdList[c];
              if (nextTd && (nextTd.isVerticalContinue || nextTd.rowspan === 0)) {
                spans++;
              } else {
                break;
              }
            }
            td.rowspan = spans;
          }
          logicColIndex += (td.colspan || 1);
        }
      }

      // 第三遍：从每一列移除 isVerticalContinue 被融合掉的节点 (对应 HTML rowspan 行为)
      for (let r = 0; r < tableElement.trList.length; r++) {
        const row = tableElement.trList[r];
        row.tdList = row.tdList.filter((td: any) => !td.isVerticalContinue);
        for (const td of row.tdList) {
          delete (td as any).isVerticalRestart;
          delete (td as any).isVerticalContinue;
        }
      }
    }

    return [tableElement, { value: '\n' }];
  }

  function parseParagraph(wp: Element, pLevelFont?: string): IElement[] {
    const lineElements: IElement[] = [];

    // 1. 段落属性 (对齐, 大纲等级)
    const pPr = getChildNode(wp, 'w:pPr');
    let rowFlex: RowFlex = RowFlex.LEFT; // 默认为左对齐，根治自动居中问题
    let titleLevel: TitleLevel | undefined;
    let firstLineIndent: number = 0;
    let spacingBefore: number | undefined = undefined;
    let spacingAfter: number | undefined = undefined;
    let rowMargin: number | undefined = undefined;

    if (pPr) {
      const spacingNode = getChildNode(pPr, 'w:spacing');
      if (spacingNode) {
        const before = spacingNode.getAttribute('w:before');
        if (before) spacingBefore = Math.round(parseInt(before) / 20);
        const after = spacingNode.getAttribute('w:after');
        if (after) spacingAfter = Math.round(parseInt(after) / 20);
        const line = spacingNode.getAttribute('w:line');
        // Word line spacing (w:line) is relative to 240 twips = 1.0 (single line)
        if (line) rowMargin = Number((parseInt(line) / 240).toFixed(2));
      }
      const jc = getChildNode(pPr, 'w:jc');
      if (jc && jc.getAttribute('w:val')) {
        const val = jc.getAttribute('w:val');
        if (val === 'center') rowFlex = RowFlex.CENTER;
        else if (val === 'right') rowFlex = RowFlex.RIGHT;
        else if (val === 'both') rowFlex = RowFlex.ALIGNMENT;
      }

      const pStyle = getChildNode(pPr, 'w:pStyle');
      if (pStyle) {
        const val = pStyle.getAttribute('w:val') || '';
        const lowerVal = val.toLowerCase();

        // 增强模糊匹配：识别 Heading1, 标题 1, Heading 1 等变体
        if (lowerVal.includes('heading1') || lowerVal.includes('标题 1') || val === '1') titleLevel = TitleLevel.FIRST;
        else if (lowerVal.includes('heading2') || lowerVal.includes('标题 2') || val === '2') titleLevel = TitleLevel.SECOND;
        else if (lowerVal.includes('heading3') || lowerVal.includes('标题 3') || val === '3') titleLevel = TitleLevel.THIRD;
        else if (lowerVal.includes('heading4') || lowerVal.includes('标题 4') || val === '4') titleLevel = TitleLevel.FOURTH;
        else if (lowerVal.includes('heading5') || lowerVal.includes('标题 5') || val === '5') titleLevel = TitleLevel.FIFTH;
        else if (lowerVal.includes('heading6') || lowerVal.includes('标题 6') || val === '6') titleLevel = TitleLevel.SIXTH;
      }

      const ind = getChildNode(pPr, 'w:ind');
      if (ind) {
        const firstLine = ind.getAttribute('w:firstLine');
        if (firstLine) {
          // 假设一个字符约为 240 twips (对应 12pt/16px 字体)
          firstLineIndent = Math.round(parseInt(firstLine) / 240);
        }
      }
    }

    const runs = wp.childNodes;
    for (const r of Array.from(runs)) {
      if (r.nodeName !== 'w:r') continue;

      // 2. 块特征
      let color: string | undefined;
      let size: number | undefined;
      let font: string | undefined;
      let isBold = false;
      let isItalic = false;
      let isStrike = false;
      let isUnderline = false;

      const rPr = getChildNode(r, 'w:rPr');
      if (rPr) {
        const cNode = getChildNode(rPr, 'w:color');
        if (cNode && cNode.getAttribute('w:val') && cNode.getAttribute('w:val') !== 'auto') {
          color = '#' + cNode.getAttribute('w:val');
        }

        const szNode = getChildNode(rPr, 'w:sz');
        if (szNode && szNode.getAttribute('w:val')) {
          size = Math.round((parseInt(szNode.getAttribute('w:val')!) / 2) * 1.333);
        }

        const checkBool = (tagName: string) => {
          const node = getChildNode(rPr!, tagName);
          if (node) {
            const val = node.getAttribute('w:val');
            return val !== '0' && val !== 'false';
          }
          return false;
        };

        isBold = checkBool('w:b');
        isItalic = checkBool('w:i');
        isStrike = checkBool('w:strike');

        const uNode = getChildNode(rPr, 'w:u');
        if (uNode && uNode.getAttribute('w:val') !== 'none') isUnderline = true;

        const fNode = getChildNode(rPr, 'w:rFonts');
        if (fNode) {
          // 优先解析东亚字体（公文常见），回退到西音/hAnsi，甚至主题字体
          font = fNode.getAttribute('w:eastAsia') || 
                 fNode.getAttribute('w:ascii') || 
                 fNode.getAttribute('w:hAnsi') || 
                 fNode.getAttribute('w:eastAsiaTheme') || 
                 fNode.getAttribute('w:asciiTheme') || 
                 undefined;
        }
      }

      // 字体继承逻辑：Run级 -> 段落样式级 -> 文档默认级
      if (!font) font = pLevelFont || defaultFont;
      font = normalizeFont(font);

      // 遍历 w:r 内部所有可能是文本、空行或图片的元素
      const rChildren = Array.from(r.childNodes);
      for (const child of rChildren) {
        if (child.nodeName === 'w:t' && child.textContent) {
          const textVal = child.textContent;
          // Canvas Editor 0.0.x 版本的 DOCX 导出插件可能存在 Bug，将图片直接作为海量 Base64 文本输出到 w:t
          if (textVal.startsWith('data:image/') && textVal.includes('base64,')) {
            const blob = base64ToBlob(textVal);
            lineElements.push({
              type: ElementType.IMAGE,
              value: URL.createObjectURL(blob),
              width: 400, // 默认回退宽高
              height: 400
            });
          } else {
            lineElements.push({
              value: textVal,
              color,
              size,
              font,
              bold: isBold,
              italic: isItalic,
              strikeout: isStrike,
              underline: isUnderline
            });
          }
        } else if (child.nodeName === 'w:tab') {
          lineElements.push({
            value: '\t',
            color, size, font, bold: isBold, italic: isItalic, strikeout: isStrike, underline: isUnderline
          });
        } else if (child.nodeName === 'w:br') {
          lineElements.push({
            value: '\n',
            color, size, font, bold: isBold, italic: isItalic, strikeout: isStrike, underline: isUnderline
          });
        } else if (child.nodeName === 'w:drawing') {
          const extent = (child as Element).querySelector('extent, wp\\:extent');
          let width = 200, height = 200;
          if (extent) {
            const cx = parseInt(extent.getAttribute('cx') || '0');
            const cy = parseInt(extent.getAttribute('cy') || '0');
            if (cx) width = Math.round(cx * 96 / 914400);
            if (cy) height = Math.round(cy * 96 / 914400);
          }

          const blip = (child as Element).querySelector('blip, a\\:blip');
          if (blip) {
            const embedId = blip.getAttribute('r:embed');
            if (embedId && mediaMap.has(embedId)) {
              const targetFile = mediaMap.get(embedId)!;
              const b64 = mediaBase64Map.get(targetFile);
              if (b64) {
                lineElements.push({
                  type: ElementType.IMAGE,
                  value: b64,
                  width,
                  height
                });
              }
            }
          }
        }
      }
    }

    if (rowFlex !== undefined) {
      lineElements.forEach(el => { el.rowFlex = rowFlex; });
    }

    if (spacingBefore !== undefined) {
      lineElements.forEach(el => { (el as any).spacingBefore = spacingBefore; });
    }

    if (spacingAfter !== undefined) {
      lineElements.forEach(el => { (el as any).spacingAfter = spacingAfter; });
    }

    if (rowMargin !== undefined) {
      lineElements.forEach(el => { (el as any).rowMargin = rowMargin; });
    }

    if (firstLineIndent > 0) {
      lineElements.unshift({
        value: '\u3000'.repeat(firstLineIndent),
        extension: { isFirstLineIndent: true }
      } as any);
    }

    if (titleLevel) {
      return [
        {
          value: '',
          type: ElementType.TITLE,
          level: titleLevel,
          valueList: lineElements,
          rowFlex: rowFlex
        }
      ];
    } else {
      return lineElements;
    }
  }

  elements.push(...parseNodes(body.childNodes));
  return elements;
}

function getChildNode(parent: Node, nodeName: string): Element | null {
  const localName = nodeName.includes(':') ? nodeName.split(':')[1] : nodeName;
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as any;
    if (child.localName === localName || child.nodeName === nodeName) {
      return child as Element;
    }
  }
  return null;
}

function mapNumFmtToListStyle(fmt: string): { type: ListType, style: ListStyle } {
  switch (fmt) {
    case 'bullet':
      return { type: ListType.UL, style: ListStyle.DISC };
    case 'decimal':
      return { type: ListType.OL, style: ListStyle.DECIMAL };
    default:
      // 对于 alpha, roman 等暂不支持的样式，回退到 decimal 但保持为 ol
      return { type: ListType.OL, style: ListStyle.DECIMAL };
  }
}

function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const mime = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: mime });
}
