import React from 'react';
import { Form, Checkbox, Button, Input, Icon } from 'antd';
import CollapseCard from '..';
import { FormItem } from '@mcfed/components';

const CollapseCardForm = (props: any) => {
  const { getFieldDecorator } = props.form;
  console.log(props.form, '=====form')
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} className="login-form" labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
      <CollapseCard>

        <Form.Item label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item label="password">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>

        {/* <FormItem name="ceshi" label="password" rules={[
          { required: true, message: 'Please input your Password!' }
        ]}>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        </FormItem> */}
      </CollapseCard>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

const CollapseCardView = Form.create({})(CollapseCardForm);

export default CollapseCardView;