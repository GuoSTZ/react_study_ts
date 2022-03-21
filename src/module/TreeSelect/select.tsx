import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { DefaultValueType } from 'rc-tree-select/lib/interface';
import { default as RcTreeSelect, TreeSelectProps } from "./index";

const TreeSelect = (props: TreeSelectProps<DefaultValueType>) => {
  const [checkAll, setCheckAll] = useState(false);
  const [selectValue, setSelectValue] = useState(undefined as any);
  const [disabledData, setDisabledData] = useState([]);

  const checkAll_text = "全部";
  const isMultiple = !!(props?.treeCheckable || props?.multiple);

  useEffect(() => {
    setDisabledData(setItemDisabled(props.treeData))
  }, [props.treeData]);

  // 获取全部数据的key值数组
  const getAllKey = (data: any): string[] => {
    const keys: string[] = [];
    data?.every((item: any) => {
      keys.push(item.key);
      if (item.children) {
        keys.push(...getAllKey(item.children));
      }
      return true;
    });
    return keys;
  }

  const setItemDisabled = (data: any) => {
    return data?.map((item: any) => {
      const new_item = Object.assign({}, item);
      new_item.disabled = true;
      if (new_item.children) {
        new_item.children = setItemDisabled(new_item.children);
      }
      return new_item;
    });
  }

  const checkOnChange = (e: CheckboxChangeEvent) => {
    const { onChange: _onChange, treeData } = props;
    setCheckAll(e.target.checked);
    const value = e.target.checked ? getAllKey(treeData) : selectValue;
    _onChange && _onChange(value, [], {} as any);
  }

  const renderDropdown = (originNode: any) => {
    const { dropdownRender: _dropdownRender } = props;
    const menu = (
      <React.Fragment>
        {
          isMultiple && props?.treeData && props?.treeData?.length > 0 && (
            <Checkbox
              checked={checkAll}
              onChange={checkOnChange}
              style={{ padding: "3px 4px 4px 10px", width: '100%', marginBottom: 4 }}
            >
              {checkAll_text}
            </Checkbox>
          )
        }
        {
          React.cloneElement(originNode, {
            options: checkAll ? disabledData : originNode.props.options
          })
        }
      </React.Fragment>
    );

    return _dropdownRender ? _dropdownRender(menu) : menu;
  }

  const onChange = (value: any, label: any, extra: any) => {
    const { onChange: _onChange } = props;
    // tag清空【全部】时触发
    if (checkAll && value?.length === 0) {
      setCheckAll(false);
    }
    setSelectValue(value);
    _onChange && _onChange(value, label, extra);
  }

  return (
    <RcTreeSelect
      {...props}
      onChange={onChange}
      value={checkAll ? [checkAll_text] : selectValue}
      dropdownRender={renderDropdown}
    />
  )
}

export default TreeSelect;