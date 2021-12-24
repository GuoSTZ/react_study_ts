import React, { useContext } from 'react';
import BaseTable, { BaseTableProps } from './BaseTable';
import { DispatchContext, StateContext } from '..';
import './index.less';

export interface SourceTableProps extends BaseTableProps {
}

const SourceTable = (props: SourceTableProps) => {

  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const rowOnChange = (selectRowKeys: any[], selectRows: any[]) => {
    dispatch({type: 'sourceSelect', payload: selectRows});
  }

  return (
    <BaseTable 
      {...props}
      rowOnChange={rowOnChange}
    />
  )
}

export default SourceTable;