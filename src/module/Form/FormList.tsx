import React, { useState, forwardRef, useEffect, PropsWithChildren } from 'react';
import { Button } from 'antd';
import "./style/FormList.less";

export interface FormListProps {
  /**
   * 表单名称，控制动态子项name
   */
  name: string;
  /**
   * 父级Form表单属性form
   */
  form: any;
  /**
   * 自定义添加按钮
   */
  addBtnNode?: string | React.ReactNode;
  /**
   * 自定义删除按钮
   */
  removeBtnNode?: string | React.ReactNode;
  /**
   * 支持最大子项数量限制
   */
  max?: number;
  /**
   * 初始值设定
   */
  initialValue?: any[];
  /**
   * 子项渲染方法
   */
  children: (field: FormListFieldProps) => React.ReactNode;
}

export interface FormListFieldProps {
  /** FormList 表单名称 */
  name: string;
  /** 子项表单名称前缀 */
  fieldName: string;
  /** 子项key值 */
  key: number;
  /** 子项索引值 */
  index: number;
  /** 子项初始值对象 */
  values?: any;
}

const DynamicFieldSet: any = (props: FormListProps, _ref: any) => {
  const {
    name,
    form,
    addBtnNode = "添加",
    removeBtnNode = "删除",
    max,
    initialValue = []
  } = props;

  const [count, setCount] = useState(0 as number);   // 用来做计数值
  const [keys, setKeys] = useState([0] as number[]);

  useEffect(() => {
    // 数据回填处理
    const len = initialValue?.length || 0;
    if (len > 0) {
      setCount(len);
      const new_keys = [];
      for (let i = 0; i < len; i++) {
        new_keys.push(i);
      }
      setKeys(new_keys);
    }
  }, []);

  // 添加子项
  const addItem = (key: number) => {
    const obj = form.getFieldValue(name) || {};
    const index = keys.indexOf(key);
    if(obj[0] === undefined) {
      console.warn("请正确设置FormList组件 name 属性以及动态子项表单名称")
    }
    let fields = Object.keys(obj[0] || {})?.map((item: string) => `${name}.${index}.${item}`);
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

  // 处理自定义按钮
  const fixedButton = (key: number) => {
    const addBtn = React.isValidElement(addBtnNode)
      ? React.cloneElement(addBtnNode as any, { onClick: () => addItem(key) })
      : (<Button type="link" onClick={() => addItem(key)}>{addBtnNode}</Button>);
      
    const removeBtn = React.isValidElement(removeBtnNode)
      ? React.cloneElement(removeBtnNode as any, { onClick: () => removeItem(key) })
      : (<Button type="link" onClick={() => addItem(key)}>{removeBtnNode}</Button>);

    return {
      addBtn,
      removeBtn
    }
  }

  // 渲染【删除】，【添加】按钮
  const renderOperationBtn = (length: number, key: number, index: number) => {
    const { addBtn, removeBtn } = fixedButton(key);

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
        name,
        fieldName: `${name}.${index}`,
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

const FormList = forwardRef<FormListProps, any>(DynamicFieldSet);

export default FormList;