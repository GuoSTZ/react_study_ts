import React, { ReactNode, useEffect, useState } from 'react';
import { TreeSelect, TreeSelectProps, Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import styles from './index.module.less';

const TreeNode = TreeSelect.TreeNode;

type TreeSelectPropsWithChilren = TreeSelectProps & {
  children?: React.ReactNode
}

type ChangeEventExtra = {
  preValue: any;
  triggerValue: any;
  triggerNode: any;
  allCheckedNodes: any;
}

export interface McTreeSelectProps extends TreeSelectPropsWithChilren {
  selectAll?: boolean;
  selectAllValue?: any;
  selectAllText?: string;
}

type CompoundedComponent = ((props: McTreeSelectProps) => React.ReactElement) & {
  defaultProps?: McTreeSelectProps
  McTreeNode: typeof TreeNode
}

const McTreeSelect: CompoundedComponent = props => {
  const {
    selectAllText,
    selectAllValue,
    dropdownRender,
    listItemHeight,
    multiple,
    onChange,
    selectAll,
    treeCheckable,
    value
  } = props;

  const ITEM_HEIGHT = listItemHeight ?? 24;
  const isMultiple = !!(treeCheckable || multiple);

  const [selectedAll, setSelectedAll] = useState(false);
  const [treeValue, setTreeValue] = useState(undefined as any);
  const [treeLabel, setTreeLabel] = useState(undefined as any);
  const [treeChildren, setTreeChildren] = useState(undefined as any);

  useEffect(() => {
    value !== selectAllValue && setTreeValue(value);
  }, [value])

  const handleTreeData = (data: any[] = [], checked: boolean) => {
    return data?.map((item: any) => {
      item.disabled = checked;
      if (item.children) {
        item.children = handleTreeData(item.children, checked);
      }
      return item;
    })
  }

  const handleTreeNode = (data: any = {}, checked: boolean): any => {
    const newData = Array.isArray(data) ? data : [data];
    return newData?.map((child: any) => React.cloneElement(child, {
      disabled: checked,
      children: child.props.children ? handleTreeNode(child.props.children, checked) : undefined
    }))
  }

  const handleTree = (checked: boolean) => {
    if (props.treeData) {
      handleTreeData(props.treeData, checked);
    } else if (props.children) {
      setTreeChildren(handleTreeNode(props.children, checked))
    }
  }

  const selectAllOnchange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    setSelectedAll(checked);
    handleTree(checked);
    if (checked) {
      onChange?.(selectAllValue, [selectAllText], {
        preValue: treeValue ?? [],
        triggerValue: selectAllValue,
        selected: checked,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement
      });
    } else {
      onChange?.(treeValue, treeLabel, {
        preValue: selectAllValue,
        triggerValue: treeValue,
        selected: checked,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement
      });
    }
  }

  const treeOnChange = (value: any, label: ReactNode[], extra: ChangeEventExtra) => {
    if (selectedAll && value.length === 0) {
      setSelectedAll(false);
      handleTree(false);
      onChange?.(treeValue, treeLabel, {
        preValue: selectAllValue,
        triggerValue: treeValue,
        selected: false,
        allCheckedNodes: [],
        triggerNode: {} as React.ReactElement
      });
      return;
    }
    !selectedAll && setTreeValue(value);
    !selectedAll && setTreeLabel(label);
    onChange?.(value, label, extra);
  }

  const renderDropdown = (originNode: ReactNode) => {
    const menu = (
      <React.Fragment>
        {
          isMultiple && selectAll && (
            <div
              className={styles['McTreeSelect-all']}
              style={{ height: ITEM_HEIGHT }}>
              <Checkbox
                onChange={selectAllOnchange}
                checked={selectedAll}
                style={{ lineHeight: `${ITEM_HEIGHT}px` }}>
                {selectAllText}
              </Checkbox>
            </div>
          )
        }
        {originNode}
      </React.Fragment>
    )
    return dropdownRender ? dropdownRender(menu) : menu;
  }

  return (
    <TreeSelect
      {...props}
      children={treeChildren ?? props.children}
      value={selectedAll ? [selectAllText] : treeValue}
      onChange={treeOnChange}
      dropdownRender={renderDropdown}
    />
  )
}

McTreeSelect.McTreeNode = TreeNode;
McTreeSelect.defaultProps = {
  selectAll: true,
  selectAllText: '全部',
  selectAllValue: 'all'
}

export default McTreeSelect;