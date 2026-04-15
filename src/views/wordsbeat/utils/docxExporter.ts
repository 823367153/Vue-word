import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  VerticalAlign,
  HeadingLevel
} from 'docx';
import { ElementType, IElement, ListType, RowFlex, TitleLevel } from '../canvas-editor';

/**
 * 将 Canvas-Editor 的元素数组导出为真实的 DOCX 文件
 */
export async function exportDocxFile(elements: IElement[], fileName: string) {
  try {
    const children = await elementsToDocxChildren(elements);

    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'default-decimal',
            levels: Array.from({ length: 9 }, (_, i) => ({
              level: i,
              format: 'decimal',
              text: `%${i + 1}.`,
              alignment: 'left',
              style: {
                paragraph: {
                  indent: { left: 720 * (i + 1), hanging: 360 },
                },
              },
            })),
          },
          {
            reference: 'default-bullet',
            levels: Array.from({ length: 9 }, (_, i) => ({
              level: i,
              format: 'bullet',
              text: '●',
              alignment: 'left',
              style: {
                paragraph: {
                  indent: { left: 720 * (i + 1), hanging: 360 },
                },
              },
            })),
          },
        ],
      },
      sections: [{
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('【docxExporter】导出过程中发生错误:', err);
    throw err;
  }
}

