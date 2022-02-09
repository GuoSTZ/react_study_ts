import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const useDropdownView = ({ selectAll, selectAllCurrent, invertCurrent, className }: any) => {
  const handleClick = (e: any) => {
    switch(e?.key) {
      case "1": 
        selectAll();
        break;
      case "2":
        selectAllCurrent();
        break;
      case "3":
        invertCurrent();
        break;
    }
  }

  const menu = (
    <Menu onClick={handleClick}>
      <Menu.Item key={"1"}>
        全选所有
      </Menu.Item>
      <Menu.Item key={"2"}>
        全选当页
      </Menu.Item>
      <Menu.Item key={"3"}>
        反选当页
      </Menu.Item>
    </Menu>
  );

  const DropdownView = () => (
    <Dropdown overlay={menu}>
      <Icon type="down" className={className} />
    </Dropdown>
  )

  return {
    DropdownView
  }
}

export default useDropdownView;