import React, { useState, useEffect, useMemo } from 'react';
import { Transfer, Table, Pagination } from 'antd';
import { TransferProps, ListStyle } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
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
  const [sourcePage, setSourcePage] = useState(1);
  const [targetPage, setTargetPage] = useState(1);
  const [sourceData, setSourceData] = useState([] as any[]);
  const [targetData, setTargetData] = useState([] as any[]);
  const [rightKeys, setRightKeys] = useState([] as string[]);

  /** 获取全部数据的key和map */
  const [dataSourceKey, dataSourceMap] = useMemo(() => {
    const dataKey: any[] = []; // 记录所有数据的key值
    const dataMap = new Map();
    dataSource?.map((record: any) => {
      const key = getRowKey(record);
      dataKey.push(key);
      dataMap.set(key, record);
    })
    return [dataKey, dataMap];
  }, [dataSource])

  useEffect(() => {
    setRightKeys(targetKeys || []);
  }, [targetKeys])

  useEffect(() => {
    const lData: any[] = [];
    const rData: any[] = [];
    dataSource?.map((record: any) => {
      const key = getRowKey(record);
      if(rightKeys.indexOf(key) > -1) {
        rData.push(record);
      } else {
        lData.push(record);
      }
    })
  }, [rightKeys])

  const getRowKey = (record: any) => typeof rowKey === 'function' ? rowKey(record) : record.key;
  const getTitle = (record: any) => typeof render === 'function' ? render(record) : record.title;

  /** 默认筛选函数 */
  const defaultFilterOption = (inputValue: string, record: any) => {
    const title = getTitle(record);
    return title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
  }

  /** 筛选函数合并 */
  const mergedFilterOption = typeof filterOption === 'function'
    ? filterOption
    : defaultFilterOption

  return (
    <div className={`TableTransfer ${className ?? ""}`}>
      <Transfer
        // dataSource={[...currentSourceData, ...currentTargetData]}
        dataSource={dataSource}
        targetKeys={rightKeys}
        // filterOption={mergedFilterOption}
        {...restProps}
      // selectedKeys={[
      //   ...sourceSelectedKeys.slice((sourcePage - 1) * itemSize!, sourcePage * itemSize!), 
      //   ...targetSelectedKeys.slice((targetPage - 1) * itemSize!, targetPage * itemSize!)
      // ]}
      // onChange={onChange}
      // onSelectChange={onSelectChange}
      // onSearch={onSearch}
      // showSelectAll={showSelectAll}
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
            <div>
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
                pagination={false}
              />
              {/* {
                direction === 'left' ? (
                  <Pagination 
                    simple 
                    current={sourcePage}
                    total={sourceData.length}
                    onChange={(page: number) => {
                      setSourcePage(page)
                    }}
                  />
                ) : (
                  <Pagination 
                    simple 
                    current={targetPage}
                    total={targetData.length}
                    onChange={(page: number) => {
                      setTargetPage(page)
                    }}
                  />
                )
              } */}
              <Pagination
                simple
                current={direction === 'left' ? sourcePage : targetPage}
                total={direction === 'left' ? sourceData.length : targetData.length}
                onChange={(page: number) => {
                  direction === 'left' ? setSourcePage(page) : setTargetPage(page)
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