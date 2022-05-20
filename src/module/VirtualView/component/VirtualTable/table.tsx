import React, { useState } from 'react';
import { VariableSizeGrid as Grid } from "react-window";
import ResizeObserver from "rc-resize-observer";
import { Table } from 'antd';

const VirtualTable: React.FC<any> = props => {
  const [width, setWidth] = useState(0);

  const renderVirtualList = (rawData: any) => {
    const { children } = rawData;
    console.log(rawData, props, width, '====')
    return (
      <Grid
        columnCount={1}
        columnWidth={() => {
          return width;
        }}
        rowCount={children.length}
        rowHeight={() => 54}
        width={width}
        height={400}
      >
        {({ rowIndex, style }) => {
          return (
            <div
              style={{
                ...style,
                width,
              }}
            >
              <table>
                {/* <colgroup>
                  <col />
                  <col />
                  <col />
                </colgroup> */}
                <tbody className="ant-table-tbody">{children[rowIndex]}</tbody>
              </table>
            </div>
          );
        }}
      </Grid>
    );
  };

  const onResize = ({ width }: any) => {
    setWidth(width);
  };

  return (
    <ResizeObserver onResize={onResize}>
      <Table
        {...props}
        components={{
          body: {
            wrapper: renderVirtualList
          }
        }}
      />
    </ResizeObserver>
  )
}

export default VirtualTable;