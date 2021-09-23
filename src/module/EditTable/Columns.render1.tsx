import React from 'react';
import {Input, Cascader} from 'antd';

const setDisabled = (options: any, data: any, level: number) => {
  options?.map((item: any) => {
    if(!data[level+1] && item.value === data[level]) {
      item.disabled = true;
    }
    if(data[level+1] && item.value === data[level] && item?.children?.length > 0) {
      level++;
      setDisabled(item.children, data, level);
    }
    return item;
  });
}

const filter = (inputValue: any, path: any) => {
  return path?.some((option: any) => option?.label?.toLowerCase()?.indexOf(inputValue?.toLowerCase()) > -1);
}

export function renderConfig(options: any, props: any) {
  return [
    {
      title: 'account',
      key: 'account',
      dataIndex: 'account',
      width: '30%',
      renderCol: (text: string, row: any, instance: Object) => text,
      editConfig: (data: any, editingKey: any, form: any) => ({
        rules: [
          {
            validator: (rule: any, value: any, callback: any) => {
              if(!value) {
                return callback("请选择账号");
              }
              return callback();
            }
          }
        ]
      }),
      editComponent: (text: any, row: any, instance: Object, form: any, data: any) => {
        let copy = JSON.parse(JSON.stringify(options));
        data?.map((item: any) => {
          setDisabled(copy, item.account, 0);
        })
        return (
          <Cascader 
            options={copy} 
            showSearch={{filter}}  
          />
        )
      }
    }
  ];
}
