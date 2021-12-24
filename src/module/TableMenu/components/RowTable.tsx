import React, { useContext } from 'react';
import { Table } from 'antd';
import BaseTable, { BaseTableProps } from './BaseTable';
import { DispatchContext, StateContext } from '..';
import './index.less';

export interface RowTableProps extends BaseTableProps{
  fatherKey: any;
}

const RowTable = (props: RowTableProps) => {
  const { fatherKey, rowSelection, ...otherProps } = props;
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);
  const { rowSelectRows } = state as any;
  const rowSelectRowKeys = rowSelectRows[fatherKey]?.map((item: any) => item.key);

  const rowOnChange = (selectRowKeys: any[], selectRows: any[]) => {
    dispatch({
      type: 'rowSelect', 
      payload: Object.assign({}, rowSelectRows, {[fatherKey]: selectRows})
    });
  }

  return (
    <BaseTable
      {...otherProps}
      showHeader={false}
      showButton={false}
      rowSelection={{
        ...rowSelection,
        selectedRowKeys: rowSelectRowKeys,
        onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
          rowOnChange(selectedRowKeys, selectedRows);
        },
      }}
    />
  );
}

export default RowTable;