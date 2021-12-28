import React from "react";
import TreeSelect from './rcTreeSelect';

// const { SHOW_PARENT, SHOW_CHILD, SHOW_ALL } = TreeSelect;

type TreeNodeValue = string | number | string[] | number[];

const { TreeNode } = TreeSelect;
const { SHOW_PARENT } = TreeSelect;

export interface TreeSelectViewProps {

}

interface TreeSelectViewState {
  value?: any;
}

export default class TreeSelectView<T extends TreeNodeValue> extends React.Component<
  TreeSelectViewProps,
  TreeSelectViewState
> {
  state = {
    value: ['sss'],
  };

  onChange = (value: any) => {
    console.log(value);
    this.setState({ value });
  };
  render() {
    return (
      <TreeSelect
        showSearch
        style={{ width: '100%' }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        multiple
        treeDefaultExpandAll
        onChange={this.onChange}
        maxTagCount={3}
        maxTagPlaceholder={(omittedValues: any) => "隐藏更多..."}
        // treeLine
        treeCheckable
        treeCheckStrictly
        onSearch={(value: any) => console.log(value)}
        onSelect={(value: any) => console.log(value)}
        onTreeExpand={(value: any) => console.log(value)}
        treeNodeFilterProp="title"
      >
        <TreeNode value="parent 1" title="parent 1" key="0-1">
          <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
            <TreeNode value="leaf1" title="my leaf" key="random" />
            <TreeNode value="leaf2" title="your leaf" key="random1" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
            <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} key="random3" />
          </TreeNode>
        </TreeNode>
        <TreeNode value="parent 2" title="parent 2" key="0-2">
          <TreeNode value="parent 2-0" title="parent 2-0" key="0-2-1">
            <TreeNode value="leaf-a" title="my leaf-a" key="random-a" />
            <TreeNode value="leaf-b" title="your leaf-b" key="random-b" />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
    );
  }

}