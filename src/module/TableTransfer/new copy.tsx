import React, { useEffect, useState } from 'react';
import { Transfer, Table } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import { debounce } from 'lodash';
import './index.less';

export interface TableTransferProps extends Omit<TransferProps, "listStyle"> {
  /**
   * 左侧表格列配置
   */
  leftColumns: ColumnProps<any>[];
  /**
   * 右侧表格列配置
   */
  rightColumns: ColumnProps<any>[];
  /**
   * 每页展示条数
   */
  itemSize?: number;
  /**
   * 自定义下拉菜单选取条数
   */
  dropdownSelectCount?: number[];
  /**
   * 允许转移的最大数据量
   */
  maxTargetKeys?: number;
  /**
   * 自定义穿梭框样式
   */
  listStyle?: any;
  /**
   * 自定义报错信息
   */
  maxErrorMsg?: string;
}

type DirectionType = 'left' | 'right';

const TableTransfer = React.forwardRef<any, TableTransferProps>((props, ref) => {
  const {
    className,
    dataSource,
    filterOption,
    itemSize,
    leftColumns,
    render,
    rightColumns,
    rowKey,
    selectedKeys,
    showSelectAll,
    targetKeys,
    ...restProps
  } = props;
  const [sourceData, setSourceData] = useState([] as any);
  const [targetData, setTargetData] = useState([] as any);
  const [leftKeys, setLeftKeys] = useState([] as any);
  const [rightKeys, setRightKeys] = useState([] as string[]);
  const [enableKeys, setEnableKeys] = useState({ 'left': [], 'right': [] } as any);
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([] as string[]);
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([] as string[]);
  const [filterData, setFilterData] = useState({ 'left': [], 'right': [] } as any);
  const [filterDataKeys, setFilterDataKeys] = useState({ 'left': [], 'right': [] } as any);
  const [filterValue, setFilterValue] = useState({ 'left': '', 'right': '' });
  
  const [sourcePage, setSourcePage] = useState(1);                                     // 左侧穿梭框当前页码
  const [targetPage, setTargetPage] = useState(1);

  const getRowKey = (record: any) => typeof rowKey === 'function' ? rowKey(record) : record.key;
  const getTitle = (record: any) => typeof render === 'function' ? render(record) : record.title;

  /** 初始化 targetKeys 影响的值 */
  const [initRightDataSet] = React.useMemo(() => {
    console.log("====targetKeys")
    const dataSet = new Set();
    targetKeys?.forEach((key: any) => {
      dataSet.add(key);
    })
    setRightKeys(targetKeys || []);
    return [dataSet]
  }, [targetKeys])

  /** 初始化 dataSource 影响的值 */
  const [
    allData,
    allDataKeys,
    allDataMap,
    allDataEnable,
    allDataEnableKeys,
    initLeftData,
    initLeftDataKeys,
    initLeftDataMap,
    initLeftDataEnable,
    initLeftDataEnableKeys,
    initRightData,
    initRightDataKeys,
    initRightDataMap,
    initRightDataEnable,
    initRightDataEnableKeys
  ] = React.useMemo(() => {
    console.log("====dataSource")
    const data = new Array();
    const dataKeys = new Array();
    const dataMap = new Map();
    const dataEnable = new Array();
    const dataEnableKeys = new Array();
    const dataEnableMap = new Map();

    const lData = new Array();
    const lDataKeys = new Array();
    const lDataMap = new Map();
    const lDataEnable = new Array();
    const lDataEnableKeys = new Array();
    const lDataEnableMap = new Map();

    const rData = new Array();
    const rDataKeys = new Array();
    const rDataMap = new Map();
    const rDataEnable = new Array();
    const rDataEnableKeys = new Array();
    const rDataEnableMap = new Map();

    dataSource?.forEach((record: any) => {
      // 主键设置
      const key = getRowKey(record);
      // title设置
      const title = getTitle(record);
      const item = Object.assign({}, record, { title, key });

      data.push(item);
      dataKeys.push(key);
      dataMap.set(key, item);
      if (!item.disabled) {
        dataEnable.push(item);
        dataEnableKeys.push(key);
        dataEnableMap.set(key, item);
      }

      if (!initRightDataSet.has(key)) {
        lData.push(item);
        lDataKeys.push(key);
        lDataMap.set(key, item);
        if (!item.disabled) {
          lDataEnable.push(item);
          lDataEnableKeys.push(key);
          lDataEnableMap.set(key, item);
        }
      } else {
        rData.push(item);
        rDataKeys.push(key);
        rDataMap.set(key, item);
        if (!item.disabled) {
          rDataEnable.push(item);
          rDataEnableKeys.push(key);
          rDataEnableMap.set(key, item);
        }
      }
    })

    return [
      data, dataKeys, dataMap, dataEnable, dataEnableKeys,
      lData, lDataKeys, lDataMap, lDataEnable, lDataEnableKeys,
      rData, rDataKeys, rDataMap, rDataEnable, rDataEnableKeys,
    ]
  }, [dataSource])

  /** 初始化 selectedKeys 影响的值 */
  useEffect(() => {
    const source: string[] = [];
    const target: string[] = [];
    console.log("====selectedKeys")
    selectedKeys?.forEach((key: string) => {
      initLeftDataMap.has(key) && source.push(key);
      initRightDataMap.has(key) && target.push(key);
    });
    setSourceSelectedKeys(source);
    setTargetSelectedKeys(target);
  }, [selectedKeys])

  useEffect(() => {
    console.log("=====filterValue['left']")
    const lData = new Array();
    const lDataKeys = new Array();
    const lDataMap = new Map();
    const lDataEnableKeys = new Array();

    const rData = new Array();
    const rDataMap = new Map();
    const rDataEnableKeys = new Array();

    rightKeys.length > 0 && dataSource?.forEach((record: any) => {
      // 主键设置
      const key = getRowKey(record);
      // title设置
      const title = getTitle(record);
      const item = Object.assign({}, record, { title, key });

      if (rightKeys.indexOf(key) === -1) {
        lData.push(item);
        lDataKeys.push(key);
        lDataMap.set(key, item);
        !item.disabled && lDataEnableKeys.push(key);
      } else {
        rData.push(item);
        rDataMap.set(key, item);
        !item.disabled && rDataEnableKeys.push(key);
      }
    })
    setSourceData(lData);
    setLeftKeys(lDataKeys);
    setTargetData(rData);
    setEnableKeys({
      'left': lDataEnableKeys,
      'right': rDataEnableKeys
    })
  }, [filterValue['left']])

  /** 默认筛选函数 */
  const defaultFilterOption = (inputValue: string, record: any) => {
    const title = getTitle(record);
    return title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
  }

  /** 筛选函数合并 */
  const mergedFilterOption = typeof filterOption === 'function'
    ? filterOption
    : defaultFilterOption

  /** keys数组取反 */
  const contraryKeys = (keys: any[], target: any[]) => {
    return keys.filter((item: any) => target?.indexOf(item) === -1);
  }

  const onChange = (nextTargetKeys: any, direction: string, moveKeys: string[]) => {
    let res: any = [];
    if(direction === 'right') {
      res = ([] as any).concat(targetKeys, sourceSelectedKeys);
    } else {
      targetKeys?.forEach((key: any) => {
        if(!targetSelectedKeys.includes(key)) {
          res.push(key);
        }
      })
    }
    console.log(res, '=====')
    setRightKeys(res);
    props.onChange?.(nextTargetKeys, direction, moveKeys);
  }

  /** 获取筛选后的数据 */
  const getFilterData = (array: any[], inputValue: string) => {
    const data: any[] = [];
    const dataKeys: any[] = [];
    array.forEach((record: any) => {
      const isFiltered = mergedFilterOption(inputValue, record);
      if (isFiltered) {
        data.push(record);
        dataKeys.push(getRowKey(record));
      }
    })
    return {data, dataKeys};
  }

  // 搜索回调
  const onSearch = (direction: DirectionType, value: string) => {
    setFilterValue(Object.assign({}, filterValue, { [direction]: value }));
    let lFilterData = [], lFilterDataKeys = [], rFilterData = [], rFilterDataKeys = [];
    if (direction === 'left') {
      let {data, dataKeys} = getFilterData(sourceData, value);
      lFilterData = data;
      lFilterDataKeys = dataKeys;
    } else {
      let {data, dataKeys} = getFilterData(targetData, value);
      rFilterData = data;
      rFilterDataKeys = dataKeys;
    }
    setFilterData({
      'left': lFilterData,
      'right': rFilterData
    })
    setFilterDataKeys({
      'left': lFilterDataKeys,
      'right': rFilterDataKeys
    })
    props.onSearch?.(direction, value);
  }

  // 选中回调
  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSourceSelectedKeys(sourceSelectedKeys);
    setTargetSelectedKeys(targetSelectedKeys);

    props.onSelectChange?.(sourceSelectedKeys, targetSelectedKeys);
  }

  /** 全选所有 */
  const getSelectAll = (direction: DirectionType) => {
    if(direction === 'left') {
      if(!!filterValue[direction]) {
        setSourceSelectedKeys(filterDataKeys[direction]);
      } else {
        setSourceSelectedKeys(enableKeys[direction]);
      }
    } else {
      if(!!filterValue[direction]) {
        setTargetSelectedKeys(filterDataKeys[direction]);
      } else {
        setTargetSelectedKeys(enableKeys[direction]);
      }
    }
  }

  // const { DropdownView: LeftDropdown } = useDropdownView(handleDropdownConfig('left', `leftDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`));
  // const { DropdownView: RightDropdown } = useDropdownView(handleDropdownConfig('right', `rightDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`));
  console.log("========")
  return (
    <div className={`TableTransfer ${className}`}>
      {/* {<LeftDropdown />}
      {<RightDropdown />} */}
      <button onClick={() => getSelectAll('left')}>全选</button>
      <Transfer
        dataSource={dataSource}
        targetKeys={rightKeys}
        filterOption={mergedFilterOption}
        {...restProps}
        selectedKeys={[
          ...sourceSelectedKeys.slice((sourcePage - 1) * itemSize!, sourcePage * itemSize!), 
          ...targetSelectedKeys.slice((targetPage - 1) * itemSize!, targetPage * itemSize!)
        ]}
        onChange={onChange}
        onSelectChange={onSelectChange}
        onSearch={onSearch}
        showSelectAll={showSelectAll}
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
            getCheckboxProps: (item: any) => ({ disabled: listDisabled || item.disabled }),
            onSelect({ key }: any, selected: boolean) {
              onItemSelect(key, selected);
            },
            selectedRowKeys: listSelectedKeys,
            columnWidth: 40
          };

          return (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={filteredItems}
              size="small"
              style={{ pointerEvents: listDisabled ? 'none' : undefined }}
              onRow={({ key, disabled: itemDisabled }) => ({
                onClick: () => {
                  if (itemDisabled || listDisabled) return;
                  onItemSelect(key, !listSelectedKeys.includes(key));
                },
              })}
              showHeader={false}
              pagination={{
                pageSize: itemSize,
                simple: true,
                onChange(page, pageSize) {
                  direction === 'left' ? setSourcePage(page) : setTargetPage(page)
                }
              }}
            />
          );
        }}
      </Transfer>
    </div>
  )
})

export default TableTransfer;