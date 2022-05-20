import React, { useState, useEffect } from 'react';
import { Transfer, Table, message } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import './index.less';

export interface TableTransferProps extends Omit<TransferProps, "listStyle"|'titles'> {
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
  /**
   * 穿梭框头部
   */
  titles?: React.ReactNode[];
}

const TableTransfer = (props: TableTransferProps) => {
  const [dataSource, setDataSource] = useState([] as any);                             // 全部数据 - dataSource
  const [dataSourceKeys, setDataSourceKeys] = useState([] as any);                     // 全部数据的key值
  const [targetKeys, setTargetKeys] = useState([] as any);                             // 右侧穿梭框内的数据
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([] as any);             // 左侧穿梭框被勾选的数据
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([] as any);             // 右侧穿梭框被勾选的数据
  const [sourcePage, setSourcePage] = useState(1);                                     // 左侧穿梭框当前页码
  const [targetPage, setTargetPage] = useState(1);                                     // 右侧穿梭框当前页面
  const [filterValue, setFilterValue] = useState({ 'left': '', 'right': '' } as any);  // 搜索框输入内容
  const [showMaxError, setShowMaxError] = useState(false);                             // 错误信息显示状态

  const {
    leftColumns,
    rightColumns,
    dataSource: _dataSource,
    targetKeys: _targetKeys,
    itemSize = 10,
    selectedKeys: _selectedKeys,
    showSelectAll = true,
    dropdownSelectCount = [],
    maxTargetKeys,
    className,
    maxErrorMsg,
    titles,
    ...restProps
  } = props;

  /** 当发生数据穿梭或者数据筛选时，进行数据处理 */
  const [targetKeySet, sourceKeys, sourceEnableKeys, targetEnabledKeys] = React.useMemo(() => {
    const targetSet = new Set(); // 转化为Set集合，便于后面的数据判断
    const sourceKeys: any = []; // 左侧穿梭框数据的key值数组
    const sourceEnableKeys: any = []; // 左侧穿梭框可选数据的key值数组
    const targetEnabledKeys: any = []; // 右侧穿梭框可选数据的key值数组

    targetKeys?.map((key: any) => {
      targetSet.add(key);
    });

    // 判断是否符合过滤条件
    const isFiltered = (title: string, direction: string) => 
      title?.toUpperCase()?.includes(filterValue[direction]?.toUpperCase());

    _dataSource?.map((record: any) => {
      const {key, disabled, title} = record;
      // 左侧数据处理
      if(!targetSet.has(key)) {
        sourceKeys.push(key);
        !disabled && isFiltered(title, 'left') && sourceEnableKeys.push(key);
      } else {
        !disabled && isFiltered(title, 'right') && targetEnabledKeys.push(key);
      }
    })
    return [targetSet, sourceKeys, sourceEnableKeys, targetEnabledKeys]
  }, [targetKeys, filterValue])

  useEffect(() => {
    setTargetKeys(_targetKeys || []);
  }, [_targetKeys]);

  useEffect(() => {
    const data: any = []; // 存储处理后的源数据
    const dataKeys: any = []; // 存储全部数据的key值
    _dataSource?.map((record: any) => {
      if(props.render) {
        data.push(Object.assign({}, record, {title: props.render?.(record)}))
      } else {
        data.push(Object.assign({}, record));
      }
      dataKeys.push(record.key);
    });
    setDataSource(data);
    setDataSourceKeys(dataKeys);
  }, [_dataSource]);

  useEffect(() => {
    const sourceKeys: any = [];
    const targetKeys: any = [];

    _selectedKeys?.forEach((key: any) => {
      if(targetKeySet?.has(key)) {
        targetKeys.push(key);
      } else {
        sourceKeys.push(key);
      }
    });
    setSourceSelectedKeys(sourceKeys);
    setTargetSelectedKeys(targetKeys);
  }, [_selectedKeys])

  // 筛选非禁用的数据key
  const getEnabledItemKeys = (data: any) => {
    const keys: any = [];
    data?.forEach((item: any) => {
      if (!item.disabled) {
        keys.push(item.key);
      }
    });
    return keys;
  }

  // 获取当页穿梭框显示的数据数组
  const getCurrentPageData = (data: any, page: number) => {
    return data?.slice((page - 1) * itemSize, page * itemSize);
  }

  // 获取筛选后穿梭框内显示的数据key值数组
  const getFilterDataKeys = (direction: string, count?: number) => {
    const data: any = {
      'left': [],
      'right': new Array(targetKeys.length)
    };
    let sum = 0;
    dataSource?.every((record: any) => {
      const indexOfKey = targetKeys.indexOf(record.key);
      const isFiltered = record?.title?.toUpperCase()?.includes(filterValue[direction]?.toUpperCase());
      const isEnabled = !record?.disabled;
      if(direction === 'left' && typeof count === 'number' && data[direction].length >= count) {
        return false;
      }
      if(direction === 'right' && sum >= targetKeys?.length) {
        return false;
      }
      if (isFiltered && isEnabled) {
        if (indexOfKey !== -1) {
          data['right'][indexOfKey] = record.key;
          sum += 1;
        } else {
          data['left'].push(record.key);
        }
      }
      return true;
    });
    // 去除empty
    if(direction === 'right') {
      data[direction] = data[direction]?.filter((item: any) => item ?? !item)
    }
    return data;
  }

  // 全选所有
  const getSelectAll = (direction: string, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const data: any = {
        "left": sourceEnableKeys,
        "right": targetEnabledKeys
      }
      // 如果已经勾选了全部数据，那么取消全部选中
      if (data[direction]?.length === selectedKeys.length) {
        setSelectedKeys([]);
      } else {
        setSelectedKeys(data[direction]);
      }
    }
  }

  // 全选当页
  const getSelectCurrent = (direction: string, page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const data: any = {
        "left": sourceEnableKeys,
        "right": targetEnabledKeys
      }
      console.log(data, '======')
      const currentPageKeys = getCurrentPageData(data[direction], page);
      // 获取其他页的被选中的数据
      const otherPageKeys = selectedKeys?.filter((item: any) => !currentPageKeys?.includes(item));
      setSelectedKeys([...otherPageKeys, ...currentPageKeys]);
    }
  }

  // 反选当页
  const getInvertCurrent = (direction: string, page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const data: any = {
        "left": sourceEnableKeys,
        "right": targetEnabledKeys
      }
      const currentPageKeys = getCurrentPageData(data[direction], page);

      const invertKeys = currentPageKeys?.filter((item: any) => !selectedKeys?.includes(item));
      const otherPageKeys = selectedKeys?.filter((item: any) => !currentPageKeys?.includes(item));
      setSelectedKeys([...otherPageKeys, ...invertKeys]);
    }
  }

  // 选中指定条数
  const getSelectCount = (direction: string, count: number, setSelectedKeys: any) => {
    return () => {
      const data: any = getFilterDataKeys(direction, count);
      setSelectedKeys(data[direction].slice(0, count));
    }
  }

  // 下拉菜单配置
  const handleDropdownConfig = (direction: string, className: string) => {
    let menuItems: any = [];
    const attrs: any = {
      'left': {
        page: sourcePage,
        keys: sourceSelectedKeys,
        setKeys: setSourceSelectedKeys
      },
      'right': {
        page: targetPage,
        keys: targetSelectedKeys,
        setKeys: setTargetSelectedKeys
      }
    }
    const defaultConfig: any = [
      { title: '全选所有', onClick: getSelectAll(direction, attrs[direction].keys, attrs[direction].setKeys) },
      { title: '全选当页', onClick: getSelectCurrent(direction, attrs[direction].page, attrs[direction].keys, attrs[direction].setKeys) },
      { title: '反选当页', onClick: getInvertCurrent(direction, attrs[direction].page, attrs[direction].keys, attrs[direction].setKeys) },
    ];
    menuItems.push(...defaultConfig);

    const customConfig = dropdownSelectCount?.map((count: number) => {
      const sum = typeof count === 'number' ? count : 0;
      return {
        title: `选择${sum}项`,
        onClick: getSelectCount(direction, sum, attrs[direction].setKeys)
      }
    });
    menuItems = menuItems.concat(customConfig)

    return {
      menuItems,
      className
    }
  }

  const { DropdownView: LeftDropdown } = useDropdownView(
    handleDropdownConfig('left', `leftDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`)
  );
  const { DropdownView: RightDropdown } = useDropdownView(
    handleDropdownConfig('right', `rightDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`)
  );

  // 数据转移回调
  const onChange = (nextTargetKeys: any, direction: string, moveKeys: string[]) => {
    // 当且仅当数据向右穿梭，且设定了预定上限值
    if (direction === 'right' && typeof maxTargetKeys === 'number' && maxTargetKeys >= 0) {
      // 右侧穿梭框数据数量已经达到预定上限时
      if (targetKeys.length >= maxTargetKeys) {
        setSourceSelectedKeys(moveKeys);
        setShowMaxError(true);
        return;
      }
      // 当移动后的数据数量达到预定上限时
      if (nextTargetKeys?.length > maxTargetKeys) {
        // 计算当前仍可以移动到右侧穿梭框的数据长度
        const len = maxTargetKeys - targetKeys.length;
        setSourceSelectedKeys(moveKeys.slice(len, moveKeys.length));
        const newTargetKeys = [...targetKeys, ...moveKeys.slice(0, len)];
        setTargetKeys(newTargetKeys);
        setShowMaxError(true);
        
        props.onChange?.(newTargetKeys, direction, moveKeys);
        return;
      }
    }
    setTargetKeys(nextTargetKeys);
    setShowMaxError(false);

    // 移动数据时产生的分页变化，需要做额外处理
    if (nextTargetKeys.length > 0 && Math.ceil(nextTargetKeys.length / itemSize) < targetPage) {
      setTargetPage(targetPage - 1);
    }
    if (sourceKeys.length > 0 && Math.ceil(sourceKeys.length / itemSize) < sourcePage) {
      setSourcePage(sourcePage - 1);
    }
    if (props.onChange) {
      props.onChange(nextTargetKeys, direction, moveKeys);
    }
  };

  // 选中回调
  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSourceSelectedKeys(sourceSelectedKeys);
    setTargetSelectedKeys(targetSelectedKeys);

    props.onSelectChange?.(sourceSelectedKeys, targetSelectedKeys);
  }

  // 搜索回调
  const onSearch = (direction: 'left' | 'right', value: string) => {
    setFilterValue(Object.assign({}, filterValue, { [direction]: value }));
    props.onSearch?.(direction, value);
  }

  /** 设置勾选项 */
  // const handleSelectedKeys = () => {
  //   const sourceKeys = sourceEnableKeys.slice((sourcePage - 1) * itemSize, sourcePage * itemSize);
  //   const targetKeys = targetEnabledKeys.slice((targetPage - 1) * itemSize, targetPage * itemSize);
  //   const _sourceSelectedKeys = sourceKeys.filter((key: any) => sourceSelectedKeys.includes(key));
  //   const _targetSelectedKeys = targetKeys.filter((key: any) => targetSelectedKeys.includes(key));

  //   return [..._sourceSelectedKeys, ..._targetSelectedKeys];
  // }
  return (
    <div className={`TableTransfer ${className}`}>
      {<LeftDropdown />}
      {<RightDropdown />}
      <Transfer
        dataSource={dataSource}
        targetKeys={targetKeys}
        // 默认用title处理，可传入自定义方法做覆盖
        filterOption={(inputValue: string, item: any) =>
          item?.title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
        }
        {...restProps}
        titles={titles as any}
        selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
        // selectedKeys={handleSelectedKeys()}
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
      <div className={`helpText ${showMaxError ? "helpTextIn" : "helpTextOut"}`}>
        { maxErrorMsg ?? `最多${maxTargetKeys}项`}
      </div>
    </div>
  )
}

export default TableTransfer;
