import React, { ReactNode, useEffect, useState } from 'react';

const DropdownRender = (props: any) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [allHeight, setAllHeight] = useState(100);

  useEffect(() => {
    console.log(props.start, props.end, props.allHeight, '===')
    initialDropdown(props.start, props.end, props.allHeight);
  }, [props.start, props.end, props.allHeight]);

  // 初始化
  const initialDropdown = (start: number, end: number, allHeight: number) => {
    setStart(start);
    setEnd(end);
    setAllHeight(allHeight);
  }

  // 设定下拉菜单中选项的样式
  const handleItemStyle = (idx: number) => {
    const { itemHeight } = props;
    return {
      position: "absolute",
      top: itemHeight * idx,
      height: itemHeight,
      width: "100%"
    };
  }

  const DropdownRender = (menuNode: any, props: any) => {
    return React.cloneElement(menuNode, {
      menuItems: menuNode.props.menuItems
        .slice(start, end)
        .map((item: any, idx: number) => {
          const index = (start || 0) + Number(idx);
          const style = handleItemStyle(index);

          // 未搜到数据提示高度使用默认高度
          if (item.key === "NOT_FOUND") {
            delete style.height;
          }
          return React.cloneElement(item, {
            style: { ...item.style, ...style }
          });
        }),
      dropdownMenuStyle: {
        ...menuNode.props.dropdownMenuStyle,
        height: allHeight,
        maxHeight: allHeight,
        overflow: "hidden"
      }
    })
  };
}

export default DropdownRender;