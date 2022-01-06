import React from 'react';
import { Table } from 'antd';

export default class TableView extends React.Component {
  render(): React.ReactNode {
    const dataSource = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
      },
      {
        key: '2',
        name: '胡彦祖111',
        age: 42,
        address: '西湖区湖底公园1号',
      },
    ];
    
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        // title: ({ sortOrder, sortColumn, filters }: any) => {
        //   console.log({ sortOrder, sortColumn, filters });
        //   return "aaaa";
        // },
        width: 400,
        sorter: (a: any, b: any) => a.name.length - b.name.length,
        className: 'aaa',
        onHeaderCell: (column: any) => {
          return {
            onClick: (event: any) => {
              console.log("鼠标点击", column, event)
            }, // 点击行
            onDoubleClick: (event: any) => {},
            onContextMenu: (event: any) => {},
            onMouseEnter: (event: any) => {
              console.log("鼠标移入", column, event)
            }, // 鼠标移入行
            onMouseLeave: (event: any) => {
              console.log("鼠标移出", column, event)
            },
          };
        }
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
    ];
    
    return (
      <Table dataSource={dataSource} columns={columns} />
    )
  }
}