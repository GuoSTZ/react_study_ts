import React from "react";
import McTreeSelect from "..";

const McTreeNode = McTreeSelect.McTreeNode;

const McTreeSelectView = () => {
  const getData = () => {
    const treeData = [];
    for (let i = 0; i < 100; i++) {
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
        showSearch
        showTotal
        open
        style={{ width: 400 }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
      >
        <McTreeNode value="parent 1" title="parent 1">
          <McTreeNode value="parent 1-0" title="parent 1-0">
            <McTreeNode value="leaf1-0-1" title="leaf1-0-1" />
            <McTreeNode value="leaf1-0-2" title="leaf1-0-2" />
          </McTreeNode>
          <McTreeNode value="parent 1-1" title="parent 1-1">
            <McTreeNode
              value="leaf1-1-1"
              title={<b style={{ color: "#08c" }}>leaf1-1-1</b>}
            />
          </McTreeNode>
        </McTreeNode>
        <McTreeNode value="parent 2" title="parent 2">
          <McTreeNode value="parent 2-0" title="parent 2-0">
            <McTreeNode value="leaf2-0-1" title="leaf2-0-1" />
            <McTreeNode value="leaf2-0-2" title="leaf2-0-2" />
          </McTreeNode>
        </McTreeNode>
      </McTreeSelect>
      <McTreeSelect
        showSearch
        showTotal
        open
        multiple
        style={{ width: 400 }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
      >
        <McTreeNode value="parent 1" title="parent 1">
          <McTreeNode value="parent 1-0" title="parent 1-0">
            <McTreeNode value="leaf1-0-1" title="leaf1-0-1" />
            <McTreeNode value="leaf1-0-2" title="leaf1-0-2" />
          </McTreeNode>
          <McTreeNode value="parent 1-1" title="parent 1-1">
            <McTreeNode
              value="leaf1-1-1"
              title={<b style={{ color: "#08c" }}>leaf1-1-1</b>}
            />
          </McTreeNode>
        </McTreeNode>
        <McTreeNode value="parent 2" title="parent 2">
          <McTreeNode value="parent 2-0" title="parent 2-0">
            <McTreeNode value="leaf2-0-1" title="leaf2-0-1" />
            <McTreeNode value="leaf2-0-2" title="leaf2-0-2" />
          </McTreeNode>
        </McTreeNode>
      </McTreeSelect>
    </div>
  );
};

export default McTreeSelectView;
