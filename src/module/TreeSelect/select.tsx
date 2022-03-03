import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { default as RcTreeSelect } from "./index";

const TreeSelect = (props: any) => {
  const [checkAll, setCheckAll] = useState(false);
  const [selectValue, setSelectValue] = useState(undefined as undefined | any[]);

  const setItemDisabled = (flag: boolean, data: any) => {
    if (flag) {
      const new_data = data?.slice(0, data?.length);
      new_data?.map((item: any) => {
        item.disabled = true;
        if (item.children) {
          item.children = setItemDisabled(flag, item.children);
        }
        return item;
      });
      return new_data;
    }
    return data;
  }

  const renderDropdown = (originNode: any) => {
    const { dropdownRender: _dropdownRender } = props;
    const menu = (
      <React.Fragment>
        <Checkbox
          checked={checkAll}
          onChange={(e: CheckboxChangeEvent) => setCheckAll(e.target.checked)}
          style={{ padding: "0 4px 4px 10px", width: '100%' }}
        >
          全部
        </Checkbox>
        {
          React.cloneElement(originNode, {
            options: setItemDisabled(checkAll, originNode.props.options)
          })
        }
      </React.Fragment>
    );

    return _dropdownRender ? _dropdownRender(menu) : menu;
  }

  return (
    <RcTreeSelect
      {...props}
      open={true}
      onChange={(value: any) => setSelectValue(value)}
      value={checkAll ? ["全部"] : selectValue}
      dropdownRender={renderDropdown}
    />
  )
}

export default TreeSelect;