import React from "react";
import McTreeSelect from "..";

const McTreeSelectView = () => {
  const getData = () => {
    const treeData = [];
    for (let i = 0; i < 50000; i++) {
      treeData.push({
        title: `Node${i}`,
        value: `0-${i}`,
      });
    }

    return treeData;
  };
  return (
    <div>
      <McTreeSelect
        showTotal
        open
        defaultValue={'0-1'}
        style={{ width: 400 }}
        treeData={getData()}
        placeholder="请输入"
      />
      <McTreeSelect
        showTotal
        open
        multiple
        style={{ width: 400 }}
        treeData={getData()}
        placeholder="请输入"
      />
    </div>
  );
};

export default McTreeSelectView;
