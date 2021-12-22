import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { TableProps } from 'antd/es/table/interface';
import classNames from 'classnames';
import { ButtonType } from 'antd/lib/button';

import './index.less';

export interface BaseTableProps extends TableProps<any> {
  dataSource: any[];
  columns: any[];
  showButton?: boolean;
  btnType?: ButtonType;
  btnText?: string;
  btnOnClick?: Function;
  className?: string;
  rowOnChange?: Function;
}

const BaseTable = (props: BaseTableProps) => {
  const {
    dataSource,
    columns,
    btnType = "primary",
    btnText,
    btnOnClick,
    className = "",
    rowSelection = {},
    showButton = true,
    rowOnChange,
    ...otherProps
  } = props;
  const [source, setSource] = useState([] as any);
  const [selectRowKeys, setSelectRowKeys] = useState([] as any);
  const [selectRows, setSelectRows] = useState([] as any);

  useEffect(() => {
    setSource(dataSource);
  }, [dataSource]);

  const clearSelectRows = () => {
    setSelectRowKeys([]);
    setSelectRows([]);
  }

  const onClick = () => {
    clearSelectRows();
    if (btnOnClick) {
      btnOnClick(source, selectRowKeys, selectRows);
    }
  }

  const tableConfig: BaseTableProps = {
    ...otherProps,
    dataSource: source,
    columns,
    pagination: false,
    rowSelection: {
      ...rowSelection,
      selectedRowKeys: selectRowKeys,
      onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
        setSelectRowKeys(selectedRowKeys);
        setSelectRows(selectedRows);
        if(rowOnChange) {
          rowOnChange(selectedRowKeys, selectedRows, clearSelectRows);
        }
      }
    }
  }

  return (
    <div className={classNames("BaseTable", className)}>
      {
        showButton && (
          <Button type={btnType} onClick={onClick}>
            {btnText}
          </Button>
        )
      }
      <Table {...tableConfig} />
    </div>
  )
}

export default BaseTable;