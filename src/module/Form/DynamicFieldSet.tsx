import React, { useState, forwardRef } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import classNames from 'classnames';
import "./style/DynamicFieldSet.less";

export interface DynamicFormProps {
  form: any;
  name: string;
  addBtnText?: string;
  removeBtnText?: string;
  onChange?: Function;
  className?: string;
}


const DynamicFieldSet: any = (props: DynamicFormProps, _ref: any) => {
  const { 
    form, 
    form: { getFieldDecorator, getFieldValue }, 
    name,
    addBtnText,
    removeBtnText,
    className,
  } = props;
  const _name = name ?? "dynamicFieldSet";

  // 用来做计数值
  const [count, setCount] = useState(0 as number);
  const [keys, setKeys] = useState([0] as number[]);
  const [valueMap, setValueMap] = useState({});

  // 添加子项
  const addItem = (key: number) => {
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
    props?.onChange && props?.onChange(formatData(new_map));
    setValueMap(new_map);
  }

  // 渲染【删除】，【添加】按钮
  const renderOperationBtn = (length: number, key: number, index: number) => {
    const addBtn = (
      <Button type="link" onClick={() => addItem(key)}>
        {addBtnText ?? "添加"}
      </Button>
    );
    const removeBtn = (
      <Button type="link" onClick={() => removeItem(key)}>
        {removeBtnText ?? "删除"}
      </Button>
    );

    if(length === 1) {
      return addBtn;
    } else if(length === index + 1) {
      return (
        <React.Fragment>
          {addBtn}
          {removeBtn}
        </React.Fragment>
      );
    } else {
      return removeBtn;
    }
  }

  // 渲染子项
  const getItem = () => {
    return keys?.map((key: number, index: number) => (
      <Form.Item
        key={key}
      >
        {getFieldDecorator(`${_name}[${key}]`, {
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入内容",
            },
          ],
          preserve: false,
        })(
          <Input
            className='DynamicFieldSet-input'
            placeholder="content" 
            onChange={(event: any) => itemOnChange(event, `${_name}[${key}]`)} 
          />
        )}
        {  renderOperationBtn(keys.length, key, index) }
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
    <div className={classNames("DynamicFieldSet", className)} ref={_ref}>
      {getItem()}
    </div>
  )
}

const DynamicForm: any = forwardRef(DynamicFieldSet);

export default DynamicForm;