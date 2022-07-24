import React, { useState, useRef, useEffect } from 'react';
import {
  AutoSizer,
  Table,
  TableProps,
  Column,
  ColumnProps,
  defaultTableRowRenderer
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import classnames from 'classnames';
import './index.less';

export interface VirtualTableProps extends TableProps {
  columns: ColumnProps[]
  expandable?: any;
  dataSource: any[];
}

const VirtualTable: React.FC<VirtualTableProps> = props => {

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [expandedData, setExpandedData] = useState([] as any);
  const tableRef: any = useRef();
  const { columns, dataSource, ...otherProps } = props;
  const keys = dataSource?.map((item: any) => item.key);

  useEffect(
    () => {
      tableRef.current.recomputeRowHeights();
    },
    [expandedIndex]
  );

  useEffect(() => {
    setExpandedData(dataSource);
  }, [dataSource])

  // 动态调整行高（涵盖展开项高度）
  const _getRowHeight = ({ index }: any) => 48;

  const onExpandCell = (index: number) => {
    setExpandedIndex(index);

    let idx = keys.indexOf(index);
    if(idx === -1) {
      setExpandedData(dataSource)
    } else {
      const data: any = [].concat(dataSource as any);
      // const data: any = JSON.parse(JSON.stringify(dataSource));
      const list = [
        {name: "aa", description: "eee", key: "1-1"},
        {name: "bb", description: "eee", key: "1-2"},
      ]
      data?.splice(index + 1, 0, ...list)
      setExpandedData(data)
    }
  }

  // 展开图标
  const cellRenderer = ({ rowIndex }: any) => {
    const baseName = 'row-expand-icon';
    const status = rowIndex !== expandedIndex ? `${baseName}-collapsed` : `${baseName}-expanded`
    const index = rowIndex !== expandedIndex ? rowIndex : -1;
    return (
      <div className={classnames(baseName, status)} onClick={() => onExpandCell(index)} />
    )
  };
  
  return (
    <AutoSizer className='VirtualTable-AutoSizer' onResize={(props: any) => console.log(props, '===')}>
      {
        ({ width, height }) => (
          <Table
            rowGetter={({ index }: any) => expandedData[index]}
            {...otherProps}
            className={classnames('VirtualTable', props.className)}
            width={width}
            height={height}
            ref={tableRef}
            rowHeight={_getRowHeight}
          >
            <Column
              // label="Index"
              cellDataGetter={({ rowData }) => rowData.length}
              cellRenderer={cellRenderer}
              dataKey="index"
              disableSort
              width={60}
            />
            {columns?.map((item: any) => (
              <Column {...item} />
            ))}
          </Table>
        )
      }
    </AutoSizer>
  )
}

export default VirtualTable;