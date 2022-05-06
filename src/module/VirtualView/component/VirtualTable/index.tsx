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
  const [expandedData, setExpandedData] = useState({} as any);
  const tableRef: any = useRef();
  const { columns, dataSource, ...otherProps } = props;


  useEffect(
    () => {
      tableRef.current.recomputeRowHeights();
    },
    [expandedIndex]
  );

  // 动态调整行高（涵盖展开项高度）
  const _getRowHeight = ({ index }: any) => (index === expandedIndex ? expandedData[index].length * 48 + 48 : 48);

  const onExpandCell = (index: number) => {
    console.time()
    const arr = Array.from(Array(200), (v,k) =>k);
    const list = arr.map((item: number) => ({
      name: `子项${item}`,
      description: `子项地址${item}`,
      details: "这是一段展开后的信息",
      key: item + 1000000
    }))
    console.timeEnd()

    setExpandedIndex(index);
    // 暂无展开和收起的逻辑处理，也没有对多列展开做逻辑处理
    setExpandedData(
      Object.assign({}, expandedData, {
        [index]: list
      })
    )
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

  // 展开内容渲染
  const expandedRow = (rowProps: any) => {
    const { dataSource: _dataSource, index: _index, ...otherRowProps } = rowProps;
    const len = _dataSource.length;
    return (
      <Table
        rowGetter={({ index }: any) => _dataSource[index]}
        {...otherRowProps}
        className="row-expanded-table"
        // 60 - 展开图标所占宽度
        // 20 - 展开图标的marginLeft和marginRight值
        // 10 - 每一列的marginRight值
        width={props.width + 60 + 20 + 10 + 10}
        height={len * 48}
        // ref={tableRef}
        rowHeight={48}
        rowCount={len}
      // rowRenderer={rowRenderer}
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

  const rowRenderer = (rowProps: any) => {
    const { index, style, className, key, rowData } = rowProps;
    const data = expandedData[index] || [];

    if (index === expandedIndex) {
      return (
        <div
          style={{ ...style, display: "flex", flexDirection: "column", paddingRight: 0 }}
          className={className}
          key={key}
        >
          {defaultTableRowRenderer({
            ...rowProps,
            style: { width: style.width, height: 48 }
          })}
          <div
            style={{
              marginRight: "auto",
              // marginLeft: 80,
              height: 48 * data.length,
              display: "flex",
              alignItems: "center"
            }}
          >
            {expandedRow({ dataSource: data, index })}
          </div>
        </div>
      );
    }
    return defaultTableRowRenderer(rowProps);
  };

  return (
    <AutoSizer className='VirtualTable-AutoSizer'>
      {
        ({ width, height }) => (
          <Table
            rowGetter={({ index }: any) => dataSource[index]}
            {...otherProps}
            className={classnames('VirtualTable', props.className)}
            width={width}
            height={height}
            ref={tableRef}
            rowHeight={_getRowHeight}
            rowRenderer={rowRenderer}
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