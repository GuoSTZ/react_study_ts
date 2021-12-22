import React from 'react';
import { Table } from 'antd';
import BaseTable from './BaseTable';

const RowTable = (props: any) => {
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

  const data = [];
  for (let i = 1000; i < 1003; ++i) {
    data.push({
      key: i,
      name: `测试${i}`,
      age: Math.floor(Math.random()*200),
      address: `地址${i}`
    });
  }

  const onClick = (source: any[], selectRowKeys: any[], selectRows: any[]) => {

  }



  return (
    <BaseTable 
      columns={columns} 
      dataSource={data} 
      pagination={false}
      rowSelection={{}}
      showHeader={false}
      showButton={false}
      btnOnClick={props.btnOnClick}
    />
  );
}

export default RowTable;