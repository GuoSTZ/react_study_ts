// import renderEmpty from './renderEmpty';
import renderSwitcherIcon from './renderSwitcherIcon';
// import getIcons from './getIcons';
import dropIndicatorRender from './dropIndicator';
import collapseMotion from './motion';

// 类名前缀设置
const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;

  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

const getTransitionName = (rootPrefixCls: string, motion: string, transitionName?: string) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};

export {
  getPrefixCls,
  getTransitionName,
  // renderEmpty,
  renderSwitcherIcon,
  // getIcons,
  dropIndicatorRender,
  collapseMotion
};