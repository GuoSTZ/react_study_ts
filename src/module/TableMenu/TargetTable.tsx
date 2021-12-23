import React, { useContext } from 'react';
import BaseTable, { BaseTableProps } from './BaseTable';
import { DispatchContext, StateContext } from '.';

import './index.less';

export interface TargetTableProps extends BaseTableProps{

}

const TargetTable = (props: TargetTableProps) => {
  const dispatch = useContext(DispatchContext);

  const rowOnChange = (selectRowKeys: any[], selectRows: any[]) => {
    dispatch({type: 'targetSelect', payload: selectRows});
  }
  return (
    <BaseTable 
      {...props}
      rowOnChange={rowOnChange}
    />
  )
}

export default TargetTable;