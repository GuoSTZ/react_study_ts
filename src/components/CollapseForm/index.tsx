import React, { useState, useEffect, ChangeEvent, ReactElement, JSXElementConstructor } from 'react';
import { Collapse, Checkbox, Form } from 'antd';
import { CollapseProps } from 'antd/lib/collapse';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import classNames from 'classnames';
import './index.less';

const { Panel } = Collapse;

type ConfigChildrenType = {
  name: string;
  label: React.ReactNode;
  content: ReactElement<any, string | JSXElementConstructor<any>>;
  options?: GetFieldDecoratorOptions;
}

type ConfigType = {
  label: React.ReactNode;
  name: string;
  value: React.Key;
  key: React.Key;
  used: number;
  total: number;
  tips: React.ReactNode;
  disabled: boolean;
  available: boolean;
  children?: ConfigChildrenType[] | null
}

type ValueType = {
  value: React.Key;
  children: {
    [key: string]: React.Key;
  }
}


type FormDataType = {
  [key: string]: {
    [key: string]: React.Key;
  }
}

export interface CollapseFormProps {
  value?: ValueType[];
  config: ConfigType[];
  form: any;
  onChange: any;
  className?: string;
  formilyForm?: any;
  isValidating?: boolean;
  defaultValue?: ValueType[];
}

const CollapseForm: React.FC<CollapseFormProps> = props => {
  const { 
    className, 
    config, 
    defaultValue, 
    form, 
    formilyForm, 
    isValidating, 
    onChange, 
    value, 
    ...restProps 
  } = props;
  const { getFieldDecorator } = form;

  const [activeKey, setActiveKey] = useState([] as string[]);
  const keyMap = new Map<string, string>()

  const validateForm = () => {
    form.validateFields((errors: any, values: any) => {
      if(!errors) {
        onChange?.(formatData(activeKey, values))
      } else {
        // 同样会抛出值，但是子组件内部的值也会被抛出，且值为undefined，可供外部校验判断
        onChange?.(formatData(activeKey, form.getFieldsValue()))
      }
    })
  }

  // 处理子组件的校验
  useEffect(() => {
    isValidating && validateForm()
  }, [isValidating])

  // 处理回填
  useEffect(() => {
    const mergedValue = value || defaultValue
    const keys: string[] = []

    mergedValue?.forEach(item => {
      const newValue = String(item.value)
      keys.push(newValue)
      if(keyMap.has(newValue)) {
        const name = keyMap.get(newValue)!
        Object.keys(item.children || []).map(key => {
          form.setFieldsValue({
            [`${name}.${key}`]: item.children[key]
          })
          // 由于内部校验未通过时也有onChange事件，故回填需要再次调用校验判断
          form.validateFields()
        })
      }
    })
    setActiveKey(keys)
  }, [value, defaultValue])

  // 数据格式化处理
  const formatData = (keyArray: string[], formData: FormDataType = {}) => {
    return keyArray.map(item => ({
      value: item,
      children: formData[keyMap.get(item) as string],
    }))
  }

  // 展开折叠面板时的回调
  const collapseOnchange = (key: string|string[]) => {
    setActiveKey(key as string[]);
    onChange?.(formatData(key as string[]))
  }

  // 勾选回调
  const checkOnChange = (e: CheckboxChangeEvent, key: string) => {
    let data: string[];
    if (e?.target?.checked) {
      data = [...activeKey, key];
    } else {
      data = activeKey.filter((item: any) => item !== key);
    }
    setActiveKey(data)
    onChange?.(formatData(data as string[]))
  }

  const renderHeader = (node: ConfigType) => {
    const newKey = String(node.key)
    const isActive = activeKey.includes(newKey)
    const usedCount = (isActive && node.used < node.total) ? node.used + 1 : node.used
    return (
      <>
        <div>
          <Checkbox
            checked={isActive}
            disabled={node.disabled}
            onChange={(e: CheckboxChangeEvent) => checkOnChange(e, newKey)} />
          <span>{node.label}</span>
        </div>
        <div>
          <span>{node.tips}</span>
          <span>{node.available && `\uFF1A${usedCount}/${node.total}`}</span>
        </div>
      </>
    )
  }

  // 面板未激活时，需要渲染子组件的同时，且不要触发校验
  const noRulesWhenNotActive = (key: string, options: GetFieldDecoratorOptions = {}) => {
    return activeKey.includes(key) ? options : {...options, rules: undefined}
  }

  const renderContent = (parent: ConfigType, children?: ConfigChildrenType[] | null) => {
    if(!children) {
      return null
    }
    return children.map((item, idx) => (
      <Form.Item key={idx} label={item.label} labelCol={{span: 6}} wrapperCol={{span: 18}}>
        {getFieldDecorator(`${parent.name}.${item.name}`, noRulesWhenNotActive(String(parent.key), item.options))(
          React.cloneElement(
            item.content, 
            {
              onChange: (e: any) => {
                item.content?.props?.onChange?.(e)
                const currentFormValue = form.getFieldsValue();
                currentFormValue[parent.name][item.name] = e?.target?.value
                onChange?.(formatData(activeKey, currentFormValue))
              }
            }
          )
        )}
      </Form.Item>
    ))
  }

  const renderChildren = () => {
    return config.map(child => {
      const newKey = String(child.key)
      !keyMap.has(newKey) && keyMap.set(newKey, child.name)
      return (
        <Panel 
          header={renderHeader(child)}
          disabled={child.disabled}
          key={child.key} 
          showArrow={false} 
          className={!child.children ? 'empty-content' : ''}
        >
          {renderContent(child, child.children)}
        </Panel>
      )
    })
  }

  return (
    <Form
      autoComplete="off">
      <Collapse
        // {...restProps}
        activeKey={activeKey}
        // destroyInactivePanel
        onChange={collapseOnchange}
        className={classNames('collapse-form', className)}>
        {renderChildren()}
      </Collapse>
    </Form>

  )
}

export default Form.create<CollapseFormProps>()(CollapseForm);