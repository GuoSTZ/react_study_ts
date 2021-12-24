import React, { Fragment } from 'react';
import { Table, Descriptions } from 'antd';


export default class ExpandedTableView extends React.Component {
  render() {
    const data: any[] = [
      {
        key: '1',
        name: '胡彦斌',
        age: 32,
        age2: 32,
        age3: 32,
        age4: 32,
        address: '西湖区湖底公园1号',
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        age2: 32,
        age3: 32,
        age4: 32,
        address: '西湖区湖底公园1号',
      }
    ];
    const columns: any[] = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 300,
        fixed: 'left'
      },
      {
        title: '年龄2',
        dataIndex: 'age2',
        key: 'age2',
        width: 300
      },
      {
        title: '年龄3',
        dataIndex: 'age3',
        key: 'age3',
        width: 300
      },
      {
        title: '年龄4',
        dataIndex: 'age4',
        key: 'age4',
        width: 300
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 300
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        width: 300,
        fixed: 'right'
      }
    ];
    return (
      <Table 
        dataSource={data}
        columns={columns}
        expandedRowRender={() => {
          console.log("aaa")
          return (
            // <Fragment>
            //   <div>saaa</div>
            //   <div>asdadasd</div>
            // </Fragment>
            <Descriptions>
              <Descriptions.Item label="title1">aaaaa</Descriptions.Item>
              <Descriptions.Item label="title2">bbbbb</Descriptions.Item>
              <Descriptions.Item label="title3">ccccc</Descriptions.Item>
              <Descriptions.Item label="title4">ddddd</Descriptions.Item>
              <Descriptions.Item label="title5">eeeee</Descriptions.Item>
              <Descriptions.Item label="title6">fffff</Descriptions.Item>
              <Descriptions.Item label="title7">ggggg</Descriptions.Item>
            </Descriptions>
          )
        }}
        scroll={{x: 'max-content'}}
      />
    )
  }
}