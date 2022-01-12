const flexibleInit = (screenRatioByDesign: number) => {
  const docEle = document.documentElement;

  const setHtmlFontSize = () => {
      const screenRatio = docEle.clientWidth / docEle.clientHeight;
      const fontSize = ((screenRatio > screenRatioByDesign ? screenRatioByDesign / screenRatio : 1) * docEle.clientWidth) / 10;

      docEle.style.fontSize = `${fontSize.toFixed(3)}px`;
  }

  setHtmlFontSize();

  window.addEventListener('resize', setHtmlFontSize);
}

export default flexibleInit(16 / 9);
