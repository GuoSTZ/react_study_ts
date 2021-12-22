import React, { Fragment, useState, useEffect } from 'react';
import BaseTable, { BaseTableProps } from './BaseTable';

import './index.less';

export interface TargetTableProps extends BaseTableProps{

}

const TargetTable = (props: TargetTableProps) => {
  return (
    <BaseTable className='TargetTable' {...props}/>
  )
}

export default TargetTable;