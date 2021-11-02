import React, { ReactNode } from 'react';
import { Select, Form } from 'antd';
import { WrapperRef } from '@mcfed/components';

import { renderConfig } from './Columns.render';
import EditTable from './components/index';
import './index.css';

export interface FormProps { }

interface FormState { }

class EditTableDemo extends React.Component<
  FormProps,
  FormState
> {
  nodeRef = React.createRef();

  componentDidMount(): void { }

  componentWillUnmount(): void { }

  handleSubmit(values: any): void { }

  handleCancel(): void { }

  formatData4Form(data: any) { }

  renderItem(item: any, index: number) {
    return (
      <Select.Option value={item} key={index}>
        {item}
      </Select.Option>
    );
  }

  setDefaultProxyIp(data: any) {
    if (!data) {
      return [];
    }
    let res: any = [];
    data?.map((item: any) => {
      if (!item.ip) {
        res.push({ ...item, ip: window.location.hostname });
      } else {
        res.push(item);
      }
    });
    return res;
  }

  render(): ReactNode {
    let direction: 'bottom' | 'top' | undefined = 'bottom';
    let mode: any = 'full';
    const data = [
      { key: "1", ip: '', port: '' },
      { key: "2", ip: null, port: null },
      { key: "3", ip: undefined, port: undefined },
      { key: "4", ip: "192.168.2.2", port: 30 }
    ];
    const data1 = [
      {key: '1', account: ['MySQL', 'db1', 'account1']}
    ]
    const options = [
      {
        value: 'MySQL',
        label: 'MySQL',
        children: [
          {
            value: 'db1',
            label: '数据源aaa',
            children: [
              {
                value: 'account1',
                label: '账户1',
              },
              {
                value: 'account2',
                label: '账户2',
              },
              {
                value: 'account3',
                label: '账户3',
              }
            ],
          },
          {
            value: 'db2',
            label: '数据源bbb',
            children: [
              {
                value: 'account1',
                label: '账户1',
              },
              {
                value: 'account2',
                label: '账户2',
              },
              {
                value: 'account3',
                label: '账户3',
              }
            ],
          }
        ]
      },
      {
        value: 'Oracle',
        label: 'Oracle',
        children: [
          {
            value: 'db1',
            label: '数据源ccc',
            children: [
              {
                value: 'account1',
                label: '账户1',
              },
              {
                value: 'account2',
                label: '账户2',
              },
              {
                value: 'account3',
                label: '账户3',
              }
            ],
          },
          {
            value: 'db2',
            label: '数据源ddd',
            children: [
              {
                value: 'account1',
                label: '账户1',
              },
              {
                value: 'account2',
                label: '账户2',
              },
              {
                value: 'account3',
                label: '账户3',
              }
            ],
          }
        ]
      }
    ];
    let tableConf = {
      rowKey: 'key',
      data: [],
      // data: data1,
      columns: renderConfig(options, this.props),
      // mode,
      formatData4Form: this.formatData4Form.bind(this),
      direction,
      // pagination: false,
      // showHeader: false,
      // bordered: false,
      maxNum: 2,
      maxErrorMsg: "最多可添加2个账号",
      // hideDeleteConfirm: true
    };
    // tableConf = Object.assign({}, tableConf, {
    //   onDelete: (data: any, callback: any) => {},
    //   onSave: (data: any, callback: any) => {}
    // });

    return (
      <Form>
        <Form.Item
          className="demo-editTable-formItem"
          label={"可编辑表格"}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          <WrapperRef>
            <EditTable
              ref={(node: any) => (this.nodeRef = node)}
              {...tableConf}
            />
          </WrapperRef>
        </Form.Item>
      </Form>
    );
  }
}

const EditTableView = Form.create()(EditTableDemo);
export default EditTableView;