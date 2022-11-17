import React from "react";
import McTreeSelect from "..";

const McTreeNode = McTreeSelect.McTreeNode;

const McTreeSelectView = () => {
  const getNode = () => {
    const arr = Array.from(Array(500), (v,k) => k);
    return arr.map(i => (
      <McTreeNode key={`${i}`} value={`${i}`} title={`parent${i}`}>
        <McTreeNode key={`${i}-${i}`} value={`${i}-${i}`} title={`child${i}-${i}`} />
      </McTreeNode>
    ))
  }
  return (
    <div>
      <McTreeSelect
        showSearch
        showTotal
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
        {getNode()}
      </McTreeSelect>
    </div>
  );
};

export default McTreeSelectView;
