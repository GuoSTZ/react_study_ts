import React, { useState, useEffect, ReactNode, Fragment, useReducer, createContext, useContext } from 'react';
import { Table } from "antd";
import classNames from 'classnames';
import SourceTable, { SourceTableProps } from './components/SourceTable';
import TargetTable, { TargetTableProps } from './components/TargetTable';
import RowTable from './components/RowTable';
import BaseTable, { BaseTableProps } from './components/BaseTable';
// import RowTable from './RowTable';
import selectReducer, { initialState } from './reducer';

export interface TableMenuProps {
  /**
   * 左侧表格组件配置
   */
  sourceTableConfig: BaseTableProps;
  /**
   * 右侧表格组件配置
   */
  targetTableConfig: BaseTableProps;
}

export const DispatchContext = createContext((action: any) => { });
export const StateContext = createContext(initialState);


const TableMenu = (props: TableMenuProps) => {
  const { sourceTableConfig, targetTableConfig } = props;
  const { customOnExpand = [] } = sourceTableConfig;
  const { dataSource: target_dataSource = [] } = targetTableConfig;

  const [state, dispatch] = useReducer(selectReducer, initialState);
  const { sourceSelectRows, targetSelectRows, rowSelectRows } = state;

  const [targetData, setTargetData] = useState([] as any);
  const [expandedRowData, setExpandedRowData] = useState({} as any);

  useEffect(() => {
    setTargetData(target_dataSource);
  }, [target_dataSource]);

  // 拆解rowSelectRows
  const splitRowSelectRows = (rowSelectRows: any): any => {
    let rows: any[] = [];
    for (let key in rowSelectRows) {
      let arr = rowSelectRows[key]?.map((item: any) => {
        rows.push(item);
      });
    }
    return rows;
  }

  // 勾选框设置
  const getCheckboxProps = (record: any) => {
    const target_keys = targetData?.map((item: any) => item.key);
    if (target_keys?.includes(record?.key)) {
      return { disabled: true };
    } else {
      return {};
    }
  }

  // 左侧表格按钮点击回调
  const sourceOnClick = (source: any[]) => {
    // 去重
    const obj: any = {};
    const data = [].concat(targetData, sourceSelectRows, splitRowSelectRows(rowSelectRows));
    const res = data?.reduce((cur: any, next: any) => {
      if (!obj[next.key]) {
        obj[next.key] = true;
        cur?.push(next);
      }
      return cur;
    }, []);
    setTargetData(res);
    // 恢复初始状态
    dispatch({ type: 'sourceSelect', payload: [] });
    dispatch({ type: 'rowSelect', payload: {} });
  }

  // 右侧表格按钮点击回调
  const targetOnClick = (source: any[]) => {
    const targetSelect_keys = targetSelectRows?.map((item: any) => item.key);
    const data = source?.filter((item: any) => !targetSelect_keys?.includes(item.key));
    setTargetData(data);
    dispatch({ type: 'targetSelect', payload: [] });
  }

  // 嵌套子表格设置
  const renderRowTable = (_level: number) => {
    const len = customOnExpand?.length;
    const expandedRowConfig: any = {};
    if(_level < len) {
      expandedRowConfig.expandedRowRender = renderRowTable(_level+1);
      expandedRowConfig.onExpand = onExpand(_level+1);
    }
    return (record: any, index: number, indent: any, expanded: boolean) => {
      if (expanded) {
        return (
          <RowTable
            className="RowTable"
            fatherKey={record.key}
            columns={sourceTableConfig?.columns}
            dataSource={expandedRowData[record.key]}
            rowSelection={{ getCheckboxProps }}
            showExpandedRow={_level < len}
            {...expandedRowConfig}
          />
        )
      }
    }
  }

  // 左侧表格展开回调
  const onExpand = (_level: number = 1) => {
    return (expanded: boolean, record: any) => {
      // 传入customOnExpand且长度大于0，表明需要做嵌套子表格
      if(customOnExpand && customOnExpand?.length > 0 && _level > 0) {
        customOnExpand[_level-1](expanded, record, (data: any) => {
          setExpandedRowData(Object.assign({}, expandedRowData, { [record.key]: data }));
        });
      }
    }
  }

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <div className='TableMenu'>
          <SourceTable
            {...sourceTableConfig}
            className={classNames("SourceTable", sourceTableConfig?.className)}
            btnOnClick={sourceOnClick}
            btnDisabled={sourceSelectRows?.length === 0 && splitRowSelectRows(rowSelectRows)?.length === 0}
            showHeader={false}
            showExpandedRow={customOnExpand?.length > 0}
            expandedRowRender={renderRowTable(1)}
            onExpand={onExpand(1)}
            rowSelection={{ getCheckboxProps }}
          />

          <TargetTable
            {...targetTableConfig}
            className={classNames("TargetTable", targetTableConfig?.className)}
            btnOnClick={targetOnClick}
            btnDisabled={targetSelectRows?.length === 0}
            dataSource={targetData}
          />
        </div>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default TableMenu;