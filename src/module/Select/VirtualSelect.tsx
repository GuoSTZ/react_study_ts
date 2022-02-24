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

// 一次渲染的数据量
const ITEM_SIZE = 30;

const ITEM_HEIGHT_CONFIG = {
  small: 24,
  large: 40,
  default: 32
};

type FilterChildListType = undefined | any[];

const VirtualSelect = (props: VirtualSelectProps) => {
  const {children = [], ...restProps} = props;

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(ITEM_SIZE);
  const [allHeight, setAllHeight] = useState(children.length || 100);
  const [childList, setChildList] = useState([] as any);
  const [filterChildList, setFilterChildList] = useState(undefined as FilterChildListType);


  // 下拉菜单元素
  let scrollDropdown: any = null;
  let prevScrollTop = 0;
  // 子项高度
  const ITEM_HEIGHT = ITEM_HEIGHT_CONFIG[props.size || "default"];
  // 可视区 dom 高度
  const visibleDomHeight = ITEM_HEIGHT * ITEM_SIZE;
  // 滚动时重新渲染的 scrollTop 判断值，大于 reactDelta 则刷新下拉列表
  const reactDelta = visibleDomHeight / 3;
  

  useEffect(() => {
    setTimeout(() => { addEvent(); }, 500);
    setChildList(children);
    return () => {
      removeEvent();
    };
  }, []);

  // 区分是否存在搜索情况
  const getChildList = () => {
    return filterChildList || childList;
  }

  const isScroll = (): boolean => {
    let height = Math.abs(scrollDropdown.scrollTop - prevScrollTop);
    return height > reactDelta;
  }

  const handleItemIndex = () => {
    const index = Math.floor(scrollDropdown.scrollTop / ITEM_HEIGHT);
    let startIndex = index - ITEM_SIZE < 0 ? 0 : index - ITEM_SIZE / 2;
    // 记录滚动高度
    prevScrollTop = scrollDropdown.scrollTop;
    const allHeight = getChildList().length * ITEM_HEIGHT || 100;

    setStart(startIndex);
    setEnd(index + ITEM_SIZE);
  }

  const onScroll = () => {
    isScroll() && handleItemIndex()
  }

  // 挂载监听事件
  const addEvent = () => {
    scrollDropdown = document.querySelector(`.VirtualSelect-dropdown`);
    // 下拉菜单未展开时元素不存在
    if (!scrollDropdown) return;
    scrollDropdown.addEventListener("scroll", onScroll, false);
  };

  // 卸载监听事件
  const removeEvent = () => {
    scrollDropdown.removeEventListener("scroll", onScroll, false);
  }

  const onDropdownVisibleChange = (visible: boolean) => {
    // 下拉菜单展开时，确保能够获取到元素并绑定监听事件
    let timer;
    if(!timer) {
      timer = setTimeout(() => addEvent());
    } else {
      handleItemIndex();
    }
  }

  const [DropdownRender] = useDropdownRender(
    start, 
    end, 
    ITEM_HEIGHT * getChildList().length, 
    ITEM_HEIGHT
  );

  return (
    <Select 
      {...restProps} 
      className="VirtualSelect" 
      dropdownClassName="VirtualSelect-dropdown"
      dropdownStyle={{maxHeight: 224, overflow: 'auto'}}
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