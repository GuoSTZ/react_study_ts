import React, { PropsWithChildren, Children, useState, useEffect } from 'react';
import { Select } from 'antd';
import { SelectProps, OptionProps } from 'antd/lib/select';
import './VirtualSelect.less';
import useDropdownRender from './useDropdownRender';

export interface VirtualSelectProps extends SelectProps {
  children: any[];
}

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const itemHeight = 32;

const VirtualSelect = (props: VirtualSelectProps) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [scrollTop, setScrollTop] = useState(0);

  // 下拉菜单元素
  let scrollDropdown: any = null;

  useEffect(() => {
    addEvent()
  }, [])
  
  const [DropdownRender] = useDropdownRender({
    start, 
    end, 
    allHeight: itemHeight * props.children.length, 
    itemHeight
  });

  const addEvent = () => {
    scrollDropdown = document.querySelector(`.VirtualSelect-dropdown`);
    // 下拉菜单未展开时元素不存在
    if (!scrollDropdown) return;

    scrollDropdown.addEventListener("scroll", () => {console.log(666)}, false);
  };

  const onDropdownVisibleChange = (visible: boolean) => {
    // 下拉菜单展开时，能够获取到元素并绑定监听事件
    let timer;
    if(!timer) {
      timer = setTimeout(() => addEvent());
    }
  }

  return (
    <Select 
      {...props} 
      showSearch
      filterOption={(value: string, option: any) => option?.props?.children?.toUpperCase()?.includes(value?.toUpperCase())}
      className="VirtualSelect" 
      dropdownClassName="VirtualSelect-dropdown"
      // dropdownMenuStyle={{height: 3200, maxHeight: 3200, transform: `translateY(${scrollTop}px)`}}
      dropdownStyle={{maxHeight: 256, overflow: 'auto'}}
      dropdownRender={DropdownRender}
      onDropdownVisibleChange={onDropdownVisibleChange}
    >
      {
        Children?.map(props?.children.slice(start, end), (child: any, index: number) => {
          return child;
        })
      }
    </Select>
  )
}

VirtualSelect.Option = Option;
VirtualSelect.OptGroup = OptGroup;

export default VirtualSelect;