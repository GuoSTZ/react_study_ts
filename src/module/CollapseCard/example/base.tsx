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
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        collapse: ['email', 'message'],
        testInput: 'testInput',
        email: { username: '短信-用户名', password: '123' },
        message: { username: '消息-用户名', password: '456' }
      }}
      autoComplete="off">
      <Form.Item
        label="测试输入框"
        name="testInput"
        rules={[{ required: true, message: '请输入数据' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="折叠面板"
        name="collapse"
        rules={[{ required: true, message: '请勾选数据' }]}
      >
        <CollapseCard>
          <CollapseCard.Panel header="短信" key="email">
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

          <CollapseCard.Panel header="消息" key="message">
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

          <CollapseCard.Panel header="测试" key="test">
            <Form.Item
              label="Username"
              name={['test', 'username']}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name={['test', 'password']}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>
          </CollapseCard.Panel>
        </CollapseCard>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CollapseCardView;