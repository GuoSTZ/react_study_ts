import React from 'react';
import RcSelect, { Option, OptGroup, SelectProps as RcSelectProps } from 'rc-select';
import 'rc-select/assets/index.less';

export interface RcSelectViewProps extends RcSelectProps {

}

const RcSelectView: React.FC<RcSelectViewProps> = props => {
  return (
    <RcSelect>
      <Option value="jack">jack</Option>
      <Option value="lucy">lucy</Option>
      <Option value="yiminghe">yiminghe</Option>
    </RcSelect>
  )
}

export default RcSelectView;