import React, { useState } from 'react';
import { Form, Input, Icon, Button, List, Checkbox } from 'antd';
import WrapDynamicFieldSet from './DynamicFieldSet';
import './style/Form.less';

const FormWrap = (props: any) => {
  const { form, form: { getFieldDecorator } } = props;
  const [formData, setFormData] = useState([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    form?.validateFields((err: any, values: any) => {
      if (!err) {
        let data: any = [];
        for (let key in values) {
          data.push({
            label: key,
            value: values[key]
          });
        }
        console.log(data, '===')
        setFormData(data)
      } else {
        setFormData([]);
      }
    });
  };

  return (
    <div className='wrap'>
      <Form className='normal-form'>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('set', {
            // rules: [{ required: true, message: 'Please!' }],
          })(
            <WrapDynamicFieldSet />
          )}
        </Form.Item>
      </Form>


      <Button onClick={handleSubmit}>
        获取数据
      </Button>
      <List
        className='wrap-list'
        dataSource={formData}
        renderItem={(item: any) => (
          <List.Item>
            {item.label}: {item.value}
          </List.Item>
        )}
      />
    </div >
  )
}

const FormView = Form.create()(FormWrap);
export default FormView;