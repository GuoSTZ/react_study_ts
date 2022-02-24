import React, { useEffect, useState } from 'react';

const useDropdownRender = (startIndex: number, endIndex: number, all: number, itemHeight: number) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [allHeight, setAllHeight] = useState(0);

  useEffect(() => {
    initialDropdown(startIndex, endIndex, all);
  }, [startIndex, endIndex, all]);

  // 初始化
  const initialDropdown = (start: number, end: number, allHeight: number) => {
    setStart(start);
    setEnd(end);
    setAllHeight(allHeight);
  }

  // 设定下拉菜单中选项的样式
  const handleItemStyle = (idx: number): any => {
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
          const index = start + idx;
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

  return [DropdownRender];
}

export default useDropdownRender;