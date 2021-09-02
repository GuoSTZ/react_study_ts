import React, {ReactNode} from 'react';
import {Select, Form} from 'antd';
import {WrapperRef} from '@mcfed/components';

import {renderConfig} from './Columns.render';
import EditTable from './components/index';
import './index.css';

export interface FormProps {}

interface FormState {}

class EditTableDemo extends React.Component<
  FormProps,
  FormState
> {
  nodeRef = React.createRef();

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  handleSubmit(values: any): void {}

  handleCancel(): void {}

  formatData4Form(data: any) {}

  renderItem(item: any, index: number) {
    return (
      <Select.Option value={item} key={index}>
        {item}
      </Select.Option>
    );
  }

  render(): ReactNode {
    let direction: 'bottom'|'top'|undefined = 'bottom';
    let tableConf = {
      rowKey: 'id',
      data: [],
      columns: renderConfig([], this.props, this.nodeRef),
      btnText: {
        add: "新增"
      },
      formatData4Form: this.formatData4Form.bind(this),
      direction
    };
    // tableConf = Object.assign({}, tableConf, {
    //   onDelete: (data: any, callback: any) => {},
    //   onSave: (data: any, callback: any) => {}
    // });

    return (
        <Form>
          <Form.Item
            className="demo-editTable-formItem"
            label={"可编辑表格"}
            labelCol={{span: 4}}
            wrapperCol={{span: 20}}>
            <WrapperRef>
              <EditTable
                ref={(node: any) => (this.nodeRef = node)}
                {...tableConf}
              />
            </WrapperRef>
          </Form.Item>
        </Form>
    );
  }
}

const EditTableView = Form.create()(EditTableDemo);
export default EditTableView;