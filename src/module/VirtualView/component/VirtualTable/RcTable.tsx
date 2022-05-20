import React from 'react';
import RcTable, { Summary } from 'rc-table';
import { TableProps as RcTableProps, INTERNAL_HOOKS } from 'rc-table/lib/Table';

export interface VirtualTableProps {

}

const VirtualTable: React.FC<VirtualTableProps> = props => {
  return (
    <RcTable />
  )
}