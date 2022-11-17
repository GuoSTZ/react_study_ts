import React from "react";
import { Form, Button } from "antd";
import McTreeSelect from "../../TreeSelect";

const FormView = (props) => {
  const getData = () => {
    const treeData = [];
    for (let i = 0; i < 500; i++) {
      treeData.push({
        title: `Node${i}`,
        value: `0-${i}`,
        children: i % 5 === 0 ? [{title: `测试${i}`, value: `0-0-${i}`}] : undefined
      });
    }

    return treeData;
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="带有全部的树下拉框"
        name="McTreeSelect"
        rules={[{ required: true, message: "请选择" }]}
      >
        <McTreeSelect
          selectAll
          selectAllValue={'aaa'}
          showCheckedStrategy='SHOW_PARENT'
          treeCheckable
          multiple
          style={{ width: 400 }}
          treeData={getData()}
          placeholder="请选择"
          value={'0-1'}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormView;
