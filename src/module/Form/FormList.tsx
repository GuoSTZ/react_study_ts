import React, { useState, forwardRef, useEffect, ReactNode } from 'react';
import { Form, Input } from 'antd';
import useErrorList from './useErrorList';
import "./style/index.less";

export interface FormListProps {
  /**
   * 表单名称，控制子表单项name
   */
  name: string;
  /**
   * 父级Form表单属性form
   */
  form: any;
  /**
   * 自定义添加按钮
   */
  addNode?: string | ReactNode;
  /**
   * 自定义删除按钮
   */
  removeNode?: string | ReactNode;
  /**
   * 支持最大子项数量限制
   */
  max?: number;
  /**
   * 最大子项数量限制信息提示自定义
   */
  maxErrorMsg?: string;
  /**
   * 初始值设定
   */
  initialValue?: any[];
  /**
   * 子表单项渲染方法
   */
  children: (field: FormListFieldProps, operation: FormListOperationProps) => ReactNode;
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

export interface FormListOperationProps {
  AddNode: () => ReactNode;
  RemoveNode: () => ReactNode;
}

const DynamicFieldSet: any = (props: FormListProps, _ref: any) => {
  const {
    name,
    form,
    addNode = "添加",
    removeNode = "删除",
    max,
    maxErrorMsg,
    initialValue = []
  } = props;

  const [count, setCount] = useState(0 as number);   // 用来做计数值
  const [keys, setKeys] = useState([0] as number[]);
  const [errors, setErrors] = useState([] as ReactNode[]);
  const [ErrorList] = useErrorList();

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

  const getFileds = (key: number) => {
    const obj = form.getFieldValue(name) || {};
    const index = keys.indexOf(key);
    let fields = [];
    // 子项name设置为filedName.xxx时
    if (Object.prototype.toString.call(obj[index]) === '[Object Object]') {
      fields = Object.keys(obj[index] || {})?.map((item: string) => `${name}.${index}.${item}`);
    } else { // 子项name设置为filedName时
      fields = [`${name}.${index}`];
    }
    return fields;
  }

  // 添加子项
  const addItem = (key: number) => {
    // 添加子项前，校验当前行规则
    form?.validateFields(getFileds(key), (error: any, values: any) => {
      if (!error) {
        if(!max || keys.length < max) {
          setKeys(keys.concat([count + 1]));
          setCount(count + 1);
        } else {
          setErrors([ maxErrorMsg || `最多${max}项` ]);
        }
      }
      
    });
  }

  // 删除子项
  const removeItem = (key: number) => {
    // 删除节点时，被删除行的数据会出现遗留现象，因为下一行控件的id变成了被删除行控件的id
    // 将下一个节点的值填入到当前删除的节点位置
    // 替代解决方案，不使用索引值作为控件id，使用key值作为控件id，这样就不需要手动设置值
    const fields = getFileds(key);
    const index = keys.indexOf(key);
    fields?.map((item: string) => {
      let array: any = item?.split(".");
      array?.splice(1, 1, index + 1);
      form?.setFieldsValue({ [item]: form.getFieldValue(array.join(".")) });
    })
    const new_keys = keys?.filter((item: number) => item !== key);
    setKeys(new_keys);
    if(max && new_keys.length <= max) {
      setErrors([]);
    }
  }

  // 处理自定义按钮
  const fixedButton = (key: number) => {
    const addNodeProps = (addNode as any)?.props;
    const removeNodeProps = (removeNode as any)?.props;
    const addBtn = React.isValidElement(addNode)
      ? React.cloneElement(addNode as any, {
        className: `FormList-add ${addNodeProps.className}`,
        onClick: () => {
          addItem(key);
          addNodeProps?.onClick && addNodeProps?.onClick();
        }
      })
      : <a className='FormList-add' onClick={() => addItem(key)}>{addNode}</a>;

    const removeBtn = React.isValidElement(removeNode)
      ? React.cloneElement(removeNode as any, {
        className: `FormList-remove ${removeNodeProps?.className}`,
        onClick: () => {
          removeItem(key);
          removeNodeProps?.onClick && removeNodeProps?.onClick();
        }
      })
      : <a className='FormList-remove' onClick={() => removeItem(key)}>{removeNode}</a>;

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
    } else { // 中间项
      remove = removeBtn;
    }

    return { add, remove };
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
      const { add, remove } = renderOperationBtn(keys.length, key, index);
      const operation = {
        AddNode: () => add,
        RemoveNode: () => remove,
      }
      return typeof props.children === 'function' ? props.children(field, operation) : null;
    })
  }
  return (
    <div className="FormList" ref={_ref}>
      {getItem()}
      <Form.Item>
        <ErrorList errors={errors}/>
      </Form.Item>
    </div>
  )
}

const FormList = forwardRef<FormListProps, any>(DynamicFieldSet);

export default FormList;