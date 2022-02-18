import React, { useState } from 'react';
import { Form, Input, Icon, Button, List, Checkbox, Select, Row, Col } from 'antd';
import FormList, { FormListFieldProps } from './FormList';
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
        console.log(values, '===')
        setFormData(data)
      } else {
        setFormData([]);
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  return (
    <div className='wrap'>
      <Form className='normal-form'>

        <FormList
          name="data"
          form={form} 
          max={3}
          initialValue={[{ input: "123", select: 1 }, { input: "12356788", select: 2 }]}
        >
          {
            ({ name, key, index, values }: FormListFieldProps) => (
              <Form.Item
                key={key}
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? "动态表单测试" : ""}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item key={key} wrapperCol={{ span: 23 }}>
                      {getFieldDecorator(`${name}.input`, {
                        initialValue: values["input"],
                        rules: [
                          { required: true, message: '请输入内容!' },
                        ]
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item key={key} wrapperCol={{ span: 23 }}>
                      {getFieldDecorator(`${name}.select`, {
                        initialValue: values["select"],
                        rules: [{ required: true, message: '请选择内容!' }],
                      })(
                        <Select placeholder="请选择">
                          <Select.Option value={1}>aaa</Select.Option>
                          <Select.Option value={2}>bbb</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>

              </Form.Item>
            )
          }
        </FormList>

      </Form>

      <Button onClick={handleSubmit}>
        获取数据
      </Button>
      {/* <List
        className='wrap-list'
        dataSource={formData}
        renderItem={(item: any) => (
          <List.Item>
            {item.label}: {item.value}
          </List.Item>
        )}
      /> */}
    </div >
  )
}

const FormView = Form.create()(FormWrap);
export default FormView;