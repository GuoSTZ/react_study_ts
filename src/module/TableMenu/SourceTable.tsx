import React, { useContext } from 'react';
import BaseTable, { BaseTableProps } from './BaseTable';
import { DispatchContext, StateContext } from '.';

import './index.less';

export interface SourceTableProps extends BaseTableProps {
  target_dataSource?: any[];
}

const SourceTable = (props: SourceTableProps) => {
  const { target_dataSource, ...otherProps } = props;

  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const rowOnChange = (selectRowKeys: any[], selectRows: any[]) => {
    dispatch({type: 'sourceSelect', payload: ([] as any[]).concat(state?.sourceSelectRows, selectRows)});
  }

  return (
    <BaseTable 
      {...otherProps}
      rowOnChange={rowOnChange}
      rowSelection={{
        getCheckboxProps: (record: any) => {
          const target_keys = state?.targetSelectRows?.map((item: any) => item.key);
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