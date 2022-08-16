import React from 'react';
import { Button } from 'antd';
import CollapseCard from '..';
import FormRender from '../../FormRender';
import schema from './data.json';

let form: any;
const CollapseCardJson = (props: any) => {

  const submit = () => {
    form
      ?.submit((values: any) => {
        console.log(values, '=====')
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  return (
    <div>
      <FormRender
        getForm={base => form = base}
        schema={schema}
        components={{
          CollapseCard,
          CollapseCardPanel: CollapseCard.Panel
        }}
      />
      <Button
        type='primary'
        onClick={submit}
        style={{ marginTop: 10 }}>
        提交
      </Button>
    </div>
  )
}

export default CollapseCardJson;