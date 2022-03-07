import React from "react";

export interface DropdownRenderProps {
  start: number;
  end: number;
  allHeight: number;
  itemHeight: number;
  menuNode: any;
  isCheckAll?: boolean;
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
            disabled: isCheckAll,
          })
        )
      });
    return new_menuItems;
  }

  render(): React.ReactNode {
    const { menuNode } = this.props;
    const { allHeight } = this.state;
    return React.cloneElement(menuNode, {
      menuItems: this.handleMenuItems(menuNode),
      dropdownMenuStyle: {
        ...menuNode?.props?.dropdownMenuStyle,
        position: 'relative',
        height: allHeight,
        maxHeight: allHeight,
        overflow: "hidden"
      }
    })
  }
}