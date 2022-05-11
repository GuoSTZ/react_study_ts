import React, { forwardRef } from 'react';
import RcTree, { TreeNode, TreeProps as RcTreeProps, BasicDataNode } from 'rc-tree';
import { DataNode, Direction, Key } from 'rc-tree/lib/interface';
// import DirectoryTree from './DirectoryTree';
import classNames from 'classnames';
import { renderSwitcherIcon, dropIndicatorRender, collapseMotion, getPrefixCls } from './utils';
import "rc-tree/assets/index.css"
import './index.less';

export interface VirtualTreeNodeAttribute {
  eventKey: string;
  prefixCls: string;
  className: string;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  halfChecked: boolean;
  children: React.ReactNode;
  title: React.ReactNode;
  pos: string;
  dragOver: boolean;
  dragOverGapTop: boolean;
  dragOverGapBottom: boolean;
  isLeaf: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
}

export interface VirtualTreeNodeProps {
  className?: string;
  checkable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  title?: string | React.ReactNode;
  key?: Key;
  eventKey?: string;
  isLeaf?: boolean;
  checked?: boolean;
  expanded?: boolean;
  loading?: boolean;
  selected?: boolean;
  selectable?: boolean;
  icon?: ((treeNode: VirtualTreeNodeAttribute) => React.ReactNode) | React.ReactNode;
  children?: React.ReactNode;
  [customProp: string]: any;
}

export interface VirtualTreeNode extends React.Component<VirtualTreeNodeProps, {}> { }

type DraggableFn = (node: VirtualTreeNode) => boolean;

interface DraggableConfig {
  icon?: React.ReactNode | false;
  nodeDraggable?: DraggableFn;
}

export interface VirtualTreeProps<T extends BasicDataNode = DataNode>
  extends Omit<RcTreeProps<T>, 'prefixCls' | 'showLine' | 'direction' | 'draggable'> {
  showLine?: boolean | { showLeafIcon: boolean };
  className?: string;
  /** 是否支持多选 */
  multiple?: boolean;
  /** 是否自动展开父节点 */
  autoExpandParent?: boolean;
  /** Checkable状态下节点选择完全受控（父子节点选中状态不再关联） */
  checkStrictly?: boolean;
  /** 是否支持选中 */
  checkable?: boolean;
  /** 是否禁用树 */
  disabled?: boolean;
  /** 默认展开所有树节点 */
  defaultExpandAll?: boolean;
  /** 默认展开对应树节点 */
  defaultExpandParent?: boolean;
  /** 默认展开指定的树节点 */
  defaultExpandedKeys?: Key[];
  /** （受控）展开指定的树节点 */
  expandedKeys?: Key[];
  /** （受控）选中复选框的树节点 */
  checkedKeys?: Key[] | { checked: Key[]; halfChecked: Key[] };
  /** 默认选中复选框的树节点 */
  defaultCheckedKeys?: Key[];
  /** （受控）设置选中的树节点 */
  selectedKeys?: Key[];
  /** 默认选中的树节点 */
  defaultSelectedKeys?: Key[];
  selectable?: boolean;
  /** 点击树节点触发 */
  filterAntTreeNode?: (node: VirtualTreeNode) => boolean;
  loadedKeys?: Key[];
  /** 设置节点可拖拽（IE>8） */
  draggable?: DraggableFn | boolean | DraggableConfig;
  style?: React.CSSProperties;
  showIcon?: boolean;
  icon?: ((nodeProps: VirtualTreeNodeAttribute) => React.ReactNode) | React.ReactNode;
  switcherIcon?: React.ReactElement<any>;
  prefixCls?: string;
  children?: React.ReactNode;
  blockNode?: boolean;
}

type CompoundedComponent = (<T extends BasicDataNode | DataNode = DataNode>(
  props: React.PropsWithChildren<VirtualTreeProps<T>> & { ref?: React.Ref<RcTree> },
) => React.ReactElement) & {
  defaultProps: Partial<React.PropsWithChildren<VirtualTreeProps<any>>>;
  TreeNode: typeof TreeNode;
  // DirectoryTree: typeof DirectoryTree;
};

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
    virtual
  } = props;
  const prefixCls = getPrefixCls('tree', customizePrefixCls);
  let direction: any = "ltr";
  const newProps = {
    ...props,
    showLine: Boolean(showLine),
    dropIndicatorRender: dropIndicatorRender as any,
  };

  const draggableConfig = React.useMemo(() => {
    if (!draggable) {
      return false;
    }

    let mergedDraggable: DraggableConfig = {};
    switch (typeof draggable) {
      case 'function':
        mergedDraggable.nodeDraggable = draggable;
        break;

      case 'object':
        mergedDraggable = { ...draggable };
        break;

      default:
      // Do nothing
    }

    // if (mergedDraggable.icon !== false) {
    //   mergedDraggable.icon = mergedDraggable.icon || <HolderOutlined />;
    // }

    return mergedDraggable;
  }, [draggable]);

  return (
    <RcTree
      itemHeight={20}
      ref={ref}
      virtual={virtual}
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
      draggable={draggableConfig as any}
    >
      {children}
    </RcTree>
  )
}) as unknown as CompoundedComponent;

VirtualTree.TreeNode = TreeNode;

// VirtualTree.DirectoryTree = DirectoryTree;

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