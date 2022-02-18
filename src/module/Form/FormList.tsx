import React, { useState, forwardRef, useEffect } from 'react';
import { Form, Button, Icon, Input } from 'antd';
import "./style/DynamicFieldSet.less";

export interface DynamicFormProps {
  name: string;
  form: any;
  addBtnText?: string | React.ReactNode;
  removeBtnText?: string | React.ReactNode;
  max?: number;
  initialValue?: any[];
  children: (field: FormListFieldProps) => React.ReactNode;
}

export interface FormListFieldProps {
  name: string;
  key: number;
  index: number;
  values?: any;
}

const DynamicFieldSet: any = (props: DynamicFormProps, _ref: any) => {
  const {
    name,
    form,
    addBtnText,
    removeBtnText,
    max,
    initialValue = []
  } = props;

  const [count, setCount] = useState(0 as number);   // 用来做计数值
  const [keys, setKeys] = useState([0] as number[]);

  useEffect(() => {
    const len = initialValue?.length || 0; 
    if(len > 0) {
      setCount(len);
      const new_keys = [];
      for(let i=0; i< len; i++) {
        new_keys.push(i);
      }
      setKeys(new_keys);
    }
  }, []);

  // 添加子项
  const addItem = (key: number) => {
    const obj = form.getFieldValue(name) || {};
    const index = keys.indexOf(key);
    let fields = Object.keys(obj[0])?.map((item: string) => `${name}.${index}.${item}`);
    // 添加子项前，校验当前行规则
    form.validateFields(fields, (error: any, values: any) => {
      if (!error && (!max || keys.length < max)) {
        setKeys(keys.concat([count + 1]));
        setCount(count + 1);
      }
    })
  }

  // 删除子项
  const removeItem = (key: number) => {
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
      if (length === max) { // 达到最大数量限制时
        add = null;
      }
    } else { // 中间项
      remove = removeBtn;
    }

    return (
      <div className='FormList-btn'>
        {add}
        {remove}
      </div>
    )
  }

  // 渲染子项
  const getItem = () => {
    return keys?.map((key: number, index: number) => {
      const field = { 
        name: `${name}.${index}`, 
        key, 
        index, 
        values: initialValue[key] || {} 
      };
      return (
        <div key={key} className="FormList-Item">
          {typeof props.children === 'function' ? props.children(field) : null}
          {renderOperationBtn(keys.length, key, index)}
        </div>
      )
    })
  }

  return (
    <div className="FormList" ref={_ref}>
      {getItem()}
    </div>
  )
}

const FormList: any = forwardRef(DynamicFieldSet);

export default FormList;