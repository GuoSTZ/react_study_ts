import React from 'react';
import Form from 'antd/es/form';
import EditTable from './components/error_EditTable';
import { WrapperRef } from '@mcfed/components';
import { renderConfig } from './Columns.render2';
import { Checkbox, Button, Input } from 'antd';

class CheckWrap extends React.Component<any, any> {
  nodeRef = React.createRef();

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;
    let mode: any = 'full';
    let tableConf = {
      rowKey: 'key',
      data: [],
      // data: data1,
      columns: renderConfig(['aaa', 'bbb', 'ccc'], this.props),
      mode,
      // formatData4Form: this.formatData4Form.bind(this),
      // direction,
      // pagination: false,
      showHeader: false,
      bordered: false,
      maxNum: 4,
      maxErrorMsg: "最多可添加4个账号",
      // hideDeleteConfirm: true
    };
    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <Form.Item
          label={"可编辑表格"}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          {getFieldDecorator('edit', {
            rules: [{ required: true, message: '请填选内容' }],
          })(
            <WrapperRef>
              <EditTable
                ref={(node: any) => (this.nodeRef = node)}
                {...tableConf}
              />
            </WrapperRef>
          )}
        </Form.Item>
        <Form.Item
          label={"输入框"}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          {getFieldDecorator('input', {
            rules: [{ required: true, message: '请输入' }],
          })(
            <Input placeholder="请输入内容"/>
          )}
        </Form.Item>
        <Form.Item
          label={"勾选项"}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}>
          {getFieldDecorator('check', {
            rules: [{ required: true, message: '请勾选' }],
          })(
            <Checkbox>xxxx</Checkbox>
          )}
        </Form.Item>
        <Form.Item
          wrapperCol={{ span: 20, offset: 4 }}>
          <Button type="primary" htmlType="submit" className="login-form-button">
            收集数据
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const CheckView = Form.create()(CheckWrap);
export default CheckView;