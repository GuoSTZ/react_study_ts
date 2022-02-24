import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const DropdownRender = forwardRef((props: any, ref: any) => {
  const {
    allHeight: _allHeight,
    start: _start,
    end: _end,
    itemHeight,
    menuNode
  } = props;
  const [allHeight, setAllHeight] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    initialDropdown(_start, _end, _allHeight)
  }, [ _start, _end, _allHeight]);

  // 设定下拉菜单中选项的样式
  const handleItemStyle = (idx: number): any => {
    return {
      position: "absolute",
      top: itemHeight * idx,
      height: itemHeight,
      width: "100%"
    };
  }

  const initialDropdown = (start: number, end: number, allHeight: number) => {
    setStart(start);
    setEnd(end);
    setAllHeight(allHeight);
  }

  useImperativeHandle(ref, () => ({
    initialDropdown
  }))

  return React.cloneElement(menuNode, {
    menuItems: menuNode?.props?.menuItems
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
      ...menuNode?.props?.dropdownMenuStyle,
      position: 'relative',
      height: allHeight,
      maxHeight: allHeight,
      overflow: "hidden"
    }
  })
});

export default DropdownRender;