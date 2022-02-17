import React, { useState } from 'react';
import { Form, Input, Icon, Button, List, Checkbox, Select } from 'antd';
import DynamicForm from './DynamicForm';
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

  const validateTest = (rules: any, value: any, callback: any) => {
    const { field, key } = rules;
    console.log(form.getFieldValue(`data`), form.getFieldValue(`data.${key}.select`));
    callback();
  }

  return (
    <div className='wrap'>
      <Form className='normal-form'>

        <DynamicForm className="customForm" name="data" form={form} max={3} >
          {
            (key: number) => (
              <div className='aaa'>
                <Form.Item>
                  {getFieldDecorator(`data.${key}.input`, {
                    rules: [
                      { required: true, message: '请输入内容!' },
                      // { validator: validateTest, key }
                    ]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>

                <Form.Item>
                  {getFieldDecorator(`data.${key}.select`, {
                    rules: [{ required: true, message: '请选择内容!' }],
                  })(
                    <Select placeholder="请选择">
                      <Select.Option value={1}>aaa</Select.Option>
                      <Select.Option value={2}>bbb</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </div>
            )
          }
        </DynamicForm>
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