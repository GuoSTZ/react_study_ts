import React from 'react';
import { Button, Tooltip } from 'antd';
import {ButtonProps} from 'antd/lib/button';

interface DisabledButtonProps extends ButtonProps{
  disabledText?: string;
}

interface DisabledButtonState {

}

export default class DisabledButton extends React.Component<
  DisabledButtonProps,
  DisabledButtonState
>{
  render() {
    const {disabled, disabledText, ...otherProps} = this.props;
    if(disabled) {
      return (
        <Tooltip title={disabledText || "测试"}>
          <Button disabled {...otherProps}>测试</Button>
        </Tooltip>
      )
    } else {
      return <Button {...otherProps}>测试</Button>;
    }
  }

}