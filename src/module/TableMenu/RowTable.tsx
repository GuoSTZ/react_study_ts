import React, { useContext } from 'react';
import { Table } from 'antd';
import BaseTable, { BaseTableProps } from './BaseTable';
import { DispatchContext, StateContext } from '.';

export interface RowTableProps extends BaseTableProps{
}

const RowTable = (props: RowTableProps) => {
  const { dataSource, columns, ...otherProps } = props;
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const rowOnChange = (selectRowKeys: any[], selectRows: any[]) => {
    dispatch({type: 'sourceSelect', payload: ([] as any[]).concat(state?.sourceSelectRows, selectRows)});
  }

  return (
    <BaseTable
      {...props}
      rowOnChange={rowOnChange}
      rowSelection={{
        getCheckboxProps: (record: any) => {
          const target_keys = state?.targetSelectRows?.map((item: any) => item.key);
          if (target_keys?.includes(record?.key)) {
            return { disabled: true };
          } else {
            return {};
          }
        }
      }}
      showHeader={false}
      showButton={false}
      // expandedRowOnChange={rowOnChange}
    />
  );
}

export default RowTable;