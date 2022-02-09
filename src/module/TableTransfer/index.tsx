import React, { useState, useEffect } from 'react';
import { Transfer, Table } from 'antd';
import difference from 'lodash/difference';
import useDropdownView from './useDropdownVIew';
import './index.less';

const TableTransferView = (props: any) => {
  const [targetKeys, setTargetKeys] = useState([] as any);
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([]);
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([]);
  const [sourcePage, setSourcePage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);

  const { leftColumns, rightColumns, dataSource, itemSize = 10, ...restProps } = props;


  // 筛选非禁用的数据key
  const getEnabledItemKeys = (items: any) => {
    return items.filter((data: any) => !data.disabled).map((data: any) => data.key);
  }

  const allKeys = getEnabledItemKeys(dataSource);

  const { DropdownView: LeftDropdown } = useDropdownView({
    selectAll: () => {
      const sourceKeys = allKeys.filter((item: any) => !targetKeys?.includes(item));
      if (sourceKeys?.length === sourceSelectedKeys.length) {
        setSourceSelectedKeys([]);
      } else {
        setSourceSelectedKeys(sourceKeys);
      }
    },
    selectAllCurrent: () => { 
      console.log(sourcePage, targetPage, '===')
    },
    invertCurrent: () => { console.log("反选当页") },
    className: 'leftDropdown'
  });

  const { DropdownView: RightDropdown } = useDropdownView({
    selectAll: () => { 
      if(targetKeys?.length === targetSelectedKeys?.length) {
        setTargetSelectedKeys([]);
      } else {
        setTargetSelectedKeys(targetKeys);
      }
    },
    selectAllCurrent: () => { },
    invertCurrent: () => { },
    className: 'rightDropdown'
  });

  const onChange = (nextTargetKeys: any) => {
    setTargetKeys(nextTargetKeys);
    // 处理分页
    const sourceKeys = allKeys.filter((item: any) => !nextTargetKeys.includes(item));
    if(Math.ceil(nextTargetKeys.length / itemSize) < targetPage) {
      setTargetPage(targetPage - 1);
    }
    if(Math.ceil(sourceKeys.length / itemSize) < sourcePage) {
      setSourcePage(sourcePage - 1);
    }
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSourceSelectedKeys(sourceSelectedKeys);
    setTargetSelectedKeys(targetSelectedKeys)
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
          item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
        }
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
            onSelectAll(selected: any, selectedRows: any) {
              const treeSelectedKeys = selectedRows
                .filter((item: any) => !item.disabled)
                .map(({ key }: any) => key);
              const diffKeys = selected
                ? difference(treeSelectedKeys, listSelectedKeys)
                : difference(listSelectedKeys, treeSelectedKeys);
              onItemSelectAll(diffKeys, selected);
            },
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