import React from "react";
import RcTreeSelect, {
  TreeNode,
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  TreeSelectProps as RcTreeSelectProps,
} from 'rc-tree-select';
import classNames from 'classnames';
import { DefaultValueType } from 'rc-tree-select/lib/interface';
import omit from 'rc-util/lib/omit';
import { AntTreeNodeProps, TreeProps } from 'antd/lib/tree';
import { getPrefixCls, getTransitionName, renderEmpty, renderSwitcherIcon, getIcons } from './utils';

export interface TreeSelectProps<T>
  extends Omit<
  RcTreeSelectProps<T>,
  | 'showTreeIcon'
  | 'treeMotion'
  | 'inputIcon'
  | 'mode'
  | 'getInputElement'
  | 'backfill'
  | 'treeLine'
  > {
  suffixIcon?: React.ReactNode;
  size?: SizeType;
  bordered?: boolean;
  treeLine?: TreeProps['showLine'];
}

export interface RefTreeSelectProps {
  focus: () => void;
  blur: () => void;
}

type SizeType = 'small' | 'middle' | 'large' | undefined;
type DirectionType = 'ltr' | 'rtl' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

// 全局默认 direction 值
let direction: DirectionType = "ltr";

const InternalTreeSelect = <T extends DefaultValueType>(
  {
    prefixCls: customizePrefixCls,
    size: customizeSize,
    bordered = true,
    className,
    treeCheckable,
    multiple,
    listHeight = 256,
    listItemHeight = 26,
    notFoundContent,
    switcherIcon,
    treeLine,
    getPopupContainer,
    dropdownClassName,
    treeIcon = false,
    transitionName,
    choiceTransitionName = '',
    virtual = true,
    dropdownMatchSelectWidth = true,
    ...props
  }: TreeSelectProps<T>,
  ref: React.Ref<RefTreeSelectProps>,
) => {
  const size = React.useContext(SizeContext);

  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const treePrefixCls = getPrefixCls('select-tree', customizePrefixCls);
  const treeSelectPrefixCls = getPrefixCls('tree-select', customizePrefixCls);

  const mergedDropdownClassName = classNames(dropdownClassName, `${treeSelectPrefixCls}-dropdown`, {
    [`${treeSelectPrefixCls}-dropdown-rtl`]: direction === 'rtl',
  });

  const isMultiple = !!(treeCheckable || multiple);

  // ===================== Icons =====================
  const { suffixIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    multiple: isMultiple,
    prefixCls,
  });

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode;
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else {
    mergedNotFound = renderEmpty('Select');
  }

  // ==================== Render =====================
  const selectProps = omit(props as typeof props & { itemIcon: any; switcherIcon: any }, [
    'suffixIcon',
    'itemIcon',
    'removeIcon',
    'clearIcon',
    'switcherIcon',
  ]);

  const mergedSize = customizeSize || size;
  const mergedClassName = classNames(
    !customizePrefixCls && treeSelectPrefixCls,
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-borderless`]: !bordered,
    },
    className,
  );
  const rootPrefixCls = getPrefixCls();

  return (
    <RcTreeSelect
      virtual={virtual}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      {...selectProps}
      ref={ref as any}
      prefixCls={prefixCls}
      className={mergedClassName}
      listHeight={listHeight}
      listItemHeight={listItemHeight}
      treeCheckable={
        treeCheckable ? <span className={`${prefixCls}-tree-checkbox-inner`} /> : treeCheckable
      }
      treeLine={!!treeLine}
      inputIcon={suffixIcon}
      multiple={multiple}
      removeIcon={removeIcon}
      clearIcon={clearIcon}
      switcherIcon={(nodeProps: AntTreeNodeProps) =>
        renderSwitcherIcon(treePrefixCls, switcherIcon, treeLine, nodeProps)
      }
      showTreeIcon={treeIcon as any}
      notFoundContent={mergedNotFound}
      getPopupContainer={getPopupContainer}
      treeMotion={null}
      dropdownClassName={mergedDropdownClassName}
      choiceTransitionName={getTransitionName(rootPrefixCls, '', choiceTransitionName)}
      transitionName={getTransitionName(rootPrefixCls, 'slide-up', transitionName)}
    />
  )
}

const TreeSelectRef = React.forwardRef(InternalTreeSelect) as <T extends DefaultValueType>(
  props: TreeSelectProps<T> & { ref?: React.Ref<RefTreeSelectProps> },
) => React.ReactElement;

type InternalTreeSelectType = typeof TreeSelectRef;

interface TreeSelectInterface extends InternalTreeSelectType {
  TreeNode: typeof TreeNode;
  SHOW_ALL: typeof SHOW_ALL;
  SHOW_PARENT: typeof SHOW_PARENT;
  SHOW_CHILD: typeof SHOW_CHILD;
}

const TreeSelect = TreeSelectRef as TreeSelectInterface;

TreeSelect.TreeNode = TreeNode;
TreeSelect.SHOW_ALL = SHOW_ALL;
TreeSelect.SHOW_PARENT = SHOW_PARENT;
TreeSelect.SHOW_CHILD = SHOW_CHILD;

export { TreeNode };

export default TreeSelect;