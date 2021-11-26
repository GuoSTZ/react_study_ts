import React from 'react';
import { Icon, Table, Input, Button, Select } from 'antd';
import SearchTree from './components/searchTree';
import VirtualTree from './components/VirtualTree';

const randomWord = (randomFlag: boolean, min: number, max: number) => {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
      'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      '-','.','~','!','@','#','$','%','^','&','*','(',')','_',':','<','>','?'];

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;// 任意长度
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

let data: any[] = [];

for(let i=1; i< 500; i++) {
  data.push({
    key: `${i}`,
    name: randomWord(false, 6, 6),
    age: i,
    address: `New York No. ${i} Lake Park`,
  })
}

let dataSource = data?.map((item: any) => ({
  title: item.name,
  key: item.name
}))

export default class FilterTable extends React.Component {
  state = {
    filterDropdownVisible: false
  }

  onChange(pagination: any, filters: any, sorter: any, extra: any) {
    // console.log('params', pagination, filters, sorter, extra);
  }

  handleSearch = (selectedKeys: number[], confirm: Function, dataIndex: string) => {
    confirm();
  };

  handleReset = (clearFilters: Function) => {
    clearFilters();
  };

  getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <SearchTree
        dataSource={dataSource}
        confirm={confirm}
        clearFilters={clearFilters}
        setSelectedKeys={setSelectedKeys}
        // showNode={false}
        // showTree={false}
        // setVisible={() => this.setState({filterDropdownVisible: true})}
        // type='disabled'
      />
    ),
    onFilter: (value: any, record: any) => {
      return record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase())
    },
    filterDropdownVisible: this.state.filterDropdownVisible,
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if(visible) {
        this.setState({
          filterDropdownVisible: true
        });
      } else {
        this.setState({
          filterDropdownVisible: false
        });
      }
    }
  });

  render() {
    const columns = [
      {
        key: "name",
        title: 'Name',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name')
      },
      {
        key: "age",
        title: 'Age',
        dataIndex: 'age',
      },
      {
        key: "address",
        title: 'Address',
        dataIndex: 'address'
      },
    ];
    return (
      // <Table columns={columns} dataSource={data} onChange={this.onChange} />
      <VirtualTree />
    )
  }
}