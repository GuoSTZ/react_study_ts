import React from "react";
import { TreeSelect } from 'antd';
import { TreeSelectProps } from "antd/lib/tree-select";

const { SHOW_PARENT, SHOW_CHILD, SHOW_ALL } = TreeSelect;

type TreeNodeValue = string | number | string[] | number[];

export interface TreeSelectViewProps<T extends TreeNodeValue> extends TreeSelectProps<T> {

}

interface TreeSelectViewState {
  value: string[];
}

export default class TreeSelectView<T extends TreeNodeValue> extends React.Component<
  TreeSelectViewProps<T>,
  TreeSelectViewState
> {
  state = {
    value: [],
  };
  onChange = (value: string[]) => {
    console.log('onChange ', value);
    this.setState({ value });
  };
  filterTreeNode(inputValue: string, treeNode: any) {
    if(treeNode?.props?.title?.toUpperCase()?.includes(inputValue?.toUpperCase())) {
      return true;
    }
    return false;
  }
  render() {
    const treeData = [
      {
        title: '全部',
        value: '0',
        key: '0',
      },
      {
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
          {
            title: 'Child Node1',
            value: '0-0-0',
            key: '0-0-0',
          },
        ],
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
          {
            title: 'Child Node3',
            value: '0-1-0',
            key: '0-1-0',
          },
          {
            title: 'Child Node4',
            value: '0-1-1',
            key: '0-1-1',
          },
          {
            title: 'Child Node5',
            value: '0-1-2',
            key: '0-1-2',
          },
        ],
      },
    ];
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_CHILD,
      searchPlaceholder: 'Please select',
      filterTreeNode: this.filterTreeNode,
      style: {
        width: '100%',
      },
    };
    return <TreeSelect {...tProps} />;
  }
}