import React from "react";


export default class DropdownRender2 extends React.Component<any, any> {
  constructor(props: any) {
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
      width: "100%"
    };
  }

  initialDropdown(start: number, end: number, allHeight: number) {
    this.setState({
      start,
      end,
      allHeight
    });
  }

  render(): React.ReactNode {
    const { menuNode } = this.props;
    const { start, end, allHeight } = this.state;
    return React.cloneElement(menuNode, {
      menuItems: menuNode?.props?.menuItems
        .slice(start, end)
        .map((item: any, idx: number) => {
          const index = start + idx;
          const style = this.handleItemStyle(index);
  
          // 未搜到数据提示高度使用默认高度
          if (item.key === "NOT_FOUND") {
            delete style.height;
          }
          return React.cloneElement(item, {
            style: { ...item.style, ...style }
          });
        }),
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