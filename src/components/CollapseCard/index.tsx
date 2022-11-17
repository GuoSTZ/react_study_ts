import React, { useState, useEffect } from 'react';
import { Collapse, Checkbox } from 'antd';
import { CollapseProps } from 'antd/lib/collapse';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import './index.less';

const { Panel } = Collapse;

type ActiveKeyType = (string | number)[];

export interface CollapseCardProps extends CollapseProps {
  value?: any;
}

type CompoundedComponent = ((props: CollapseCardProps) => React.ReactElement) & {
  defaultProps: CollapseCardProps
  Panel: typeof Panel
}

const CollapseCard: CompoundedComponent = props => {
  const { className, onChange, children, defaultActiveKey, value, ...restProps } = props;

  useEffect(() => {
    const mergedActiveKey: any[] = value || defaultActiveKey || [];
    setActiveKey(mergedActiveKey)
  }, [value, defaultActiveKey])

  const [activeKey, setActiveKey] = useState([] as ActiveKeyType);

  const collapseOnchange = (key: any) => {
    setActiveKey(key);
    onChange?.(key);
  }

  const checkOnChange = (e: CheckboxChangeEvent, key: any) => {
    let data: any[];
    if (e?.target?.checked) {
      data = [...activeKey, key];
    } else {
      data = activeKey.filter((item: any) => item !== key);
    }
    setActiveKey(data)
    onChange?.(data);
  }

  const renderHeader = (text: string, key: any) => {
    return (
      <React.Fragment>
        <Checkbox
          checked={activeKey.includes(key)}
          onChange={(e: CheckboxChangeEvent) => checkOnChange(e, key)} />
        <span>{text}</span>
      </React.Fragment>
    )
  }

  const renderChildren = () => {
    if (!children) {
      return;
    }
    const data = Array.isArray(children) ? children : [children];
    return data.map((child: any, index: number) => {
      if (child?.type?.name !== 'CollapsePanel') {
        return (
          <Panel header={renderHeader('-', index)} key={index} showArrow={false}>
            {child}
          </Panel>
        )
      } else {
        return React.cloneElement(child, {
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
      onChange={collapseOnchange}
      className={classNames('collapse-card', className)}>
      {renderChildren()}
    </Collapse>
  )
}

CollapseCard.defaultProps = {
};
CollapseCard.Panel = Panel;

export default CollapseCard;