import React, { forwardRef } from 'react';
import RcTree, { TreeNode, TreeProps as RcTreeProps } from 'rc-tree';
import classNames from 'classnames';
import { renderSwitcherIcon, dropIndicatorRender, collapseMotion } from './utils';
import "rc-tree/assets/index.css"
import './index.less';

export interface VirtualTreeProps extends Omit<RcTreeProps, 'prefixCls' | 'showLine' | 'direction' | 'expandAction'> {
  prefixCls?: string;
  showLine?: boolean;
  blockNode?: boolean;
}

const VirtualTree = forwardRef<RcTree, VirtualTreeProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    showIcon,
    showLine,
    switcherIcon,
    blockNode,
    children,
    checkable,
    selectable,
    draggable,
  } = props;
  // const prefixCls = getPrefixCls('tree', customizePrefixCls);
  const prefixCls = customizePrefixCls ? `${customizePrefixCls}-tree` : "ant-tree";
  let direction: any = "ltr";
  const newProps = {
    ...props,
    showLine: Boolean(showLine),
    dropIndicatorRender: dropIndicatorRender as any,
  };
  return (
    <RcTree
      itemHeight={20}
      ref={ref}
      virtual={true}
      {...newProps}
      prefixCls={prefixCls}
      className={classNames(
        {
          [`${prefixCls}-icon-hide`]: !showIcon,
          [`${prefixCls}-block-node`]: blockNode,
          [`${prefixCls}-unselectable`]: !selectable,
          [`${prefixCls}-rtl`]: direction === 'rtl',
        },
        className,
        'virtual-tree'
      )}
      direction={direction}
      checkable={checkable ? <span className={`${prefixCls}-checkbox-inner ant-checkbox-inner`} /> : checkable}
      selectable={selectable}
      switcherIcon={(nodeProps: any) =>
        renderSwitcherIcon(prefixCls, switcherIcon, showLine, nodeProps)
      }
      expandAction={false}
    >
      {children}
    </RcTree>
  )
})

VirtualTree.defaultProps = {
  checkable: false,
  selectable: true,
  showIcon: false,
  motion: {
    ...collapseMotion,
    motionAppear: false,
  },
  blockNode: false,
};

export default VirtualTree;