async function elementsToDocxChildren(elements: IElement[]): Promise<any[]> {
  if (!elements || !Array.isArray(elements)) return [];

  const results: any[] = [];
  let currentRuns: any[] = [];

  // 状态变量记录当前段落的属性
  let pAlignment: any = undefined;
  let pIndent: any = undefined;
  let pHeading: any = undefined;
  let pSpacingBefore: number | undefined = undefined;
  let pSpacingAfter: number | undefined = undefined;
  let pRowMargin: number | undefined = undefined;

  // 1. 预处理：将包含换行符的文字块进行预先拆分，确保主循环逻辑扁平化
  const flatElements: IElement[] = [];
  for (const el of elements) {
    const val = typeof el.value === 'string' ? el.value : '';
    if (val.length > 1 && (val.includes('\n') || val.includes('\r\n'))) {
      const lines = val.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        if (lines[i]) flatElements.push({ ...el, value: lines[i] });
        if (i < lines.length - 1) flatElements.push({ ...el, value: '\n' });
      }
    } else {
      flatElements.push(el);
    }
  }

  let isNewParagraph = true; // 标记是否为新行开头，用于探测模拟缩进

  for (let i = 0; i < flatElements.length; i++) {
    const el = flatElements[i];
    const elType = el.type || 'text';

    // 探测方案 B 的标记位缩进 (最高优先级)
    if (isNewParagraph && (el as any).isFirstLineIndent) {
      if (!pIndent) pIndent = {};
      const spaceLen = (el.value || '').length;
      pIndent.firstLine = spaceLen * 240;
      isNewParagraph = false;
      continue;
    }

    // 探测方案 A 的空格模拟缩进 (兼容性兜底)
    if (isNewParagraph && el.value === '\u3000') {
      let spaceCount = 0;
      let j = i;
      // 连续统计前面的全角空格
      while (j < flatElements.length && flatElements[j].value === '\u3000') {
        spaceCount++;
        j++;
      }
      if (spaceCount > 0) {
        if (!pIndent) pIndent = {};
        pIndent.firstLine = spaceCount * 240;
        i = j - 1; // 跳过这些空格元素，不作为普通文本导出
        isNewParagraph = false;
        continue;
      }
    }

    // 分隔线处理 (ElementType.SEPARATOR)
    if (elType === 'separator' || (elType as any) === ElementType.SEPARATOR) {
      if (currentRuns.length > 0) {
        results.push(new Paragraph({
          children: currentRuns,
          alignment: pAlignment || AlignmentType.LEFT,
          indent: pIndent,
          heading: pHeading,
          spacing: { 
            before: (pSpacingBefore !== undefined) ? pSpacingBefore * 20 : 120, 
            after: (pSpacingAfter !== undefined) ? pSpacingAfter * 20 : 120, 
            line: (pRowMargin) ? Math.round(pRowMargin * 240) : 360,
            lineRule: 'auto'
          }
        }));
        currentRuns = [];
      }
      
      const dash = el.dashArray && el.dashArray.length > 0 ? BorderStyle.DASHED : BorderStyle.SINGLE;
      const color = formatColor(el.color) || 'FF0000'; // 默认红色用于公文

      results.push(new Paragraph({
        border: {
          bottom: {
            color: color,
            space: 1,
            style: dash,
            size: 6, // 约 0.75pt
          },
        },
      }));
      continue;
    }

    if (elType === 'table' || (elType as any) === ElementType.TABLE) {
      if (currentRuns.length > 0) {
        results.push(new Paragraph({
          children: currentRuns,
          alignment: pAlignment || AlignmentType.LEFT,
          indent: pIndent,
          heading: pHeading,
          spacing: { 
            before: (pSpacingBefore !== undefined) ? pSpacingBefore * 20 : 120, 
            after: (pSpacingAfter !== undefined) ? pSpacingAfter * 20 : 120, 
            line: (pRowMargin) ? Math.round(pRowMargin * 240) : 360,
            lineRule: 'auto'
          }
        }));
        currentRuns = [];
      }
      results.push(await parseTable(el));
      // 重置状态
      pAlignment = AlignmentType.LEFT;
      pIndent = undefined;
      pHeading = undefined;
      pSpacingBefore = undefined;
      pSpacingAfter = undefined;
      pRowMargin = undefined;
      isNewParagraph = true;
      continue;
    }

    // 处理换行符 (物理段落结束)
    if (el.value === '\n' || el.value === '\r\n') {
      // 检查当前段落中是否包含红线图片，如果是，则强制居中
      const hasRedLine = currentRuns.some(run => (run as any)._isRedLine);
      const finalAlign = hasRedLine ? AlignmentType.CENTER : (el.rowFlex ? mapAlignment(el.rowFlex) : pAlignment);
      
      results.push(new Paragraph({
        children: currentRuns,
        alignment: finalAlign || AlignmentType.LEFT,
        indent: pIndent,
        heading: pHeading,
        spacing: {
          before: (pSpacingBefore !== undefined) ? pSpacingBefore * 20 : 120,
          after: (pSpacingAfter !== undefined) ? pSpacingAfter * 20 : 120,
          line: (pRowMargin) ? Math.round(pRowMargin * 240) : 360,
          lineRule: 'auto'
        }
      }));
      currentRuns = [];
      pAlignment = AlignmentType.LEFT; // 物理隔离：换行后彻底回归左对齐
      pIndent = undefined;
      pHeading = undefined;
      pSpacingBefore = undefined;
      pSpacingAfter = undefined;
      pRowMargin = undefined;
      isNewParagraph = true;
      continue;
    }

    // 如果遇到了正常字符，则不再是段落开头
    if (el.value && el.value !== '\n') {
      isNewParagraph = false;
    }

    // 聚合块处理 (如果是 Title/List 类型)
    if (elType === 'title' || (elType as any) === ElementType.TITLE || elType === 'list' || (elType as any) === ElementType.LIST) {
      if (currentRuns.length > 0) {
        results.push(new Paragraph({
          children: currentRuns,
          alignment: pAlignment,
          indent: pIndent || (el.indent ? { left: el.indent * 240 } : undefined)
        }));
        currentRuns = [];
      }
      pAlignment = mapAlignment(el.rowFlex) || AlignmentType.LEFT;
      if (el.indent) {
        pIndent = {
          left: (el.indent || 0) * 240
        };
      } else {
        pIndent = undefined;
      }
      pHeading = mapTitleLevel(el.level);

      const subElements = (el.valueList || []);
      // 聚合块内部递归 (保持简单)
      const subs = await elementsToDocxChildren(subElements);
      results.push(...subs);

      // 块结束后重置
      pAlignment = AlignmentType.LEFT;
      pIndent = undefined;
      pHeading = undefined;
      continue;
    }

    // 普通元素：累积属性与 Runs
    if (el.rowFlex) pAlignment = mapAlignment(el.rowFlex);
    if ((el as any).spacingBefore !== undefined) pSpacingBefore = (el as any).spacingBefore;
    if ((el as any).spacingAfter !== undefined) pSpacingAfter = (el as any).spacingAfter;
    if ((el as any).rowMargin !== undefined) pRowMargin = (el as any).rowMargin;
    if (el.indent) {
      pIndent = {
        left: (el.indent || 0) * 240
      };
    }
    if ((el as any).titleLevel) pHeading = mapTitleLevel((el as any).titleLevel);

    const run = await parseElementToRun(el);
    if (run) currentRuns.push(run);
  }

  // 最后一刷
  if (currentRuns.length > 0) {
    const hasRedLine = currentRuns.some(run => (run as any)._isRedLine);
    results.push(new Paragraph({
      children: currentRuns,
      alignment: hasRedLine ? AlignmentType.CENTER : (pAlignment || AlignmentType.LEFT),
      indent: pIndent,
      heading: pHeading,
      spacing: {
        before: (pSpacingBefore !== undefined) ? pSpacingBefore * 20 : 120,
        after: (pSpacingAfter !== undefined) ? pSpacingAfter * 20 : 120,
        line: (pRowMargin) ? Math.round(pRowMargin * 240) : 360,
        lineRule: 'auto'
      }
    }));
  }

  return results;
}

