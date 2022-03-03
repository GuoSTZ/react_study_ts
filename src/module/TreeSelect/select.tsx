import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { default as RcTreeSelect } from "./index";

const TreeSelect = (props: any) => {
  const [checkAll, setCheckAll] = useState(false);
  const [selectValue, setSelectValue] = useState(undefined as undefined | any[]);
  const [originData, setOriginData] = useState([]);
  const [disabledData, setDisabledData] = useState([]);

  const checkAll_text = "全部";

  useEffect(() => {
    setOriginData(flatten(props.treeData));
    setDisabledData(setItemDisabled(props.treeData))
  }, []);

  // 将原始数据处理为树节点中的options数组，用以取消选中全部时的数据重渲染
  const flatten = (data: any) => {
    return data?.map((item: any) => {
      const new_item = Object.assign({}, item);
      new_item.node = item;
      new_item.value = item.key;
      if (new_item.children) {
        new_item.children = flatten(new_item.children);
      }
      return new_item;
    });
  }

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
    _onChange && _onChange(getAllKey(treeData));
  }

  const renderDropdown = (originNode: any) => {
    const { dropdownRender: _dropdownRender } = props;
    const menu = (
      <React.Fragment>
        <Checkbox
          checked={checkAll}
          onChange={checkOnChange}
          style={{ padding: "3px 4px 4px 10px", width: '100%', marginBottom: 4 }}
        >
          {checkAll_text}
        </Checkbox>
        {
          React.cloneElement(originNode, {
            options: checkAll ? disabledData : originData
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
      checkOnChange({ target: { checked: false } } as any);
    }
    setSelectValue(value);
    _onChange && _onChange(value, label, extra);
  }

  return (
    <RcTreeSelect
      {...props}
      open={true}
      onChange={onChange}
      value={checkAll ? [checkAll_text] : selectValue}
      dropdownRender={renderDropdown}
    />
  )
}

export default TreeSelect;