import React, { ReactNode } from 'react';
import { Descriptions } from 'antd';
import { DescriptionsProps } from 'antd/lib/descriptions';
import classnames from 'classnames';
import './index.less';

export interface BaseDescriptionProps extends DescriptionsProps {
  dataSource: any[];
  className: string;
}

const BaseDescription: React.FC<BaseDescriptionProps> = props => {
  const { dataSource, className, ...otherProps } = props;

  const renderItem = (item: {label: ReactNode, value: ReactNode | string, span: number}) => {
    const { 
      label, 
      span = 1,
      value = "-"
    } = item;
    return (
      <Descriptions.Item span={span} label={label}>
        { 
          (typeof value === 'string' || typeof value === 'number') 
            // @ts-ignore
            ? <span title={value}>{value}</span> 
            : value
        }
      </Descriptions.Item>
    )
  }

  return (
    <Descriptions {...otherProps} className={classnames("base-descriptions", className)}>
      { dataSource.map(renderItem) }
    </Descriptions>
  )
}

export default BaseDescription;