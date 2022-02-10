import React, { useState, useEffect, useCallback } from 'react';
import { Transfer, Table } from 'antd';
import difference from 'lodash/difference';
import useDropdownView from './useDropdownVIew';
import './index.less';

const TableTransferView = (props: any) => {
  const [dataSource, setDataSource] = useState([] as any);                    // 全部数据 - dataSource
  const [targetKeys, setTargetKeys] = useState([] as any);                    // 右侧穿梭框内的数据
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([] as any);    // 左侧穿梭框被勾选的数据
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([] as any);    // 右侧穿梭框被勾选的数据
  const [sourcePage, setSourcePage] = useState(1);                            // 左侧穿梭框当前页码
  const [targetPage, setTargetPage] = useState(1);                            // 右侧穿梭框当前页面
  const [filterValue, setFilterValue] = useState({'left': '', 'right': ''});  // 搜索框输入内容

  const { 
    leftColumns, 
    rightColumns, 
    dataSource: _dataSource, 
    targetKeys: _targetKeys, 
    itemSize = 10, 
    ...restProps 
  } = props;

  useEffect(() => {
    setDataSource(_dataSource);
    setTargetKeys(_targetKeys);
  }, [_dataSource, _targetKeys]);

  const getKeys = (data: any) => data?.map((item: any) => item.key);

  const allKeys = getKeys(dataSource);
  const enabledKeys = getKeys(dataSource?.filter((item: any) => !item.disabled));

  // 筛选非禁用的数据key
  const getEnabledItemKeys = (keys: any) => {
    return keys?.filter((item: any) => enabledKeys?.includes(item));
  }

  const getContraryKeys = (data: any, keys: any) => {
    return data.filter((item: any) => !keys?.includes(item));
  }

  // 获取当前页的数据key值数组
  const getCurrentKeys = (data: any, page: number) => {
    return data?.slice((page - 1) * itemSize, page * itemSize);
  }

  // 获取筛选后穿梭框内显示的数据key值数组
  const getFilterData: any = (direction: 'left'|'right') => {
    const data: any = {
      'left': [],
      'right': []
    }
    dataSource?.map((item: any) => {
      if(targetKeys?.includes(item.key))
        data['right'].push(item);
      else
        data['left'].push(item);
    });
    return getKeys(data[direction]?.filter((item: any) => item.title?.toUpperCase()?.includes(filterValue[direction]?.toUpperCase())));
  }

  const getSelectAll = (direction: 'left'|'right', selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getFilterData(direction);
      if (keys?.length === selectedKeys.length) {
        setSelectedKeys([]);
      } else {
        setSelectedKeys(getEnabledItemKeys(keys));
      }
    }
  }

  const getSelectAllCurrent = (direction: 'left'|'right', page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getFilterData(direction);
      const currentKeys = getCurrentKeys(keys, page);
      const notCurrentSelectedKeys = getContraryKeys(selectedKeys, currentKeys);
      setSelectedKeys(getEnabledItemKeys([...notCurrentSelectedKeys, ...currentKeys]));
    }
  }

  const getInvertCurrent = (direction: 'left'|'right', page: number, selectedKeys: any, setSelectedKeys: any) => {
    return () => {
      const keys = getFilterData(direction);
      const currentKeys = getCurrentKeys(keys, page);
      const notCurrentSelectedKeys = getContraryKeys(selectedKeys, currentKeys);
      const invertKeys = getContraryKeys(currentKeys, selectedKeys);
      setSelectedKeys(getEnabledItemKeys([...notCurrentSelectedKeys, ...invertKeys]));
    }
  }

  const { DropdownView: LeftDropdown } = useDropdownView({
    menuItems: [
      {title: '全选所有', onClick: getSelectAll('left', sourceSelectedKeys, setSourceSelectedKeys)},
      {title: '全选当页', onClick: getSelectAllCurrent('left', sourcePage, sourceSelectedKeys, setSourceSelectedKeys)},
      {title: '反选当页', onClick: getInvertCurrent('left', sourcePage, sourceSelectedKeys, setSourceSelectedKeys)},
    ],
    className: 'leftDropdown'
  });

  const { DropdownView: RightDropdown } = useDropdownView({
    menuItems: [
      {title: '全选所有', onClick: getSelectAll('right', targetSelectedKeys, setTargetSelectedKeys)},
      {title: '全选当页', onClick: getSelectAllCurrent('right', targetPage, targetSelectedKeys, setTargetSelectedKeys)},
      {title: '反选当页', onClick: getInvertCurrent('right', targetPage, targetSelectedKeys, setTargetSelectedKeys)},
    ],
    className: 'rightDropdown'
  });

  // 数据转移回调
  const onChange = (nextTargetKeys: any) => {
    setTargetKeys(nextTargetKeys);

    // 移动数据时产生的分页变化，需要做额外处理
    const sourceKeys = getContraryKeys(allKeys, nextTargetKeys)
    if(Math.ceil(nextTargetKeys.length / itemSize) < targetPage) {
      setTargetPage(targetPage - 1);
    }
    if(Math.ceil(sourceKeys.length / itemSize) < sourcePage) {
      setSourcePage(sourcePage - 1);
    }
  };

  // 选中回调
  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSourceSelectedKeys(sourceSelectedKeys);
    setTargetSelectedKeys(targetSelectedKeys)
  }

  // 搜索回调
  const onSearch = (direction: 'left'|'right', value: string) => {
    setFilterValue(Object.assign({}, filterValue, {[direction]: value}));
  }

  return (
    <div className='TableTransfer'>
      <LeftDropdown />
      <RightDropdown />

      <Transfer
        dataSource={dataSource}
        targetKeys={targetKeys}
        selectedKeys={[...sourceSelectedKeys, ...targetSelectedKeys]}
        onChange={onChange}
        onSelectChange={onSelectChange}
        filterOption={(inputValue: string, item: any) =>
          item?.title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
        }
        onSearch={onSearch}
        {...restProps}
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
                },

              }}
            />
          );
        }}
      </Transfer>
    </div>
  )
}

export default TableTransferView;