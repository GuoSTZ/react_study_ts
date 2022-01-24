import React, { useState, forwardRef } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import { debounce } from 'lodash';

const DynamicFieldSet: any = (props: any, _ref: any) => {
  const { form, form: { getFieldDecorator, getFieldValue }, name, onChange } = props;
  const _name = name ?? "dynamicFieldSet";

  // 用来做计数值
  const [count, setCount] = useState(0 as number);
  const [keys, setKeys] = useState([0] as number[]);
  const [valueMap, setValueMap] = useState({});

  // 添加子项
  const addItem = () => {
    setKeys(keys.concat([count + 1]));
    setCount(count + 1)
  }

  // 删除子项
  const removeItem = (key: number) => {
    if (keys?.length < 2) {
      return;
    }
    const new_keys = keys?.filter((item: number) => item !== key);
    setKeys(new_keys);
  }

  // 格式化抛出数据
  const formatData = (value: any, type?: string) => {
    const res = Object.values(value);
    return res;
  }

  // 子项onChange回调
  const itemOnChange = (e: any, name: string) => {
    const new_map = Object.assign({}, valueMap, { [name]: e?.target?.value });
    onChange && onChange(formatData(new_map));
    setValueMap(new_map);
  }

  // 渲染子项
  const getItem = () => {
    return keys?.map((key: number, index: number) => (
      <Form.Item
        // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        // label={index === 0 ? 'Passengers' : ''}
        // required={false}
        key={key}
      >
        {getFieldDecorator(`${_name}[${key}]`, {
          // validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入内容",
            },
          ],
          preserve: false,
        })(<Input placeholder="content" onChange={(event: any) => itemOnChange(event, `${_name}[${key}]`)} style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => removeItem(key)}
          />
        ) : null}
      </Form.Item>
    ))
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <div ref={_ref}>
      {getItem()}
      <Form.Item>
        <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>
          <Icon type="plus" /> Add field
        </Button>
      </Form.Item>
    </div>
  )
}

export default forwardRef(DynamicFieldSet) as any;