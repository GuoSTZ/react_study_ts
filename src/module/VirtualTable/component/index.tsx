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

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableRef: any = useRef();
  const { columns, dataSource, ...otherProps } = props;


  useEffect(
    () => {
      tableRef.current.recomputeRowHeights();
    },
    [selectedIndex]
  );

  const _getRowHeight = ({ index }: any) => (index === selectedIndex ? 96 : 48);

  const Details = ({ children, index }: any) => (
    <div style={{ cursor: "pointer" }} onClick={() => setSelectedIndex(index)}>
      {children}
    </div>
  );

  const cellRenderer = ({ rowIndex }: any) => {
    // if (rowIndex !== selectedIndex) {
    //   return <Details index={rowIndex}>+</Details>;
    // } else {
    //   return <Details index={-1}>-</Details>;
    // }
    const baseName = 'row-expand-icon';
    const status = rowIndex !== selectedIndex ? `${baseName}-collapsed` : `${baseName}-expanded`
    const index = rowIndex !== selectedIndex ? rowIndex : -1;
    return (
      <div className={classnames(baseName, status)} onClick={() => setSelectedIndex(index)} />
    )
  };

  const expandedRow = (props: any) => {
    const {dataSource} = props;
    return (
      <div>
        {dataSource?.map((item: any) => (
          <div>{item}</div>
        ))}
      </div>
    )
  }

  const rowRenderer = (props: any) => {
    const { index, style, className, key, rowData } = props;
    if (index === selectedIndex) {

      return (
        <div
          style={{ ...style, display: "flex", flexDirection: "column", padding: 0 }}
          className={className}
          key={key}
        >
          {defaultTableRowRenderer({
            ...props,
            style: { width: style.width, height: 48 }
          })}
          <div
            style={{
              marginRight: "auto",
              marginLeft: 80,
              height: 48,
              display: "flex",
              alignItems: "center"
            }}
          >
            {expandedRow({dataSource: ["aa", 'bb', 'cc']})}
          </div>
        </div>
      );
    }
    return defaultTableRowRenderer(props);
  };

  return (
    <AutoSizer>
      {
        ({ width, height }) => (
          <Table
            rowGetter={({ index }: any) => dataSource[index]}
            {...otherProps}
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