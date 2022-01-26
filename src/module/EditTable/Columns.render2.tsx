import React from 'react';
import {Input, Select} from 'antd';

// class Wrap extends React.Component<any, any> {
//   render(): React.ReactNode {
//     return (
//       <div>
//         <Select>
//           <Select.Option>aaaa</Select.Option>
//         </Select>
//       </div>
//     )
//   }
// }

export function renderConfig(options: any, props: any) {
  return [
    {
      title: 'account',
      key: 'account',
      dataIndex: 'account',
      width: '40%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (data: any, editingKey: any, form: any) => ({
        rules: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if(!value) {
                return callback("请选择内容");
              }
              return callback();
            }
          }
        ]
      }),
      editComponent: (text: any, row: any, instance: Object, form: any, data: any) => {
        return (
          <Select placeholder="请选择">
            {
              options?.map((item: any) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))
            }
          </Select>
        )
      }
    },
    {
      title: 'number',
      key: 'number',
      dataIndex: 'number',
      width: '30%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (data: any, editingKey: any, form: any) => ({
        initialValue: 12,
        rules: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if(!value) {
                return callback("请输入内容");
              }
              return callback();
            }
          }
        ]
      }),
      editComponent: (text: any, row: any, instance: Object, form: any, data: any) => {
        return (
          <Input placeholder='请输入' style={{width:"100%"}}/>
        )
      }
    },
    {
      title: 'number2',
      key: 'number2',
      dataIndex: 'number2',
      width: '20%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (data: any, editingKey: any, form: any) => ({
        rules: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if(!value) {
                return callback("请输入内容2222");
              }
              return callback();
            }
          }
        ]
      }),
      editComponent: (text: any, row: any, instance: Object, form: any, data: any) => {
        return (
          <Input placeholder='请输入2222' style={{width:"100%"}}/>
        )
      }
    }
  ];
}
