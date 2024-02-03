import React, { useEffect } from 'react'
import { Button, Radio, Select, Cascader } from 'antd'
import CollapseForm from "../../components/CollapseForm";
import McFormily from '@meichuang/formily';
import {
  onFieldValidateStart,
  onFieldValidateEnd,
  onFieldValueChange,
  onFieldMount,
  onFieldChange
} from '@meichuang/formily/dist/dependencies/formilyCore';
import schema from './test.json'
import { mockData } from './data'

// 数据库类型级联数据处理
const handleDsTypes = (data: any) => {
  return data?.map((item: any) => {
    const children =
      item.dbList?.map((item: any) => ({
        label: item.dsTypeStr,
        value: item.dsType
      })) || [];
    return {
      label: item.datasourceClassStr,
      value: item.datasourceClass,
      children,
      disabled: children?.length === 0
    };
  });
};

const dbData = handleDsTypes(mockData)

const getDbVersion = (dsType: string) => {
  const obj: any = {};
  mockData.map((item: any) => {
    item.dbList.map((db: any) => {
      obj[db.dsType] = db.dsVersion.map((version: any) => ({label: version, value: version}))
    })
  })
  return obj[dsType] || [];
}


const options = [
  { label: "label1", value: 1 },
  { label: "label2", value: 2 },
]

const data = [
  {
    label: "流量审计",
    name: 'a',
    value: 1,
    key: "1",
    used: 0,
    total: 25,
    tips: "未授权能力无法使用",
    // 表明是否需要禁用该功能块，主要是为了区分 是不可用还是数量已经用完
    disabled: true,
    // 表明该功能块是否可用，「未授权」「数据类型不支持」
    available: false,
    children: null
  },
  {
    label: "运维管控",
    name: 'b',
    value: 2,
    key: "2",
    used: 0,
    total: 25,
    tips: "已使用保护对象数",
    // 表明是否需要禁用该功能块，主要是为了区分 是不可用还是数量已经用完
    disabled: false,
    // 表明该功能块是否可用，「未授权」「数据类型不支持」
    available: true,
    children: [
      {
        label: "运行模式",
        name: "deployMode",
        content: <Radio.Group options={options} />,
        // FormItem相关配置传入
        options: {
          rules: [
            { required: true, message: "请选择运行模式" }
          ]
        }
      }
    ]
  },
  {
    label: "业务防护",
    name: 'c',
    value: 3,
    key: "3",
    used: 0,
    total: 25,
    tips: "已使用保护对象数",
    // 表明是否需要禁用该功能块，主要是为了区分 是不可用还是数量已经用完
    disabled: false,
    // 表明该功能块是否可用，「未授权」「数据类型不支持」
    available: true,
    children: [
      {
        label: "运行模式",
        name: "deployMode",
        content: <Radio.Group options={options} />,
        // FormItem相关配置传入
        options: {
          rules: [
            { required: true, message: "请选择运行模式" }
          ]
        }
      },
      {
        label: "审计范围",
        name: "auditScope",
        content: <Radio.Group options={options} />,
        // FormItem相关配置传入
        options: {
          rules: [
            { required: true, message: "请选择审计范围" }
          ]
        }
      }
    ]
  },
  {
    label: "数据加密",
    name: 'd',
    value: 4,
    key: "4",
    used: 25,
    total: 25,
    tips: "已使用保护对象数",
    // 表明是否需要禁用该功能块，当available为false，且used >= total时，设置为true
    disabled: true,
    // 表明该功能块是否可用，「未授权」「数据类型不支持」
    available: true,
    children: null
  },
  {
    label: "数据脱敏",
    name: 'e',
    value: 5,
    key: "5",
    used: 0,
    total: 25,
    tips: "当前数据类型不支持",
    // 表明是否需要禁用该功能块，主要是为了区分 是不可用还是数量已经用完
    disabled: true,
    // 表明该功能块是否可用，「未授权」「数据类型不支持」
    available: false,
    children: null
  }
]

const outData = [
  {
    value: '2',
    // children: {
    //   deployMode: 1,
    //   auditScope: 1
    // }
  }
]

const extraComponents = {
  CollapseForm: (props: any) => <CollapseForm {...props} config={data} />
}

function validateChildValue(value: any, rule: any) {
  if (!value) return ('请选择防护目的' || rule.message)
  const flag = value?.some((item: any) => {
    if (!item.children) return ""
    return Object.values(item.children)?.some(child => child === undefined)
  })
  if (flag) {
    return "请选择内部组件值"
  } else {
    return ""
  }
}

const validator = {
  validateChildValue
}

const components = {
  AntdSelect: Select,
  AntdCascader: (props: any) => {
    return <Cascader {...props} options={dbData} />
  }
}

let baseForm: any;

export default () => {

  useEffect(() => {
    baseForm.setInitialValues({
      test: outData
    })
  }, [])

  return (
    <div>
      <McFormily
        getForm={form => baseForm = form}
        schema={schema}
        components={components}
        formComponents={extraComponents}
        validator={validator}
        scope={{
          getDbVersion
        }}
        effects={() => {
          // onFieldValidateStart('test', (field, form) => {
          //   field.componentProps.isValidating = true
          // })
          // onFieldValidateEnd('test', (field, form) => {
          //   field.componentProps.isValidating = false
          // })
          // onFieldValueChange('test', (field, form) => {
          //   // 修改值而不是触发校验时，组件内部不应该对子组件进行校验
          //   field.componentProps.isValidating = false
          // })
          // onFieldMount('dbType', (field) => {
          //   // @ts-ignore
          //   field.dataSource = []
          // })
        }}
      />
      <Button
        onClick={() => {
          baseForm
            .submit()
            .then((value: any) => console.log(value, '=======formily,value'))
        }}>
        收集数据
      </Button>
    </div>
  )
}