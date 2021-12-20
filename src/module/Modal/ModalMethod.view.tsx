import React from 'react';
import { Button, Modal, Icon } from 'antd';

export default class ModalMethodView extends React.Component<any, any> {
  onClick() {
    Modal.confirm({
      title: "测试标题",
      content: "测试内容",
      icon: <Icon type='check-circle' style={{color: '#1AD999'}}/>,
      okText: "确定",
      cancelText: "取消"
    })
  }

  render() {
    return (
      <Button onClick={this.onClick}>点击</Button>
    )
  }
}