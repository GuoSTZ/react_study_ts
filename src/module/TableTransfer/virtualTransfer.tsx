import React, { useState, useEffect, useMemo } from 'react';
import { Transfer, Table, Button } from 'antd';
import { TransferProps, ListStyle } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import './index.less';

export interface VirtualTransferProps extends Omit<TransferProps, 'listStyle'> {
  /**
   * 左侧表格列配置
   */
  leftColumns: ColumnProps<any>[];
  /**
   * 右侧表格列配置
   */
  rightColumns: ColumnProps<any>[];
  listStyle?: ((style: ListStyle) => React.CSSProperties) | React.CSSProperties;
}

const VirtualTransfer: React.FC<VirtualTransferProps> = props => {
  const {
    className,
    dataSource,
    filterOption,
    leftColumns,
    render,
    rightColumns,
    rowKey,
    targetKeys,
    ...restProps
  } = props;

  const ref: any = React.useRef();
  const tableRef: any = React.useRef();

  const PAGE_SIZE = 10;

  const [page, setPage] = useState({
    'left': 1,
    'right': 1
  })
  const [tableData, setTableData] = useState({
    'left': [],
    'right': []
  })
  const [selectedData, setSelectedData] = useState({
    'left': [],
    'right': []
  }) 
  const [tableKeys, setTableKeys] = useState({
    'left': [],
    'right': [] as any[]
  })
  const [tableSelectedKeys, setTableSelectedKeys] = useState({
    'left': [] as any[],
    'right': [] as any[]
  })

  const getRowKey = (record: any) => typeof rowKey === 'function' ? rowKey(record) : record.key;
  const getTitle = (record: any) => typeof render === 'function' ? render(record) : record.title;
  const getRecordKey = (record: any, index: number) => {
    const { rowKey } = props;
    const recordKey =
      typeof rowKey === 'function' ? rowKey(record) : record.key;
    return recordKey === undefined ? index : recordKey;
  }

  /** 获取全部数据的key和map */
  const [dataSourceKey, dataSourceMap, dataSourceSelectedMap] = useMemo(() => {
    const dataKey: any[] = []; // 记录所有数据的key值
    const dataMap = new Map();
    const dataSelectedMap = new Map(); // 记录数据是否被勾选
    dataSource?.map((record: any, index: number) => {
      const key = getRecordKey(record, index);
      dataKey.push(key);
      dataMap.set(key, record);
      dataSelectedMap.set(key, false);
    })
    return [dataKey, dataMap, dataSelectedMap];
  }, [dataSource])

  useEffect(() => {
    setTableKeys(origin => Object.assign({}, origin, {'right': targetKeys}))
  }, [targetKeys])

  useEffect(() => {
    const targetMap = new Map();
    tableKeys['right'].forEach((item: any, index: number) => {
      targetMap.set(item, index);
    })
    let lData: any[] = [];
    let lDataKey: any[] = [];
    let rData: any[] = [];
    dataSource?.forEach((record: any, index: number) => {
      const key = getRecordKey(record, index);
      const idx = targetMap.get(key) ?? -1;
      if(idx > -1) {
        rData[idx] = record;
      } else {
        lDataKey.push(key);
        lData.push(record);
      }
    })
    setTableData(origin => Object.assign({}, origin, {
      'left': lData,
      'right': rData
    }));
    setTableKeys(origin => Object.assign({}, origin, {'left': lDataKey}))
  }, [tableKeys['right']])

  /** 默认筛选函数 */
  const defaultFilterOption = (inputValue: string, record: any) => {
    const title = getTitle(record);
    return title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
  }

  /** 筛选函数合并 */
  const mergedFilterOption = typeof filterOption === 'function'
    ? filterOption
    : defaultFilterOption
  
  const onChange = (targetKeys: string[], direction: string, moveKeys: string[]) => {
    setTableKeys(origin => Object.assign({}, origin, {
      'right': targetKeys
    }))
    moveKeys.forEach((item: any) => dataSourceSelectedMap.set(item, false));
  }

  const currentData = (direction: 'left'|'right') => 
    tableData[direction].slice((page[direction] - 1) * PAGE_SIZE, page[direction] * PAGE_SIZE)
  const currentSelectedKeys = (direction: 'left'|'right') => {
    const keys: any[] = [];
    currentData(direction).map((item: any) => {
      if(dataSourceSelectedMap.get(item.key)) {
        keys.push(item.key);
      }
    })
    return keys;
  }

  const { DropdownView: LeftDropdown } = useDropdownView({menuItems: [
    {title: '全选所有', onClick: () => {
      const keys: any[] = [];
      const len = tableKeys['left'].length;
      for(let i=0; i< len; i++) {
        const isDisabled = dataSourceMap.get(tableKeys['left'][i]).disabled;
        !isDisabled && keys.push(tableKeys['left'][i]);
        !isDisabled && dataSourceSelectedMap.set(tableKeys['left'][i], true);
      }
      ref?.current?.onItemSelectAll('left', keys, keys.length > 0)
    }},
    {title: '全选当页', onClick: () => {
      const keys: any[] = [];
      currentData('left')?.forEach((item: any) => {
        const status = dataSourceSelectedMap.get(item.key);
        !item.disabled && dataSourceSelectedMap.set(item.key, true);
        !item.disabled && !status && keys.push(item.key);
      })
      ref?.current?.onItemSelectAll('left', keys, keys.length > 0)
    }},
    {title: '反选当页', onClick: async () => {
      const keys: any[] = [];
      const _keys: any[] = [];
      currentData('left')?.forEach((item: any) => {
        const status = dataSourceSelectedMap.get(item.key);
        !item.disabled && dataSourceSelectedMap.set(item.key, !status);
        !item.disabled && !status && keys.push(item.key);
        !item.disabled && status && _keys.push(item.key);
      })
      await ref?.current?.onItemSelectAll('left', _keys, false)
      ref?.current?.onItemSelectAll('left', keys, true)
    }}
  ], className: `leftDropdown`});

  const { DropdownView: RightDropdown } = useDropdownView({menuItems: [
    {title: '全选所有', onClick: () => {
      const keys: any[] = [];
      const len = tableKeys['right'].length;
      for(let i=0; i< len; i++) {
        const isDisabled = dataSourceMap.get(tableKeys['right'][i]).disabled;
        !isDisabled && keys.push(tableKeys['right'][i]);
        !isDisabled && dataSourceSelectedMap.set(tableKeys['right'][i], true);
      }
      ref?.current?.onItemSelectAll('right', keys, keys.length > 0)
    }},
    {title: '全选当页', onClick: () => {
      const keys: any[] = [];
      currentData('right')?.forEach((item: any) => {
        const status = dataSourceSelectedMap.get(item.key);
        !item.disabled && dataSourceSelectedMap.set(item.key, true);
        !item.disabled && !status && keys.push(item.key);
      })
      ref?.current?.onItemSelectAll('right', keys, keys.length > 0)
    }},
    {title: '反选当页', onClick: async () => {
      const keys: any[] = [];
      const _keys: any[] = [];
      currentData('right')?.forEach((item: any) => {
        const status = dataSourceSelectedMap.get(item.key);
        !item.disabled && dataSourceSelectedMap.set(item.key, !status);
        !item.disabled && !status && keys.push(item.key);
        !item.disabled && status && _keys.push(item.key);
      })
      await ref?.current?.onItemSelectAll('right', _keys, false)
      ref?.current?.onItemSelectAll('right', keys, true)
    }}
  ], className: `rightDropdown`});

  return (
    <div className={`TableTransfer ${className ?? ""}`}>
      <LeftDropdown />
      <RightDropdown />
      <Transfer
        ref={ref}
        targetKeys={tableKeys['right']}
        showSearch
        filterOption={mergedFilterOption}
        {...restProps}
        onChange={onChange}
        showSelectAll={false}
      >
        {({
          direction,
          filteredItems,
          onItemSelectAll,
          onItemSelect,
          selectedKeys: listSelectedKeys,
          disabled: listDisabled,
        }) => {
          const columns = direction === 'left' ? leftColumns : rightColumns;
          const rowSelection = {
            selectedRowKeys: currentSelectedKeys(direction),
            getCheckboxProps: (item: any) => ({ disabled: item.disabled }),
            onSelect(record: any, selected: boolean, selectedRows: any[], nativeEvent: any) {
              if(selected) {
                // const keys = tableSelectedKeys[direction].concat(record.key);
                // setTableSelectedKeys(origin => Object.assign({}, origin, {[direction]: keys}))
                dataSourceSelectedMap.set(record.key, true)
              } else {
                // const keys = tableSelectedKeys[direction].filter((item: any) => item !== record.key);
                // setTableSelectedKeys(origin => Object.assign({}, origin, {[direction]: keys}))
                dataSourceSelectedMap.set(record.key, false)
              }
              onItemSelect(record.key, selected);
            },
            columnWidth: 40
          };

          return (
            <div>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={tableData[direction]}
                size="small"
                style={{ pointerEvents: listDisabled ? 'none' : undefined }}
                onRow={({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled) return;
                    const status = dataSourceSelectedMap.get(key);
                    dataSourceSelectedMap.set(key, !status)
                    onItemSelect(key, !status);
                  },
                })}
                showHeader={false}
                pagination={{
                  simple: true,
                  pageSize: PAGE_SIZE,
                  // total: 10,
                  onChange: (page: number) => {
                    setPage(origin => Object.assign({}, origin, {[direction]: page}))
                  }
                }}
              />
            </div>
          );
        }}
      </Transfer>
    </div>
  )
}

export default VirtualTransfer;