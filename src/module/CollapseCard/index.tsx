import React, { useState, useEffect } from 'react';
import { Collapse, Checkbox } from 'antd';
import { CollapseProps } from 'antd/lib/collapse';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import './index.less';

const { Panel } = Collapse;

type ActiveKeyType = (string | number)[];

export interface CollapseCardProps extends CollapseProps {
  mode?: 'dom'|'json';
}

type CompoundedComponent = ((props: CollapseCardProps) => React.ReactElement) & {
  defaultProps: CollapseCardProps
  Panel: typeof Panel
}

const CollapseCard: CompoundedComponent = props => {
  const { mode, className, onChange, children, defaultActiveKey, ...restProps } = props;

  useEffect(() => {
    setActiveKey(defaultActiveKey as any[] || [])
  }, [defaultActiveKey])

  const [activeKey, setActiveKey] = useState([] as ActiveKeyType);

  const checkOnChange = (e: CheckboxChangeEvent, key: any) => {
    let data: any[];
    if(e?.target?.checked) {
      data = [...activeKey, key];
    } else {
      data = activeKey.filter((item: any) => item !== key);
    }
    setActiveKey(data)
    onChange?.(data);
  }

  const renderHeader = (text: string, key: any) => {
    return (
      <Checkbox
        checked={activeKey.includes(key)}
        onChange={(e: CheckboxChangeEvent) => checkOnChange(e, key)}>
        {text}
      </Checkbox>
    )
  }

  const renderChildren = () => {
    if(!children) {
      return;
    }
    if(mode === 'json') {

    }
    console.log(children, '=------======child')
    const data = Array.isArray(children) ? children : [children];
    return data.map((child: any, index: number) => {
      if(child?.type?.name !== 'CollapsePanel') {
        return (
          <Panel header={renderHeader('-', index)} key={index} showArrow={false}>
            {child}
          </Panel>
        )
      } else {
        return React.cloneElement(child, {
          // ...child.props,
          header: renderHeader(child.props.header ?? '-', child.key ?? index),
          showArrow: false
        })
      }
    })
  }

  return (
    <Collapse
      {...restProps}
      activeKey={activeKey}
      destroyInactivePanel
      className={classNames('collapse-card', className)}>
      {renderChildren()}
    </Collapse>
  )
}

CollapseCard.defaultProps = {
  mode: 'dom'
};
CollapseCard.Panel = Panel;

export default CollapseCard;