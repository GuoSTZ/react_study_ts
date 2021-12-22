import React, { useState, useEffect, ReactNode, Fragment } from 'react';
import { Table } from "antd";
import classNames from 'classnames';
import SourceTable, { SourceTableProps } from './SourceTable';
import TargetTable, { TargetTableProps } from './TargetTable';
import BaseTable, { BaseTableProps } from './BaseTable';
// import RowTable from './RowTable';

export interface TableMenuProps {
  sourceTableConfig: BaseTableProps;
  targetTableConfig: BaseTableProps;
}

const TableMenu = (props: TableMenuProps) => {
  const { sourceTableConfig, targetTableConfig } = props;
  const { dataSource: target_dataSource = [] } = targetTableConfig;
  const [ targetData, setTargetData ] = useState([] as any);
  const [ rowData, setRowData ] = useState([] as any);
  const [ clearSelectRowFun, setClearSelectRowFun ] = useState([] as any);

  useEffect(() => {
    setTargetData(target_dataSource)
  }, [target_dataSource]);

  // 左侧表格按钮点击回调
  const sourceOnClick = (source: any[], selectRowKeys: any[], selectRows: any[]) => {
    // 此处建议修改，毕竟是个对象数组，new Set可能会有问题
    const data = Array.from(new Set(([] as any).concat(targetData, selectRows, rowData)));
    console.log(data, '==')
    setTargetData(data);
    // 清空子表格的勾选项
    clearSelectRowFun?.map((func: Function) => func && func())
  }

  // 右侧表格按钮点击回调
  const targetOnClick = (source: any[], selectRowKeys: any[], selectRows: any[]) => {
    const data = source?.filter((item: any) => !selectRowKeys?.includes(item.key));
    setTargetData(data);
  }

  const rowOnChange = (selectedRowKeys: any[], selectedRows: any[], callback: Function) => {
    setRowData(selectedRows);
    setClearSelectRowFun(clearSelectRowFun.concat(callback));
  }

  const rowTable = () => {
    const data = [];
    for (let i = 1000; i < 1003; ++i) {
      data.push({
        key: i,
        name: `测试${i}`,
        age: Math.floor(Math.random()*200),
        address: `地址${i}`
      });
    }

    return (
      <BaseTable
        columns={sourceTableConfig?.columns}
        dataSource={data}
        pagination={false}
        rowSelection={{}}
        showHeader={false}
        showButton={false}
        rowOnChange={rowOnChange}
      />
    )
  }

  return (
    <div className='TableMenu'>
      <BaseTable
        {...sourceTableConfig}
        className={classNames("SourceTable", sourceTableConfig?.className)}
        btnOnClick={sourceOnClick}
        rowSelection={{
          getCheckboxProps: (record: any) => {
            const target_keys = targetData?.map((item: any) => item.key);
            if (target_keys?.includes(record?.key)) {
              return { disabled: true };
            } else {
              return {};
            }
          },
          // fixed: true
        }}
        expandedRowRender={rowTable}
      />
      <BaseTable
        {...targetTableConfig}
        className={classNames("TargetTable", targetTableConfig?.className)}
        btnOnClick={targetOnClick}
        dataSource={targetData}
      />
    </div>
  )
}

export default TableMenu;