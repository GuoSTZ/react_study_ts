import React from 'react';
import { Form, Button, Input } from 'antd';
import CollapseCard from '..';

const CollapseCardView = (props: any) => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off">
      <CollapseCard>
        <CollapseCard.Panel header="短信" key="1">
          <Form.Item
            label="Username"
            name={['email', 'username']}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name={['email', 'password']}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
        </CollapseCard.Panel>

        <CollapseCard.Panel header="消息" key="2">
          <Form.Item
            label="Username"
            name={['message', 'username']}
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name={['message', 'password']}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
        </CollapseCard.Panel>
      </CollapseCard>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CollapseCardView;