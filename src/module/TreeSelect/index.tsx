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
  fixedTotal?: boolean;
  defaultTotal?: any;
}

type CompoundedComponent = ((props: McTreeSelectProps) => React.ReactElement) & {
  defaultProps?: McTreeSelectProps
  McTreeNode: typeof TreeNode
}

const McTreeSelect: CompoundedComponent = props => {
  const {
    children,
    defaultTotal = 'all',
    dropdownRender: _dropdownRender,
    listItemHeight,
    multiple,
    onChange,
    showTotal,
    treeCheckable,
    treeData,
    value
  } = props;

  const ITEM_HEIGHT = listItemHeight ?? 24;
  const TOTAL_TEXT = '全部';
  const isMultiple = !!(treeCheckable || multiple);

  const [dataSource, setDataSource] = useState({} as {treeData?: typeof treeData, children?: typeof children});
  const [treeValue, setTreeValue] = useState(undefined as any);
  const [checkedTotal, setCheckedTotal] = useState(false);

  useEffect(() => {
    setDataSource({ treeData, children })
  }, [treeData, children])

  useEffect(() => {
    setTreeValue(value);
  }, [value])

  useEffect(() => {
    let result = {};
    if (treeData) {
      result = {treeData: handleTreeData(treeData, checkedTotal), children: undefined};
    } else if (children) {
      result = {treeData: undefined, children: handleTreeNode(children, checkedTotal)};
    }
    setDataSource(result);
  }, [checkedTotal])

  const handleTreeData = (data: any[] = [], checked: boolean) => {
    const result: any[] = [];
    data?.forEach((item: any) => {
      const record = { ...item, disabled: checked, children: undefined };
      if (item.children) {
        record.children = handleTreeData(item.children, checked);
      }
      result.push(record);
    })
    return result;
  }

  const handleTreeNode = (data: any = {}, checked: boolean): any => {
    return React.Children.map(data, (child: any) => React.cloneElement(child, {
      disabled: checked,
      children: child.props.children ? handleTreeNode(child.props.children, checked) : undefined
    }))
  }

  /** 勾选【全部】选项时的回调事件 */
  const totalOnchange = (e: CheckboxChangeEvent) => {
    const checked = e?.target?.checked;
    setCheckedTotal(checked);
    onChange?.(defaultTotal, [defaultTotal], {
      preValue: checked ? (treeValue ?? []) : defaultTotal,
      triggerValue: defaultTotal,
      selected: checked,
      allCheckedNodes: [],
      triggerNode: {}
    } as any);
  }

  const treeOnChange = (value:any, label: ReactNode[], extra: ChangeEventExtra) => {
    if(checkedTotal && value.length === 0) {
      setCheckedTotal(false);
    }
    !checkedTotal && setTreeValue(value);
    onChange?.(value, label, extra);
  }

  // 自定义下拉菜单
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
    return _dropdownRender ? _dropdownRender(menu) : menu;
  }

  return (
    <TreeSelect 
      {...props}
      {...dataSource}
      value={checkedTotal ? defaultTotal : treeValue}
      onChange={treeOnChange}
      dropdownRender={renderDropdown} 
    />
  )
}

McTreeSelect.McTreeNode = TreeNode;

export default McTreeSelect;