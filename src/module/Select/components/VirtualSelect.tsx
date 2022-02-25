import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { Select } from 'antd';
import { SelectProps, OptionProps } from 'antd/lib/select';
import DropdownRender from './DropdownRender';
import DropdownRender2 from './DropdownRender_class';
import './index.less';

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
  const { 
    children = [],
    className,
    dropdownClassName,
    dropdownStyle,
    ...restProps 
  } = props;

  const [childList, setChildList] = useState([] as any);
  const [filterChildList, setFilterChildList] = useState(undefined as FilterChildListType);


  // 下拉菜单元素
  let scrollDropdown: any = null;
  // 下拉菜单元素当前的滚动高度
  let currScrollTop = 0;
  // 下拉菜单元素上一次的滚动高度
  let prevScrollTop = 0;
  // 子项高度
  const ITEM_HEIGHT = ITEM_HEIGHT_CONFIG[props.size || "default"];
  // 自定义滚动多少高度后，进行新的数据渲染
  const height_to_refresh = ITEM_HEIGHT * ITEM_SIZE / 3;

  let timer: any = null;
  const cref = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => { addEvent() }, 500);
    setChildList(children);
    return () => {
      removeEvent();
    };
  }, []);

  // 防抖
  const debounce = (fn: Function, delay: number) => {
    var dtimer: any = null;
    return function(value: string) {
      if (dtimer) {
        clearTimeout(dtimer);
      }
      dtimer = setTimeout(() => {
        fn(value);
      }, delay);
    };
  }

  // 区分是否存在搜索情况
  const getChildList = () => {
    return filterChildList || childList;
  }

  // 获取总高度，数据为空时，设置为100
  const getAllHeight = () => {
    return getChildList().length * ITEM_HEIGHT || 100;
  }

  const handleItemIndex = () => {
    const index = Math.floor(currScrollTop / ITEM_HEIGHT);
    let start = index - ITEM_SIZE < 0 ? 0 : index - ITEM_SIZE / 2;
    // 记录滚动高度
    prevScrollTop = currScrollTop;
    const end = index + ITEM_SIZE;
    return { start, end };
  }

  // 是否应该渲染新的数据
  const shouldRefreshDropdown = (): boolean => {
    currScrollTop = scrollDropdown ? scrollDropdown.scrollTop : 0;
    let height = Math.abs(currScrollTop - prevScrollTop);
    console.log(filterChildList, '===')
    return height > height_to_refresh;
  }

  // 重渲染下拉菜单
  const refreshDropdown = (height?: number) => {
    const { start, end } = handleItemIndex();
    cref.current?.initialDropdown && cref.current?.initialDropdown(start, end, height ?? getAllHeight());
  }

  // 滚动监听事件
  const onScroll = () => {
    shouldRefreshDropdown() && refreshDropdown();
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
    if(!scrollDropdown) return;
    scrollDropdown.removeEventListener("scroll", onScroll, false);
  }

  // 下拉菜单展开/收起 回调
  const onDropdownVisibleChange = (visible: boolean) => {
    const { onDropdownVisibleChange: _onDropdownVisibleChange } = props;
    if (visible) {
      // 下拉菜单展开时，确保能够获取到元素并绑定监听事件
      if (!timer) {
        timer = setTimeout(() => addEvent(), 0);
      } else {
        refreshDropdown();
      }
    }
    _onDropdownVisibleChange && _onDropdownVisibleChange(visible);
  }

  // 自定义下拉菜单
  const renderDropdown = (menuNode: ReactNode, props: any) => {
    const { start, end } = handleItemIndex();
    return (
      <DropdownRender2 
        start={start}
        end={end}
        allHeight={getAllHeight()}
        itemHeight={ITEM_HEIGHT}
        menuNode={menuNode}
        ref={cref}
      />
    );
  }

  const onSearch = (value: string) => {
    const { onSearch: _onSearch, showSearch, filterOption } = props;
    let result: any = undefined;
    if(showSearch) {
      if(typeof filterOption === "function") {
        result = children?.filter((item: any) => filterOption(value, item));
      }
      if(!filterOption) {
        result = children?.filter((item: any) => customFilterOption(value, item));
      }
      console.log(!value ? undefined : result, '==*****')
      setFilterChildList(!value ? undefined : result);
      // refreshDropdown(result?.length * ITEM_HEIGHT || 100);
      onDropdownVisibleChange(true);
    }
    _onSearch && _onSearch(value);
  }

    // 在搜索重新计算下拉滚动条高度
    const onChange = (value: string, opt: any) => {
      const { showSearch, onChange: _onChange, autoClearSearchValue, mode } = props;
      const multipleModes: any =  ["multiple", "tags"];
      if (showSearch || multipleModes.includes(mode)) {
        // 搜索模式下选择后是否需要重置搜索状态
        if (autoClearSearchValue !== false) {
          setFilterChildList(undefined);
          refreshDropdown();
        }
      }
  
      // this.setState({ value });
      _onChange && _onChange(value, opt);
    };

  // 自定义过滤方法，默认大小写不匹配
  const customFilterOption = (value: string, option: any) => {
    const { optionFilterProp } = props;
    const customOptionFilterProp = optionFilterProp || "children";
    return `${option.props[customOptionFilterProp]}`?.includes(value);
  }

  const customDropdownStyle = Object.assign({}, dropdownStyle, {
    maxHeight: 256, 
    overflow: 'auto', 
  })

  return (
    <Select
      {...restProps}
      className={`VirtualSelect ${className}`}
      dropdownClassName={`VirtualSelect-dropdown ${dropdownClassName}`}
      onSearch={onSearch}
      dropdownStyle={customDropdownStyle}
      dropdownRender={renderDropdown}
      onDropdownVisibleChange={onDropdownVisibleChange}
    >
      {getChildList()}
    </Select>
  )
}

VirtualSelect.Option = Option;
VirtualSelect.OptGroup = OptGroup;

export default VirtualSelect;