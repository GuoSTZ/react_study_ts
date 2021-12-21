import React from "react";
// import  TreeSelect  from './virtualTree';
import { TreeSelectProps } from "antd/lib/tree-select";
import RcTreeSelect, {
  TreeNode,
  SHOW_ALL,
  SHOW_PARENT,
  SHOW_CHILD,
  TreeSelectProps as RcTreeSelectProps,
} from 'rc-tree-select';
import TreeSelect from './rcTreeSelect';
import './style/index.less';

// const { SHOW_PARENT, SHOW_CHILD, SHOW_ALL } = TreeSelect;

type TreeNodeValue = string | number | string[] | number[];

export interface TreeSelectViewProps<T extends TreeNodeValue> extends RcTreeSelectProps<T> {

}

interface TreeSelectViewState {
  value: string[];
}

const x = 16;
const y = 20;
const z = 1;
// 目前假定gData为全量数据
const gData: any = [];

const generateData = (_level: number, _preKey?: string, _tns?: any) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

function clapTree(data: any, level: number, parentKey?: string, ) {
  let dataList: any = [];
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    // 保存子节点的key
    let childrenKey = node?.children?.map((item: any) => item.key);
    // 区分每个节点的层级
    let tLevel = !parentKey ? 1 : level;
    dataList.push({ 
      key, 
      title: key, 
      parentKey, 
      childrenKey, 
      tLevel, 
      visible: !parentKey,
      expand: false
    });

    if (node.children) {
      dataList = [].concat(dataList, clapTree(node.children, ++tLevel, key));
    }
  }
  return dataList;
}

console.log(clapTree(gData, 1).length)

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
      treeData: gData,
      treeDefaultExpandAll: true,
      onChange: this.onChange,
      // treeCheckable: true,
      // showCheckedStrategy: SHOW_CHILD,
      searchPlaceholder: 'Please select',
      // filterTreeNode: this.filterTreeNode,
      style: {
        width: '100%',
      },
    };
    return (
      <TreeSelect 
        {...tProps}
      />
    );
  }
}