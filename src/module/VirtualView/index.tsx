import React from 'react';
import VirtualTable from './component/VirtualTable/index';
import ListExample from './component/VirtualList/index.class';
import VirtualList from './component/VirtualList';
import VirtualTable1 from './component/VirtualTable/table';
import VirtualTable2 from './component/VirtualTable/index.data';
import TreeToTable from './TreeToTable';
import VirtualSelect from './component/VirtualSelect';
import { Button } from 'antd';

const VirtualView: React.FC<any> = props => {
  const arr = Array.from(Array(10000), (v,k) =>k);
  const list = arr.map((item: number) => ({
    name: `content${item}`,
    description: `地址${item}`,
    details: "这是一段展开后的信息",
    key: item
  }))

  const columns = [
    {
      key: "name",
      label: "name",
      dataKey: "name",
      width: 180
    },
    {
      key: "description",
      label: "description",
      dataKey: "description",
      width: 180
    }
  ]

  const tableConf = {
    width: 360,
    height: 300,
    headerHeight: 20,
    rowHeight: 30,
    rowCount: list.length,
    dataSource: list,
    // rowGetter: ({index}: any) => ({key: index, name: "a", description: "fff"}),
    columns
  }

  const antdColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 350,
      render: () => <Button>测试</Button>
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    // <VirtualTable {...tableConf}/>
    // <ListExample list={list}/>
    // <VirtualList list={list}/>
    // <VirtualTable1 
    //   dataSource={list} 
    //   columns={antdColumns} 
    //   pagination={false} 
    //   rowSelection={rowSelection}
    // />
    // <VirtualTable2 {...tableConf} />
    // <TreeToTable />
    <VirtualSelect style={{width: 200}} placeholder="请选择">
      {
        list.map((item: any) => <VirtualSelect.Option value={item.key} key={item.key}>{item.name}</VirtualSelect.Option>)
      }
    </VirtualSelect>
  )
}

export default VirtualView;