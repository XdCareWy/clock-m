export function promiseApi(api) {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      };
      api({
        options,
        ...extras
      }, ...params);
    });
  }
}
/**
 * 根据给定的最大宽度，将文本进行分行
 * @param ctx Canvas
 * @param text String 文本
 * @param maxWidth Number 最大宽度
 * @param lineHeigth Number 每行的高度
 * @return Object<Array, Number>
 */
export function splitMultiLine(ctx, text, maxWidth, lineHeight) {
  const result = [];
  const words = text.split("").reverse();
  let word = words.pop();
  let lineWord = [];
  while (word) {
    lineWord.push(word);
    const {
      width: lineWidth
    } = ctx.measureText(
      lineWord.join("")
    );
    if (lineWidth > maxWidth) {
      lineWord.pop();
      result.push(lineWord.join(""));
      lineWord = [word];
    }
    word = words.pop();
  }
  result.push(lineWord.join(""));
  return {
    lines: result,
    lineHeight: lineHeight
  };
}

// 画文本
export function paintText(ctx, text = "", params) {
  const {
    x = 0, y = 0, textColor = "black", fontSize = 14, textAlign='left'
  } = params || {};
  ctx.setFillStyle(textColor);
  ctx.setTextBaseline('top');
  ctx.setTextAlign(textAlign);
  ctx.setFontSize(fontSize);
  ctx.fillText(text, x, y);
}

// 画矩形
export function paintRect(ctx, params) {
  const {
    x = 0, y = 0, width = 0, height = 0, bgColor = "black"
  } = params;
  ctx.beginPath();
  ctx.setFillStyle(bgColor);
  ctx.rect(x, y, width, height);
  ctx.fill();
}