import React, { Fragment, useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { TableProps } from 'antd/es/table/interface';
import { ButtonProps } from 'antd/lib/button';
import classNames from 'classnames';
import { ButtonType } from 'antd/lib/button';
import './index.less';

type CallbackType = (data: any[]) => void;
type CustomOnExpandType = (expanded: boolean, record: any, callback: CallbackType) => void;

export interface BaseTableProps extends TableProps<any> {
  /**
   * 表格数据
   */
  dataSource: any[];
  /**
   * 表格列属性配置
   */
  columns: any[];
  /**
   * 是否展示按钮
   */
  showButton?: boolean;
  // ButtonProps?: ButtonProps;
  /**
   * 按钮类型
   */
  btnType?: ButtonType;
  /**
   * 按钮文字
   */
  btnText?: string;
  /**
   * 按钮点击回调
   */
  btnOnClick?: Function;
  /**
   * 按钮点击回调
   */
  btnDisabled?: boolean;
  /**
   * 自定义样式名
   */
  className?: string;
  /**
   * 行选中项发生变化时的回调
   */
  rowOnChange?: Function;
  /**
   * 是否展示展开行
   */
  showExpandedRow?: boolean;
  /**
   * 获取每层展开数据的方法
   */
  customOnExpand?: CustomOnExpandType[];
}

const BaseTable = (props: BaseTableProps) => {
  const {
    dataSource,
    columns,
    btnType = "primary",
    btnText,
    btnOnClick,
    btnDisabled,
    className = "",
    rowSelection = {},
    showButton = true,
    rowOnChange,
    showExpandedRow=false,
    customOnExpand,
    expandedRowRender,
    ...otherProps
  } = props;
  const [source, setSource] = useState([] as any);
  const [selectRowKeys, setSelectRowKeys] = useState([] as any);
  const [selectRows, setSelectRows] = useState([] as any);

  useEffect(() => {
    setSource(dataSource);
  }, [dataSource]);

  const onClick = () => {
    clearSelectRows();
    if (btnOnClick) {
      btnOnClick(source);
    }
  }

  const clearSelectRows = () => {
    setSelectRowKeys([]);
    setSelectRows([]);
  }

  const tableConfig: BaseTableProps = {
    ...otherProps,
    dataSource: source,
    columns,
    pagination: false,
  }

  if (showExpandedRow) {
    tableConfig.expandedRowRender = expandedRowRender
  }

  return (
    <div className={classNames("BaseTable", className)}>
      {
        showButton && (
          <Button type={btnType} onClick={onClick} disabled={btnDisabled}>
            {btnText}
          </Button>
        )
      }
      <Table
        {...tableConfig}
        rowSelection={{
          selectedRowKeys: selectRowKeys,
          onChange: (selectedRowKeys: any[], selectedRows: any[]) => {
            setSelectRowKeys(selectedRowKeys);
            setSelectRows(selectedRows);
            if (rowOnChange) {
              rowOnChange(selectedRowKeys, selectedRows);
            }
          },
          ...rowSelection
        }}
      />
    </div>
  )
}

export default BaseTable;