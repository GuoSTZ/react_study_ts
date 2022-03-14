import React, { useState } from 'react';
import { Form, Input, Icon, Button, List, Checkbox, Select, Row, Col } from 'antd';
import { FormListFieldProps, FormList } from './FormList';
import VirtualSelect_class from '../Select/components';
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    props.form.validateFields((err: any, values: any) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const data = [];
  for(let i=0;i< 5; i++) {
    data.push({
      label: `content ${i}`,
      value: i.toString(),
    })
  }

  return (
    <div className='wrap'>
      <Form className='normal-form' onSubmit={onSubmit}>
        <Form.Item label="测试中" labelCol={{span: 4}} wrapperCol={{span: 20}}>
          {getFieldDecorator('virtual_select', {
            // rules: [
            //   { required: true, message: "请输入内容" }
            // ]
          })(
            <VirtualSelect_class placeholder="ceshi" mode='multiple'>
              {
                data?.map((item: any) => (
                  <VirtualSelect_class.Option value={item.value} key={item.value}>
                    {item.label}
                  </VirtualSelect_class.Option>
                ))
              }
            </VirtualSelect_class>
          )}
        </Form.Item>
        <FormList
          name="ceshi"
          form={props.form}
          max={5}
        >
          {(field: any, operation: any) => {
            const { name, fieldName, key, index, values } = field;
            const { AddNode, RemoveNode } = operation;
            return (
              <Form.Item
                label={"姓名"}
                key={key}
                {...formItemLayout}>
                <Row>
                  <Col span={10}>
                    <Form.Item>
                      {getFieldDecorator(`${fieldName}.firstName`, {
                        initialValue: values?.firstName,
                        key,
                        rules: [
                          { required: true, message: "请输入姓" }
                        ]
                      })(
                        <Input placeholder="姓" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item>
                      {getFieldDecorator(`${fieldName}.lastName`, {
                        initialValue: values?.lastName,
                        key,
                        // rules: [
                        //   { required: true, message: "请输入名" }
                        // ]
                      })(
                        <Input placeholder="名" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <AddNode />
                    <RemoveNode />
                  </Col>
                </Row>
              </Form.Item>
            )
          }}
        </FormList>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      {/* <Button onClick={handleSubmit}>
        获取数据
      </Button> */}
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