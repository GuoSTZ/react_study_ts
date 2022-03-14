import React from "react";
import { MULTIPLEMODES, checkAll_fixed } from "./VirtualSelect_class";

export interface DropdownRenderProps {
  /** 数据截取起始位置 */
  start: number;
  /** 数据截取结束位置 */
  end: number;
  /** 总高度 */
  allHeight: number;
  /** 子项高度 */
  itemHeight: number;
  /** 原始下拉菜单节点 */
  menuNode: any;
  /** 是否选中【全部】 */
  isCheckAll?: boolean;
  /** 下拉框模式 */
  mode?: string;
}
export default class DropdownRender_class extends React.Component<DropdownRenderProps, any> {
  constructor(props: DropdownRenderProps) {
    super(props);
    const { start, end, allHeight } = props;
    this.state = {
      start,
      end,
      allHeight
    }
    this.initialDropdown = this.initialDropdown.bind(this)
  }

  // 设定下拉菜单中选项的样式
  handleItemStyle(idx: number): any {
    const { itemHeight } = this.props;
    return {
      position: "absolute",
      top: itemHeight * idx,
      height: itemHeight,
      width: "100%",
      lineHeight: `${itemHeight - 2 * 5}px`
    };
  }

  initialDropdown(start: number, end: number, allHeight: number, callback: any) {
    this.setState({
      start,
      end,
      allHeight
    }, () => {
      callback && callback();
    });
  }

  handleMenuItems(menuNode: any) {
    const { start, end } = this.state;
    const { isCheckAll } = this.props;
    const new_menuItems: any = [];
    menuNode?.props?.menuItems
      .slice(start, end)
      .map((item: any, idx: number) => {
        const index = start + idx;
        const style = this.handleItemStyle(index);
        // 为空时
        if (item.key === "NOT_FOUND") {
          delete style.height;
        }
        new_menuItems.push(
          React.cloneElement(item, {
            style: { ...item.style, ...style },
            disabled: isCheckAll || item.key === "NOT_FOUND",
          })
        )
      });
    return new_menuItems;
  }

  calcMarginTop(menuItems: any) {
    const { mode } = this.props;
    const isMultiple = MULTIPLEMODES.includes(mode);
    // 多选且【全部】选项固定
    if(isMultiple && checkAll_fixed) {
      // 下拉菜单有数据
      if(menuItems[0]?.key !== "NOT_FOUND") {
        return 32;
      }
    }
    return 0;
  }

  render(): React.ReactNode {
    const { menuNode } = this.props;
    const { allHeight } = this.state;
    const menuItems = this.handleMenuItems(menuNode);
    return React.cloneElement(menuNode, {
      menuItems: menuItems,
      dropdownMenuStyle: {
        ...menuNode?.props?.dropdownMenuStyle,
        position: 'relative',
        height: allHeight,
        marginTop: this.calcMarginTop(menuItems),
        maxHeight: allHeight,
        overflow: "hidden"
      }
    })
  }
}