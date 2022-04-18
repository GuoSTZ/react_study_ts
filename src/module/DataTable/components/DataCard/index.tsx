import React from 'react';
import BaseDescription from '../BaseDescription';

interface Item {
  label: string;
  value: React.ReactNode;
  span: number;
}

export interface DataCardProps {
  monitorData: any;
  dataLabel: any;
}

const DataCard: React.FC<DataCardProps> = props => {
  const { monitorData, dataLabel } = props;
  return (
    <div>
      <BaseDescription {...monitorData} />
      <BaseDescription {...dataLabel} />
    </div>
  )
}

export default DataCard;