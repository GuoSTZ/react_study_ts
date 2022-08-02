import React, { useState, useEffect, useMemo } from 'react';
import { Transfer, Table, Button } from 'antd';
import { TransferProps, ListStyle, TransferDirection } from 'antd/lib/transfer';
import { ColumnProps } from 'antd/lib/table';
import useDropdownView from './useDropdownVIew';
import './index.less';

type DirectionType = 'left' | 'right'

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

  const PAGE_SIZE = 10;

  const [page, setPage] = useState({
    'left': 1,
    'right': 1
  })
  const [tableData, setTableData] = useState({
    'left': [],
    'right': []
  })
  const [tableKeys, setTableKeys] = useState({
    'left': [],
    'right': [] as any[]
  })
  const [filterValue, setFilterValue] = useState({
    'left': '' as any,
    'right': '' as any,
  })
  const [selectedKeysLen, setSelectedKeysLen] = useState({
    'left': 0,
    'right': 0,
  })

  const nodes = document.querySelectorAll(
    '.TableTransfer .ant-transfer-list-header-selected > span:first-child'
  );
  const leftNode = nodes[0];
  const rightNode = nodes[1];

  const getTitle = (record: any) => typeof render === 'function' ? render(record) : record.title;
  const getRecordKey = (record: any, index: number) => {
    const { rowKey } = props;
    const recordKey =
      typeof rowKey === 'function' ? rowKey(record) : record.key;
    return recordKey === undefined ? index : recordKey;
  }

  /** 默认筛选函数 */
  const defaultFilterOption = (inputValue: string, record: any) => {
    const title = getTitle(record);
    return title?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
  }

  /** 筛选函数合并 */
  const mergedFilterOption = typeof filterOption === 'function'
    ? filterOption
    : defaultFilterOption

  const filterData = (direction: DirectionType) => {
    const inputValue = filterValue[direction];
    if (inputValue === '' && inputValue.trim() === '') {
      return tableData[direction];
    }
    return tableData[direction].filter((record: any) => mergedFilterOption(inputValue, record));
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
    setTableKeys(origin => Object.assign({}, origin, { 'right': targetKeys }))
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
      if (idx > -1) {
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
    setTableKeys(origin => Object.assign({}, origin, { 'left': lDataKey }))
  }, [tableKeys['right']])

  useEffect(() => {
    if(leftNode) {
      const leftLen = filterData('left').length.toString();
      leftNode.childNodes[0].nodeValue = leftLen
    }
  }, [filterData('left').length])

  useEffect(() => {
    if(rightNode) {
      const rightLen = filterData('right').length.toString();
      rightNode!.childNodes[0].nodeValue = rightLen;
    }
  }, [filterData('right').length])

  useEffect(() => {
    if(leftNode) {
      if(leftNode.childNodes[0].nodeValue?.includes("/")) {
        const leftLen = filterData('left').length.toString();
        const values = leftNode.childNodes[0].nodeValue.split("/");
        leftNode.childNodes[0].nodeValue = `${values[0]}/${leftLen}`;
      }
    }
  }, [selectedKeysLen['left']])

  useEffect(() => {
    if(rightNode) {
      if(rightNode.childNodes[0].nodeValue?.includes("/")) {
        const rightLen = filterData('right').length.toString();
        const values = rightNode.childNodes[0].nodeValue.split("/");
        rightNode.childNodes[0].nodeValue = `${values[0]}/${rightLen}`;
      }
    }
  }, [selectedKeysLen['right']])

  useEffect(() => {
    //重写穿梭框的 moveTo 方法
    const $ = ref.current;
    $.moveTo = (direction: TransferDirection) => {
      const { targetKeys = [], dataSource = [], onChange } = $.props;
      const { sourceSelectedKeys, targetSelectedKeys } = $.state;
      const newMoveKeysMap = new Map(); // 用 map 记录将被移动的数据的key值，替代下述的 indexOf 查询
      const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;
      // filter the disabled options
      const newMoveKeys = moveKeys.filter(
        (key: string) => {
          const status = dataSourceMap.get(key).disabled;
          if (!status) {
            newMoveKeysMap.set(key, true);
          }
          return !status;
        }
      );
      // move items to target box
      const newTargetKeys =
        direction === 'right'
          ? newMoveKeys.concat(targetKeys)
          : targetKeys.filter((targetKey: any[]) => !newMoveKeysMap.has(targetKey));

      // empty checked keys
      const oppositeDirection = direction === 'right' ? 'left' : 'right';
      $.setState({
        [$.getSelectedKeysName(oppositeDirection)]: [],
      });
      $.handleSelectChange(oppositeDirection, []);

      if (onChange) {
        onChange(newTargetKeys, direction, newMoveKeys);
      }
    };
  }, [])

  const onChange = (targetKeys: string[], direction: string, moveKeys: string[]) => {
    setTableKeys(origin => Object.assign({}, origin, {
      'right': targetKeys
    }))
    moveKeys.forEach((item: any) => dataSourceSelectedMap.set(item, false));
  }

  const onSearch = (direction: DirectionType, value: string) => {
    setFilterValue(origin => Object.assign({}, origin, {
      [direction]: value
    }));
  }

  const currentData = (direction: DirectionType) =>
    filterData(direction).slice((page[direction] - 1) * PAGE_SIZE, page[direction] * PAGE_SIZE)
  const currentSelectedKeys = (direction: DirectionType) => {
    const keys: any[] = [];
    currentData(direction).map((item: any) => {
      if (dataSourceSelectedMap.get(item.key)) {
        keys.push(item.key);
      }
    })
    return keys;
  }

  const getMenuItems = (direction: DirectionType) => {
    return [
      {
        title: '全选所有', onClick: () => {
          const keys: any[] = [];
          const data: any[] = filterData(direction);
          const len = data.length;
          for (let i = 0; i < len; i++) {
            const isDisabled = dataSourceMap.get(data[i].key).disabled;
            !isDisabled && keys.push(data[i].key);
            !isDisabled && dataSourceSelectedMap.set(data[i].key, true);
          }
          ref?.current?.onItemSelectAll(direction, keys, keys.length > 0)
        }
      },
      {
        title: '全选当页', onClick: () => {
          const keys: any[] = [];
          currentData(direction)?.forEach((item: any) => {
            const status = dataSourceSelectedMap.get(item.key);
            !item.disabled && dataSourceSelectedMap.set(item.key, true);
            !item.disabled && !status && keys.push(item.key);
          })
          ref?.current?.onItemSelectAll(direction, keys, true)
        }
      },
      {
        title: '反选当页', onClick: async () => {
          const keys: any[] = []; // 存储当前已经被勾选的数据
          currentData(direction)?.forEach((item: any) => {
            const status = dataSourceSelectedMap.get(item.key);
            !item.disabled && dataSourceSelectedMap.set(item.key, !status);
          })
          tableKeys[direction]?.forEach((item: any) => {
            if(dataSourceSelectedMap.get(item)) {
              keys.push(item);
            }
          })

          let selectedKeys = direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys'
          ref?.current?.setState?.({
            [selectedKeys]: keys
          }, () => {
            setSelectedKeysLen(origin => Object.assign({}, origin, {
              [direction]: keys.length
            }))
          })
        }
      }
    ]
  }

  const { DropdownView: LeftDropdown } = useDropdownView({ menuItems: getMenuItems('left'), className: `leftDropdown` });

  const { DropdownView: RightDropdown } = useDropdownView({ menuItems: getMenuItems('right'), className: `rightDropdown` });

  return (
    <div className={`TableTransfer ${className ?? ""}`}>
      <LeftDropdown />
      <RightDropdown />
      <Transfer
        showSearch
        {...restProps}
        ref={ref}
        targetKeys={tableKeys['right']}
        filterOption={mergedFilterOption}
        onChange={onChange}
        onSearch={onSearch}
        showSelectAll={false}
        onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
          setSelectedKeysLen({
            'left': sourceSelectedKeys.length,
            'right': targetSelectedKeys.length
          })
        }}
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
              if (selected) {
                dataSourceSelectedMap.set(record.key, true)
              } else {
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
                dataSource={filterData(direction)}
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
                  onChange: (page: number) => {
                    setPage(origin => Object.assign({}, origin, { [direction]: page }))
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