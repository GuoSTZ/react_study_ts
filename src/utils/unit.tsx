/**
 * px 转化为 page size
 * @param {Number} px 设计图px值
 * @return page size
 */
 export const pxToPh = (px: number) => {
  const fontSizeStr = document.documentElement.style.fontSize;
  const fontSize = +fontSizeStr.replace('px', '') || 192;
  const scale = fontSize / 192
  return Number((px * scale).toFixed(2))
}