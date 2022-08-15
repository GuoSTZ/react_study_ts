import React, { useState } from 'react';
import { Collapse, Checkbox, Button } from 'antd';
import { CollapseProps } from 'antd/lib/collapse';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import './index.less';

const { Panel } = Collapse;

type ActiveKeyType = string | number | string[] | number[] | undefined;

export interface CollapseCardProps extends CollapseProps {
  className?: string;
}

const CollapseCard: React.FC<CollapseCardProps> = props => {
  const { className, onChange, children } = props;

  const [activeKey, setActiveKey] = useState(undefined as ActiveKeyType);
  const [checked, setChecked] = useState(false);

  const handleChange = (key: string | string[]) => {
    setActiveKey(key);
    onChange?.(key);
  }

  const checkOnChange = (e: CheckboxChangeEvent) => {
    setChecked(!!e?.target?.checked);
    if (e?.target?.checked) {
      setActiveKey('1');
    } else {
      setActiveKey(undefined);
    }
  }

  const renderExpandIcon = (panelProps: any) => {
    return (
      <Checkbox onChange={checkOnChange} />
    )
  }

  const extraNodeOnClick = () => {
    setActiveKey(origin => {
      if(origin === '1') {
        return undefined
      } else {
        return '1'
      }
    })
  }

  const renderExtra = () => {
    return (
      <Button type='link' disabled={!checked} onClick={extraNodeOnClick}>
        {activeKey === '1' ? '收起设置' : '展开设置'}
      </Button>
    )
  }

  return (
    <Collapse
      activeKey={activeKey}
      destroyInactivePanel
      className={classNames('collapse-card', className)}
      // onChange={handleChange}
      expandIcon={renderExpandIcon}>
      <Panel header="短信" key="1" extra={renderExtra()}>
        {children}
      </Panel>
    </Collapse>
  )
}

export default CollapseCard;