import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

export interface DropdownViewProps {
  menuItems: MenuItemsProps[];
  className?: string;
}

interface MenuItemsProps {
  title: string;
  onClick: Function;
}

const useDropdownView = ({ menuItems, className }: DropdownViewProps) => {

  const menu = (
    <Menu>
      {
        menuItems?.map((item: any, index: number) => (
          <Menu.Item onClick={item.onClick} key={index}>
            {item.title}
          </Menu.Item>
        ))
      }
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