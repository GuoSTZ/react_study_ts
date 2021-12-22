import React from 'react';
import TableMenu from '.';

export default class TableMenuView extends React.Component {
  render() {
    let dataSource: any = [];
    for(let i=0; i< 22; i++) {
      dataSource.push({
        key: i,
        name: `测试${i}`,
        age: Math.floor(Math.random()*20),
        address: `地址${i}`
      })
    }
    
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
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

    const sourceTableConfig = {
      dataSource,
      columns,
      btnText: "添加",
      scroll: { y: 540 },
    };
    const targetTableConfig = {
      dataSource: [],
      columns,
      btnText: "删除",
      scroll: { y: 540 },
    };
    return (
      <TableMenu 
        sourceTableConfig={sourceTableConfig}
        targetTableConfig={targetTableConfig}
      />
    )
  }
}