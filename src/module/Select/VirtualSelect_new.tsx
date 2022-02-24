import React, { PropsWithChildren, Children, useState } from 'react';
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
  
  // const [DropdownRender] = useDropdownRender({
  //   start, 
  //   end, 
  //   allHeight: itemHeight * props.children.length, 
  //   itemHeight
  // });

  const handleScroll = (e: any) => {
    const { target } = e;
    // scrollHeight 表示当前所有元素的总高度 - 不会变化
    // scrollTop 表示下拉菜单滚动的高度 - 会变化，向下滚动会变大，向上滚动会变小，初始值为0
    // clientHeight 应该是下拉菜单可视部分的高度 - 不会变化
    // clientTop 0

    const rmHeight = target.scrollHeight - target.scrollTop;
    const clHeight = target.clientHeight;
    // 方案一： 每次滚动到底部时，加载新的10条数据，数据会不断累加变多
    // if(rmHeight === clHeight) {
    //   setEnd(end+ 10);
    // }

    const dropdown: any = document.querySelector(".VirtualSelect-dropdown");
    const dropdownDiv = document.querySelector(".VirtualSelect-dropdown > div");
    const ul = document.querySelector(".VirtualSelect-dropdown .ant-select-dropdown-menu");
    setScrollTop(target.scrollTop);
    // dropdownDiv.style?.height = 1000;


    console.log(target.scrollHeight, target.scrollTop, target.clientHeight, target.clientTop)
  }


  const dropdownDiv: any = document.querySelector(".VirtualSelect-dropdown > div");
  console.log(dropdownDiv)
  // dropdownDiv.addEventListener('scroll', () => {
  //   console.log(666)
  // })
  const dropdownRender = (menuNode: any, props: any) => {
    console.log(menuNode, '===')
    return (
      <div className='aaaaaaaaaaaaaaaaa' style={{maxHeight: 256, overflow: 'auto'}}>
        {
          React.cloneElement(menuNode, {
            className: "bbbb",
            style: {
              height: 16000
            }
          })
        }
      </div>
    )
  }
  console.log(scrollTop, '===')
  return (
    <Select 
      {...props} 
      onPopupScroll={handleScroll} 
      showSearch
      filterOption={(value: string, option: any) => option?.props?.children?.toUpperCase()?.includes(value?.toUpperCase())}
      className="VirtualSelect" 
      dropdownClassName="VirtualSelect-dropdown"
      dropdownMenuStyle={{height: 3200, maxHeight: 3200, transform: `translateY(${scrollTop}px)`}}
      // style={{maxHeight: 256}}
      dropdownStyle={{maxHeight: 256, overflow: 'auto'}}
      // dropdownRender={DropdownRender}
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