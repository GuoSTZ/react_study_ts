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
  showTotal?: boolean;
  totalDefault?: any;
}

type CompoundedComponent = ((props: McTreeSelectProps) => React.ReactElement) & {
  defaultProps?: McTreeSelectProps
  McTreeNode: typeof TreeNode
}

const McTreeSelect: CompoundedComponent = props => {
  const {
    totalDefault,
    dropdownRender,
    listItemHeight,
    multiple,
    onChange,
    showTotal,
    treeCheckable,
    value
  } = props;

  const ITEM_HEIGHT = listItemHeight ?? 24;
  const TOTAL_TEXT = '全部';
  const isMultiple = !!(treeCheckable || multiple);

  const [treeValue, setTreeValue] = useState(undefined as any);
  const [checkedTotal, setCheckedTotal] = useState(false);

  useEffect(() => {
    setTreeValue(value);
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
    // return React.Children.map(data, (child: any) => React.cloneElement(child, {
    //   disabled: checked,
    //   children: child.props.children ? handleTreeNode(child.props.children, checked) : undefined
    // }))
    return React.Children.map(data, (child: any) => {
      console.log(child, child.props, '====child')
      // child.props.disabled = checked;
      // if(child.props.children) {
      //   child.props.children = handleTreeNode(child.props.children, checked);
      // }
    })
  }

  const totalOnchange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    setCheckedTotal(checked);
    if (props.treeData) {
      handleTreeData(props.treeData, checked);
    } else if (props.children) {
      handleTreeNode(props.children, checked);
    }
    onChange?.(totalDefault, [totalDefault], {
      preValue: checked ? (treeValue ?? []) : totalDefault,
      triggerValue: totalDefault,
      selected: checked,
      allCheckedNodes: [],
      triggerNode: {}
    } as any);
  }

  const treeOnChange = (value: any, label: ReactNode[], extra: ChangeEventExtra) => {
    if (checkedTotal && value.length === 0) {
      setCheckedTotal(false);
    }
    !checkedTotal && setTreeValue(value);
    onChange?.(value, label, extra);
  }

  const renderDropdown = (originNode: ReactNode) => {
    const menu = (
      <React.Fragment>
        {
          isMultiple && showTotal && (
            <div
              className={styles['McTreeSelect-total']}
              style={{ height: ITEM_HEIGHT }}>
              <Checkbox
                onChange={totalOnchange}
                checked={checkedTotal}
                style={{ lineHeight: `${ITEM_HEIGHT}px` }}>
                {TOTAL_TEXT}
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
      value={checkedTotal ? totalDefault : treeValue}
      onChange={treeOnChange}
      dropdownRender={renderDropdown}
    />
  )
}

McTreeSelect.McTreeNode = TreeNode;
McTreeSelect.defaultProps = {
  totalDefault: 'all'
}

export default McTreeSelect;