import React from 'react';
import {Input} from 'antd';

const validateRepeatIpAndPort = (rule: any, value: any, callback: any) => {
  const {instance, form} = rule;
  const {ip, port} = form.getFieldsValue(['ip', 'port']);
  const ipAndPort = `${ip}:${port}`;
  let flag = instance?.state?.data?.some(
    (item: any) =>
      item.key !== instance?.state?.editingKey && ipAndPort === `${item?.ip}:${item?.port}`
  );
  // portFlag 用来限制触发校验port的方法，避免进行多次无意义的校验
  let portFlag = instance?.state?.data?.some((item: any) => item.key !== instance?.state?.editingKey && port === item.port);
  if (flag) {
    return callback('出现重复语句');
  } else {
    if (port && portFlag) {
      form?.validateFields(['port']);
    }
    return callback();
  }
};

const validateRepeatIpAndPort1 = (rule: any, value: any, callback: any) => {
  const {instance, form} = rule;
  const {ip, port} = form.getFieldsValue(['ip', 'port']);
  const ipAndPort = `${ip}:${port}`;
  console.log(instance?.state?.data, instance?.state?.editingKey, '===')
  let flag = instance?.state?.data?.some(
    (item: any) =>
      item.key !== instance?.state?.editingKey && ipAndPort === `${item?.ip}:${item?.port}`
  );
  // ipFlag 用来限制触发校验ip的方法，避免进行多次无意义的校验
  let ipFlag = instance?.state?.data?.some((item: any) => item.key !== instance?.state?.editingKey && ip === item.ip);
  if (flag) {
    return callback('出现重复语句');
  } else {
    if (ip && ipFlag) {
      form?.validateFields(['ip']);
    }
    return callback();
  }
};

export function renderConfig(attributesOption: any, props: any) {
  // const {locale, onChange} = props;
  return [
    {
      title: 'IP',
      key: 'ip',
      dataIndex: 'ip',
      width: '30%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (instance: any, form: any) => ({
        initialValue: "192.168.1.1",
        rules: [
          {required: true, message: '请输入IP'},
          {validator: validateRepeatIpAndPort, instance, form}
        ]
      }),
      editingStatus: false,
      editComponent: (text: any, row: any, instance: Object, form: any) => (
        <Input placeholder='请输入IP' />
      )
    },
    {
      title: '端口',
      key: 'port',
      dataIndex: 'port',
      width: '30%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (instance: any, form: any) => ({
        rules: [
          {required: true, message: '请输入端口'},
          {validator: validateRepeatIpAndPort1, instance, form}
        ]
      }),
      editingStatus: false,
      editComponent: (text: any, row: any, instance: Object, form: any) => (
        <Input placeholder='请输入端口' />
      )
    }
  ];
}
