import React, { useState, useEffect } from 'react';
import { Transfer, Table, message } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import './index.less';

export interface TableTransferProps extends TransferProps {
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
   * 隐藏默认的下拉菜单项
   */
  hideDefaultDropdown?: boolean;
  /**
   * 自定义下拉菜单选取条数
   */
  dropdownSelectCount?: number[];
  /**
   * 允许转移的最大数据量
   */
  maxTargetKeys?: number;
}

const TableTransfer = (props: TableTransferProps) => {
  const [dataSource, setDataSource] = useState([] as any);                      // 全部数据 - dataSource
  const [targetKeys, setTargetKeys] = useState([] as any);                      // 右侧穿梭框内的数据
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([] as any);      // 左侧穿梭框被勾选的数据
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([] as any);      // 右侧穿梭框被勾选的数据
  const [sourcePage, setSourcePage] = useState(1);                              // 左侧穿梭框当前页码
  const [targetPage, setTargetPage] = useState(1);                              // 右侧穿梭框当前页面
  const [filterValue, setFilterValue] = useState({ 'left': '', 'right': '' } as any);  // 搜索框输入内容
  const [showMaxError, setShowMaxError] = useState(false);                          // 错误信息显示状态

  const {
    leftColumns,
    rightColumns,
    dataSource: _dataSource = [],
    targetKeys: _targetKeys = [],
    itemSize = 10,
    selectedKeys: _selectedKeys = [],
    showSelectAll = true,
    hideDefaultDropdown = false,
    dropdownSelectCount = [],
    maxTargetKeys,
    ...restProps
  } = props;

  useEffect(() => {
    let _data: any = _dataSource.slice(0, _dataSource.length);
    // 默认为title字段处理，传入自定义render时，转化为title属性
    if (props.render) {
      _data = _data?.map((record: any) => {
        return Object.assign({}, {
          ...record,
          title: props.render && props.render(record),
        });
      })
    }
    setDataSource(_data);
    setTargetKeys(_targetKeys);
    setSourceSelectedKeys(_selectedKeys?.filter((item: any) => !targetKeys.includes(item)));
    setTargetSelectedKeys(_selectedKeys?.filter((item: any) => targetKeys.includes(item)));
  }, [_dataSource]);

  const getKeys = (data: any) => data?.map((item: any) => item.key);

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

  const getContraryKeys = (data: any, keys: any) => {
    return data.filter((item: any) => keys?.indexOf(item) === -1);
  }

  // 获取当页穿梭框显示的数据数组
  const getCurrentPageData = (data: any, page: number) => {
    return data?.slice((page - 1) * itemSize, page * itemSize);
  }

  // 获取筛选后穿梭框内显示的数据数组
  const getFilterData = (direction: string) => {
    const data: any = {
      'left': [],
      'right': new Array(targetKeys.length)
    };
    dataSource?.forEach((record: any) => {
      const indexOfKey = targetKeys.indexOf(record.key);
      const isFiltered = record?.title?.toUpperCase()?.includes(filterValue[direction]);
      if (isFiltered) {
        if (indexOfKey !== -1) {
          data['right'][indexOfKey] = record;
        } else {
          data['left'].push(record);
        }
      }
    });
    return data;
  }

  // 获取筛选后穿梭框内显示的数据key值数组
  const getFilterDataKeys = (direction: string) => {
    const data: any = {
      'left': [],
      'right': new Array(targetKeys.length)
    };
    let sum = 0;
    dataSource?.every((record: any) => {
      const indexOfKey = targetKeys.indexOf(record.key);
      const isFiltered = record?.title?.toUpperCase()?.includes(filterValue[direction]);
      const isEnabled = !record?.disabled;

      if(sum >= targetKeys?.length) {
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
    if(direction === 'right') {
      data[direction] = data[direction]?.filter((item: any) => item ?? !item)
    }
    return data;
  }

  // 全选所有
  const getSelectAll = (direction: string, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const data: any = getFilterDataKeys(direction);
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
      const data = getFilterData(direction);
      const currentPageData = getCurrentPageData(data[direction], page);
      const currentPageKeys: any = getEnabledItemKeys(currentPageData);

      const otherPageKeys = selectedKeys?.filter((item: any) => !currentPageKeys?.includes(item));
      setSelectedKeys([...otherPageKeys, ...currentPageKeys]);
    }
  }

  // 反选当页
  const getInvertCurrent = (direction: string, page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const data = getFilterData(direction);
      const currentPageData = getCurrentPageData(data[direction], page);
      const currentPageKeys: any = getEnabledItemKeys(currentPageData);

      const invertKeys = currentPageKeys?.filter((item: any) => !selectedKeys?.includes(item));
      const otherPageKeys = selectedKeys?.filter((item: any) => !currentPageKeys?.includes(item));
      setSelectedKeys([...otherPageKeys, ...invertKeys]);
    }
  }

  // 选中指定条数
  const getSelectCount = (direction: string, count: number, setSelectedKeys: any) => {
    return () => {
      const data: any = getFilterDataKeys(direction);
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
    ]

    if (!hideDefaultDropdown) {
      menuItems = [].concat(defaultConfig);
    }

    const customConfig = dropdownSelectCount?.map((count: number) => {
      const sum = typeof count === 'number' ? count : 0;
      return {
        title: `选择${count}项`,
        onClick: getSelectCount(direction, count, attrs[direction].setKeys)
      }
    });
    menuItems = menuItems.concat(customConfig)

    return {
      menuItems,
      className
    }
  }

  const { DropdownView: LeftDropdown } = useDropdownView(handleDropdownConfig('left', `leftDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`));
  const { DropdownView: RightDropdown } = useDropdownView(handleDropdownConfig('right', `rightDropdown  ${showSelectAll ? 'TableTransfer-selectAll' : ''}`));

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
        setTargetKeys([...targetKeys, ...moveKeys.slice(0, len)]);
        setShowMaxError(true);
        return;
      }
    }
    setTargetKeys(nextTargetKeys);
    setShowMaxError(false);

    // 移动数据时产生的分页变化，需要做额外处理
    const sourceKeys = getContraryKeys(getKeys(dataSource), nextTargetKeys)
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

    if (props.onSelectChange) {
      props.onSelectChange(sourceSelectedKeys, targetSelectedKeys);
    }
  }

  // 搜索回调
  const onSearch = (direction: 'left' | 'right', value: string) => {
    setFilterValue(Object.assign({}, filterValue, { [direction]: value }));
    if (props.onSearch) {
      props.onSearch(direction, value);
    }
  }

  return (
    <div className={`TableTransfer`}>
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
        selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
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
        资产成员最多{maxTargetKeys}项
      </div>
    </div>
  )
}

export default TableTransfer;