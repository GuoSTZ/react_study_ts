import React, { useState, useEffect, ReactNode, Fragment, useReducer, createContext, useContext } from 'react';
import { Table } from "antd";
import classNames from 'classnames';
import SourceTable, { SourceTableProps } from './SourceTable';
import TargetTable, { TargetTableProps } from './TargetTable';
import RowTable from './RowTable';
import BaseTable, { BaseTableProps } from './BaseTable';
// import RowTable from './RowTable';
import selectReducer, { initialState } from './reducer';

export interface TableMenuProps {
  sourceTableConfig: BaseTableProps;
  targetTableConfig: BaseTableProps;
}

export const DispatchContext = createContext((action: any) => {});
export const StateContext = createContext(initialState);


const TableMenu = (props: TableMenuProps) => {
  const { sourceTableConfig, targetTableConfig } = props;
  const { dataSource: target_dataSource = [] } = targetTableConfig;

  const [state, dispatch] = useReducer(selectReducer, initialState);

  // 临时mock数据用 
  const [mockData, setMockData] = useState({} as any);
  const [targetData, setTargetData] = useState([] as any);
  const [expandedRowData, setExpandedRowData] = useState([] as any);
  const [clearSelectRowFun, setClearSelectRowFun] = useState([] as any);

  useEffect(() => {
    setTargetData(target_dataSource);
  }, [target_dataSource]);

  // 左侧表格按钮点击回调
  const sourceOnClick = (source: any[]) => {
    // 去重
    const obj: any = {};
    const data = [].concat(state?.sourceSelectRows, state?.targetSelectRows);
    const res = data?.reduce((cur: any, next: any) => {
      if (!obj[next.key]) {
        obj[next.key] = true;
        cur?.push(next);
      }
      return cur;
    }, []);
    setTargetData(res);
    dispatch({type: 'sourceSelect', payload: []});
    dispatch({type: 'targetSelect', payload: res});
    // 清空子表格的勾选项
    // clearSelectRowFun?.map((func: Function) => func && func());
  }

  // 右侧表格按钮点击回调
  const targetOnClick = (source: any[]) => {
    const target_keys = state?.targetSelectRows?.map((item: any) => item.key);
    const data = source?.filter((item: any) => !target_keys?.includes(item.key));
    setTargetData(data);
    dispatch({type: 'targetSelect', payload: data});
  }

  const rowTable = (record: any, index: number, indent: any, expanded: boolean) => {
    if (expanded) {
      return (
        <RowTable
          className='rowTable'
          columns={sourceTableConfig?.columns}
          dataSource={mockData[record.key]}
        />
      )
    }
  }

  const sourceOnExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      const data = [];
      for (let i = 1000; i < 1003; ++i) {
        data.push({
          key: i + record.key * 100,
          name: `测试${i + record.key * 100}`,
          age: i + record.key * 100,
          address: `地址${i + record.key * 100}`
        });
      }
      setMockData(Object.assign({}, mockData, { [record.key]: data }));
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
            // btnDisabled={}
            onExpand={sourceOnExpand}
            showExpandedRow
            expandedRowRender={rowTable}
          />

          <TargetTable
            {...targetTableConfig}
            className={classNames("TargetTable", targetTableConfig?.className)}
            btnOnClick={targetOnClick}
            dataSource={targetData}
          />
        </div>
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default TableMenu;