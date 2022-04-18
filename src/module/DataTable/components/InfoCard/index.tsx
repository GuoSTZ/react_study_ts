import React from 'react';
import { Avatar, Descriptions } from 'antd';
import BaseDescription from '../BaseDescription';
import './index.less';

export interface InfoCardProps {
  title: string;
  desc?: string;
  info: any;
}

const InfoCard: React.FC<InfoCardProps> = props => {
  const {title, desc, info} = props;  
  const { dataSource, ...otherProps } = info;

  // 默认裁剪title的前两个字符为图标内容
  const cutTitle = (data: string) => data.slice(0, 2);

  return (
    <div className='info-card'>
      <Avatar size={56}>{cutTitle(title)}</Avatar>
      <div className='info-card-content'>
        <div className='info-card-title'>
          <div>{title}</div>
          <div>{desc}</div>
        </div>
        <BaseDescription {...otherProps} dataSource={dataSource} />
      </div>
    </div>
  )
}

export default InfoCard;