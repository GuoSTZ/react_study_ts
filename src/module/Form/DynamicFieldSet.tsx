import React, { useState } from 'react';
import { Form, Button, Icon, Input } from 'antd';

const CustomizedForm: any = (props: any) => {
  const { form: {getFieldDecorator}, keys,  removeItem } = props;

  const getItem = () => {
    return keys?.map((key: number, index: number) => (
      <Form.Item
        // {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        // label={index === 0 ? 'Passengers' : ''}
        required={false}
        key={key}
      >
        {getFieldDecorator(`names[${key}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            },
          ],
        })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => removeItem && removeItem(key)}
          />
        ) : null}
      </Form.Item>
    ))
  }

  return (
    <Form>
      {getItem()}
    </Form>
  )
}

const WrapCustomizedForm = Form.create({
  name: 'global_state',
  onFieldsChange(props: any, changedFields: any) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props: any) {
    return {
      username: Form.createFormField({
        ...props.username,
        value: 1,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  }
})(CustomizedForm);

const DynamicFieldSet: React.FC = (props: any) => {
  const { form, form: { getFieldDecorator, getFieldValue } } = props;
  // const [formItems, setFormItems] = useState([]);
  // 用来做计数值
  const [count, setCount] = useState(0 as number);
  const [keys, setKeys] = useState([] as number[]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, values: any) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map((key: any) => names[key]));
      }
    });
  };

  const addItem = () => {
    setKeys(keys.concat([count + 1]));
    setCount(count + 1)
  }

  const removeItem = (key: number) => {
    if (keys?.length < 2) {
      return;
    }
    const new_keys = keys?.filter((item: number) => item !== key);
    setKeys(new_keys);
  }

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
    <React.Fragment>
      <WrapCustomizedForm keys={keys} removeItem={removeItem}/>
      <Form.Item>
        <Button type="dashed" onClick={addItem} style={{ width: '100%' }}>
          <Icon type="plus" /> Add field
        </Button>
      </Form.Item>
    </React.Fragment>
  )
}

const WrapDynamicFieldSet = Form.create()(DynamicFieldSet);
export default WrapDynamicFieldSet;