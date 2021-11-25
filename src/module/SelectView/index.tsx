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
  filterOption(inputValue: string, option: any) {
    if(option?.props?.children?.toUpperCase()?.includes(inputValue?.toUpperCase())) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <Select style={{width: 300, marginLeft: 500}} filterOption={this.filterOption} showSearch>
        <Option value={"Aaa"} key={1}>Aaa</Option>
        <Option value={"aaa"} key={2}>aaa</Option>
        <Option value={"aAAB"} key={3}>aAAB</Option>
        <Option value={4} key={4}>ddd</Option>
      </Select>
    )
  }
}