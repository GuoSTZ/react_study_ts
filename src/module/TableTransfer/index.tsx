import React, { useState, useEffect } from 'react';
import { Transfer, Table } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import './index.less';

export interface TableTransferProps extends TransferProps {
  leftColumns: ColumnProps<any>[];
  rightColumns: ColumnProps<any>[];
  itemSize?: number;
  dropdownConfig?: DropdownConfigProps;
}

interface DropdownConfigProps {
  selectAll?: boolean;
  selectCurrent?: boolean;
  InvertCurrent?: boolean;
  selectCount?: number;
}

type DropdownConfigTypes = 'selectAll' | 'selectCurrent' | 'InvertCurrent' | 'selectCount';

const TableTransfer = (props: TableTransferProps) => {
  const [dataSource, setDataSource] = useState([] as any);                      // 全部数据 - dataSource
  const [targetKeys, setTargetKeys] = useState([] as any);                      // 右侧穿梭框内的数据
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([] as any);      // 左侧穿梭框被勾选的数据
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([] as any);      // 右侧穿梭框被勾选的数据
  const [sourcePage, setSourcePage] = useState(1);                              // 左侧穿梭框当前页码
  const [targetPage, setTargetPage] = useState(1);                              // 右侧穿梭框当前页面
  const [filterValue, setFilterValue] = useState({ 'left': '', 'right': '' });  // 搜索框输入内容

  const {
    leftColumns,
    rightColumns,
    dataSource: _dataSource = [],
    targetKeys: _targetKeys = [],
    itemSize = 10,
    selectedKeys: _selectedKeys = [],
    showSelectAll = true,
    dropdownConfig = {},
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
  const getEnabledItemKeys = (keys: any) => {
    const enabledKeys = getKeys(dataSource?.filter((item: any) => !item.disabled));
    return keys?.filter((item: any) => enabledKeys?.includes(item));
  }

  const getContraryKeys = (data: any, keys: any) => {
    return data.filter((item: any) => !keys?.includes(item));
  }

  // 获取当前页的数据key值数组
  const getCurrentKeys = (data: any, page: number) => {
    return data?.slice((page - 1) * itemSize, page * itemSize);
  }

  const filterFunc = (data: any) => {
    return (item: any) => item?.title?.toUpperCase()?.includes(data?.toUpperCase());
  }

  // 获取筛选后穿梭框内显示的数据key值数组
  const getFilterData: any = (direction: 'left' | 'right') => {
    const data: any = {
      'left': [],
      'right': new Array(targetKeys.length)
    }
    dataSource?.forEach((record: any) => {
      const indexOfKey = targetKeys.indexOf(record.key);
      if (indexOfKey !== -1) {
        data['right'][indexOfKey] = record;
      } else {
        data['left'].push(record);
      }
    });
    const filterItems = data[direction]?.filter((filterFunc(filterValue[direction])));
    return getKeys(filterItems);
  }

  // 全选所有
  const getSelectAll = (direction: string, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getEnabledItemKeys(getFilterData(direction));
      if (keys?.length === selectedKeys.length) {
        setSelectedKeys([]);
      } else {
        setSelectedKeys(keys);
      }
    }
  }

  // 全选当页
  const getSelectCurrent = (direction: string, page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getFilterData(direction);
      const currentKeys = getCurrentKeys(keys, page);
      const notCurrentSelectedKeys = getContraryKeys(selectedKeys, currentKeys);
      setSelectedKeys(getEnabledItemKeys([...notCurrentSelectedKeys, ...currentKeys]));
    }
  }

  // 反选当页
  const getInvertCurrent = (direction: string, page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getFilterData(direction);
      const currentKeys = getCurrentKeys(keys, page);
      const notCurrentSelectedKeys = getContraryKeys(selectedKeys, currentKeys);
      const invertKeys = getContraryKeys(currentKeys, selectedKeys);
      setSelectedKeys(getEnabledItemKeys([...notCurrentSelectedKeys, ...invertKeys]));
    }
  }

  // 选中指定条数
  const getSelectCount = (direction: string, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getEnabledItemKeys(getFilterData(direction));
      const count = typeof dropdownConfig.selectCount === 'number' ? dropdownConfig.selectCount : 1000;
      setSelectedKeys(keys.slice(0, count));
    }
  }

  const handleDropdownConfig = (direction: string, className: string) => {
    // dropdownConfig
    let menuItems: any = [];
    const codes = Object.keys(dropdownConfig);
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
    const count = typeof dropdownConfig.selectCount === 'number' ? dropdownConfig.selectCount : 1000;
    const config: any = {
      'selectAll': { title: '全选所有', onClick: getSelectAll(direction, attrs[direction].keys, attrs[direction].setKeys) },
      'selectCurrent': { title: '全选当页', onClick: getSelectCurrent(direction, attrs[direction].page, attrs[direction].keys, attrs[direction].setKeys) },
      'invertCurrent': { title: '反选当页', onClick: getInvertCurrent(direction, attrs[direction].page, attrs[direction].keys, attrs[direction].setKeys) },
      'selectCount': { title: `选择${count}项`, onClick: getSelectCount(direction, attrs[direction].keys, attrs[direction].setKeys) },
    }
    codes?.forEach((item: string) => {
      if (!!dropdownConfig[item as DropdownConfigTypes]) {
        menuItems.push(config[item]);
      }
    });

    return {
      menuItems,
      className
    }
  }

  const { DropdownView: LeftDropdown } = useDropdownView(handleDropdownConfig('left', 'leftDropdown'));

  const { DropdownView: RightDropdown } = useDropdownView(handleDropdownConfig('right', 'rightDropdown'));

  // 数据转移回调
  const onChange = (nextTargetKeys: any, direction: string, moveKeys: string[]) => {
    setTargetKeys(nextTargetKeys);

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

  // 是否显示下拉菜单
  const isShowDropdownFunc = () => {
    const codes = Object.keys(dropdownConfig);
    let flag = false;
    codes?.forEach((item: string) => {
      if (!!dropdownConfig[item as DropdownConfigTypes]) {
        flag = true;
      }
    });
    return flag;
  }

  return (
    <div className='TableTransfer'>
      {isShowDropdownFunc() && <LeftDropdown />}
      {isShowDropdownFunc() && <RightDropdown />}
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
        showSelectAll={!isShowDropdownFunc() && showSelectAll}
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
}

export default TableTransfer;