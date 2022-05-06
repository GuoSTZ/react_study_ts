import React from 'react';
import VirtualTable from './component/VirtualTable/index';

const VirtualTableView: React.FC<any> = props => {
  const arr = Array.from(Array(1000), (v,k) =>k);
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

  return (
    <VirtualTable {...tableConf}/>
  )
}

export default VirtualTableView;