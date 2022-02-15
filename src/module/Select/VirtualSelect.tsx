import React, { PropsWithChildren, Children } from 'react';
import { Select } from 'antd';
import { SelectProps, OptionProps } from 'antd/lib/select';

export interface VirtualSelectProps extends SelectProps {

}

const Option = Select.Option;
const OptGroup = Select.OptGroup;

const itemHeight = 32;

const VirtualSelect = (props: PropsWithChildren<VirtualSelectProps>) => {
  console.log(props.children)
  const handleScroll = (e: any) => {
    const { target } = e;
    // scrollHeight：代表包括当前不可见部分的元素的高度
    // scrollTop：代表当有滚动条时滚动条向下滚动的距离，也就是元素顶部被遮住的高度
    // clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度
    const rmHeight = target.scrollHeight - target.scrollTop;
    const clHeight = target.clientHeight;
    console.log(rmHeight, clHeight, target.clientTop)
  }
  return (
    // @ts-ignore
    <Select {...props} onPopupScroll={handleScroll}>
      {
        // @ts-ignore 
        Children?.map(props?.children, (child: any) => {
          // console.log(child, "===", child?.type === Option);
          return child;
        })
      }
    </Select>
  )
}

VirtualSelect.Option = Option;
VirtualSelect.OptGroup = OptGroup;

export default VirtualSelect;