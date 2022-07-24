import renderEmpty from './renderEmpty';
import getIcons from './getIcons';
import dropIndicatorRender from './dropIndicator';
import { tuple } from './type';
import {
  getMergedStatus,
  getStatusClassNames
} from './statusUtils';

// 类名前缀设置
const getPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
  if (customizePrefixCls) return customizePrefixCls;

  return suffixCls ? `ant-${suffixCls}` : 'ant';
};

const getTransitionDirection = (placement: SelectCommonPlacement | undefined) => {
  if (placement !== undefined && (placement === 'topLeft' || placement === 'topRight')) {
    return `slide-down`;
  }
  return `slide-up`;
};

const getTransitionName = (rootPrefixCls: string, motion: string, transitionName?: string) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};

const SelectPlacements = tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight');
export type SelectCommonPlacement = typeof SelectPlacements[number];

const InputStatuses = tuple('warning', 'error', '');
export type InputStatus = typeof InputStatuses[number];

export {
  getPrefixCls,
  getTransitionName,
  getTransitionDirection,
  renderEmpty,
  getIcons,
  dropIndicatorRender,
  getMergedStatus,
  getStatusClassNames
};

export type { ValidateStatus } from './statusUtils';