/**
 * 统一解析入口
 */
async function parseElementToRun(el: IElement): Promise<any> {
  const elType = el.type;
  if (elType === ElementType.IMAGE || (elType as any) === 'image') {
    return await parseImage(el);
  }
  return parseTextRun(el);
}

function parseTextRun(el: IElement): TextRun {
  const color = formatColor(el.color);
  return new TextRun({
    text: el.value || '',
    bold: el.bold,
    italics: el.italic,
    underline: el.underline ? {} : undefined,
    strike: el.strikeout,
    color: color || '000000', // 默认黑色
    size: el.size ? Math.round(el.size * 1.45) : 22, // 修正字号映射
    font: el.font || '微软雅黑',
  });
}

async function parseImage(el: IElement): Promise<ImageRun | null> {
  if (!el.value) return null;

  try {
    let imageData: Uint8Array;

    if (el.value.startsWith('data:image')) {
      const base64Data = el.value.indexOf('base64,') !== -1
        ? el.value.split('base64,')[1]
        : el.value;
      imageData = base64ToUint8Array(base64Data);
    }
    else if (el.value.startsWith('blob:') || el.value.startsWith('http')) {
      const response = await fetch(el.value);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const buffer = await response.arrayBuffer();
      imageData = new Uint8Array(buffer);
    } else {
      return null;
    }

    // 网页 px 到 Word 像素的转换修正
    const width = el.width ? Math.round(el.width * 0.8) : 280;
    const height = el.height ? Math.round(el.height * 0.8) : 280;

    const res = new ImageRun({
      data: imageData,
      transformation: {
        width: width,
        height: height,
      },
    });
    // 标记为红线，用于 Paragraph 居中判定
    if ((el as any).title === 'redline' || (el as any).extension?.isRedLine) {
      (res as any)._isRedLine = true;
    }
    return res;
  } catch (e) {
    console.error('【docxExporter】图片解析失败:', e);
    return null;
  }
}

