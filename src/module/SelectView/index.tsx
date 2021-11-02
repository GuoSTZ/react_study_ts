import React from "react";
import {Select} from 'antd';
import { SelectProps } from "antd/lib/select";

const Option = Select.Option;

export interface SelectViewProps extends SelectProps { }

interface SelectViewState { }


export default class SelectView extends React.Component<
  SelectViewProps,
  SelectViewState
> {
  render() {
    return (
      <Select style={{width: 300, marginLeft: 500}} defaultValue={1}>
        <Option value={1} key={1}>aaa</Option>
        <Option value={2} key={2}>bbb</Option>
        <Option value={3} key={3}>ccc</Option>
        <Option value={4} key={4}>ddd</Option>
      </Select>
    )
  }
}