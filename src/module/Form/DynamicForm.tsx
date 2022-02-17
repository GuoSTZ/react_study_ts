import React, { useState, forwardRef, PropsWithChildren } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import classNames from 'classnames';
import "./style/DynamicFieldSet.less";

export interface DynamicFormProps {
  name: string;
  form: any;
  addBtnText?: string | React.ReactNode;
  removeBtnText?: string | React.ReactNode;
  className?: string;
  max?: number;
  addWithValidate?: boolean;
}

const DynamicFieldSet: any = (props: PropsWithChildren<DynamicFormProps>, _ref: any) => {
  const {
    name,
    form,
    addBtnText,
    removeBtnText,
    className,
    max,
    addWithValidate = true
  } = props;

  const [count, setCount] = useState(0 as number);   // 用来做计数值
  const [keys, setKeys] = useState([0] as number[]);

  // 添加子项
  const addItem = (key: number) => {
    const obj = form.getFieldValue(name) || {};
    let fields = Object.keys(obj[0])?.map((item: string) => `${name}.${key}.${item}`);
    // 添加子项时，是否校验当前行规则
    if(addWithValidate) {
      form.validateFields(fields, (error: any, values: any) => {
        if(!error) {
          setKeys(keys.concat([count + 1]));
          setCount(count + 1);
        }
      })
    } else {
      setKeys(keys.concat([count + 1]));
      setCount(count + 1);
    }
  }

  // 删除子项
  const removeItem = (key: number) => {
    if (keys?.length < 2) {
      return;
    }
    const new_keys = keys?.filter((item: number) => item !== key);
    setKeys(new_keys);
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

    let add = null;
    let remove = null;
    if (length === 1) {  // 只有一项时
      add = addBtn;
    } else if (length === index + 1) { // 最后一项
      add = addBtn;
      remove = removeBtn;
      if(length === max) { // 达到最大数量限制时
        add = null;
      }
    } else { // 中间项
      remove = removeBtn;
    }

    return (
      <div className='dynamicForm-btn'>
        {add}
        {remove}
      </div>
    )
  }

  // 渲染子项
  const getItem = () => {
    console.log(props.children, '==')
    return keys?.map((key: number, index: number) => (
      <div key={key} className="dynamicForm-item">
        {typeof props.children === 'function' ? props.children(key) : null }
        {renderOperationBtn(keys.length, key, index)}
      </div>
    ))
  }

  return (
    <div className={classNames("dynamicForm", className)} ref={_ref}>
      {getItem()}
    </div>
  )
}

const DynamicForm: any = forwardRef(DynamicFieldSet);

export default DynamicForm;