async function parseTable(el: IElement): Promise<Table> {
  const rows = await Promise.all((el.trList || []).map(async tr => {
    const cells = await Promise.all((tr.tdList || []).map(async td => {
      const nestedChildren = await elementsToDocxChildren(td.value as IElement[]);
      // 处理边框颜色与类型
      const borderColor = formatColor((td as any).borderColor || el.borderColor) || '000000';
      // canvas-editor 约定: borderTypes 为 [top, right, bottom, left] 如果存在 0 则不显示
      const bTypes = td.borderTypes || [1, 1, 1, 1];
      
      return new TableCell({
        children: nestedChildren,
        columnSpan: td.colspan,
        rowSpan: td.rowspan,
        shading: td.backgroundColor ? { fill: formatColor(td.backgroundColor) } : undefined,
        verticalAlign: VerticalAlign.CENTER,
        margins: {
          top: 0, bottom: 0, left: 100, right: 100,
        },
        borders: {
          top: bTypes[0] ? { style: BorderStyle.SINGLE, size: 1, color: borderColor } : { style: BorderStyle.NIL },
          right: bTypes[1] ? { style: BorderStyle.SINGLE, size: 1, color: borderColor } : { style: BorderStyle.NIL },
          bottom: bTypes[2] ? { style: BorderStyle.SINGLE, size: 2, color: borderColor } : { style: BorderStyle.NIL },
          left: bTypes[3] ? { style: BorderStyle.SINGLE, size: 1, color: borderColor } : { style: BorderStyle.NIL },
        }
      });
    }));
    return new TableRow({
      children: cells,
      height: { value: (tr.height || 40) * 15, rule: 'atLeast' },
    });
  }));

  const tableBorderColor = formatColor(el.borderColor) || '000000';
  // 如果是红线表格，通常隐藏外框
  const isRedLineTable = el.borderColor === '#ff0000' || (el as any).title === 'redline';
  const borderStyle = isRedLineTable ? BorderStyle.NIL : BorderStyle.SINGLE;

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows,
    columnWidths: (el.colgroup || []).map(c => (c.width || 100) * 15),
    borders: {
      top: { style: borderStyle, size: 1, color: tableBorderColor },
      bottom: { style: borderStyle, size: 1, color: tableBorderColor },
      left: { style: borderStyle, size: 1, color: tableBorderColor },
      right: { style: borderStyle, size: 1, color: tableBorderColor },
      insideHorizontal: { style: borderStyle, size: 1, color: tableBorderColor },
      insideVertical: { style: borderStyle, size: 1, color: tableBorderColor },
    }
  });
}

/**
 * 将各种颜色格式（#RGB, #RRGGBB, rgb(r,g,b)）转换为 docx 所需的 RRGGBB（去#并大写）
 */
function formatColor(color: string | undefined): string | undefined {
  if (!color) return undefined;
  let res = color.trim().toLowerCase();

  // 处理 rgb/rgba 格式: rgb(255, 0, 0)
  if (res.startsWith('rgb')) {
    const match = res.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return (r + g + b).toUpperCase();
    }
  }

  // 处理十六进制格式
  if (res.startsWith('#')) {
    res = res.substring(1);
    // 处理简写格式 #ABC -> AABBCC
    if (res.length === 3) {
      res = res[0] + res[0] + res[1] + res[1] + res[2] + res[2];
    }
    return res.toUpperCase();
  }

  // 其他情况（如直接输入的颜色名或已处理好的代码）
  return res.toUpperCase();
}

function mapAlignment(flex: RowFlex | string | undefined): any {
  if (!flex) return undefined
  const f = String(flex).toLowerCase()
  if (f === 'center') return AlignmentType.CENTER
  if (f === 'right') return AlignmentType.RIGHT
  if (f === 'alignment' || f === 'both') return AlignmentType.JUSTIFIED
  if (f === 'justify' || f === 'distribute') return AlignmentType.DISTRIBUTE
  return AlignmentType.LEFT
}

function mapTitleLevel(level: TitleLevel | undefined): any {
  switch (level) {
    case TitleLevel.FIRST: return HeadingLevel.HEADING_1;
    case TitleLevel.SECOND: return HeadingLevel.HEADING_2;
    case TitleLevel.THIRD: return HeadingLevel.HEADING_3;
    case TitleLevel.FOURTH: return HeadingLevel.HEADING_4;
    case TitleLevel.FIFTH: return HeadingLevel.HEADING_5;
    case TitleLevel.SIXTH: return HeadingLevel.HEADING_6;
    default: return undefined;
  }
}

function base64ToUint8Array(base64: string): Uint8Array {
  // 如果输入带前缀则尝试剥离（虽然 parseImage 已经剥离了，这里做二次保险）
  const parts = base64.split(';base64,');
  const base64Str = parts[1] || parts[0];
  const raw = window.atob(base64Str);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return uInt8Array;
}
