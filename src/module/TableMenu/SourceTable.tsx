import React, { Fragment, useEffect, useState } from 'react';
import BaseTable, { BaseTableProps } from './BaseTable';

import './index.less';

export interface SourceTableProps extends BaseTableProps {
  target_dataSource?: any[];
}

const SourceTable = (props: SourceTableProps) => {
  const { target_dataSource, ...otherProps } = props;
  return (
    <BaseTable 
      {...otherProps}
      rowSelection={{
        getCheckboxProps: (record: any) => {
          const target_keys = target_dataSource?.map((item: any) => item.key);
          if(target_keys?.includes(record?.key)) {
            return { disabled: true };
          } else {
            return {};
          }
        }
      }}
    />
  )
}

export default SourceTable;