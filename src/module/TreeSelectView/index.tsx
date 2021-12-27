import React from "react";
import TreeSelect from './rcTreeSelect';
import './style/index.less';

// const { SHOW_PARENT, SHOW_CHILD, SHOW_ALL } = TreeSelect;

type TreeNodeValue = string | number | string[] | number[];

export interface TreeSelectViewProps{

}

interface TreeSelectViewState {
  value: string[];
}

const x = 20;
const y = 20;
const z = 1;
// 目前假定gData为全量数据
const gData: any = [];

const generateData = (_level: number, _preKey?: string, _tns?: any[]) => {
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

function clapTree(data: any ) {
  let dataList: any = [];
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    dataList.push(node);

    if (node.children) {
      dataList = [].concat(dataList, clapTree(node.children));
    }
  }
  return dataList;
}

console.log(clapTree(gData).length)
export default class TreeSelectView<T extends TreeNodeValue> extends React.Component<
  TreeSelectViewProps,
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
    if(treeNode?.title?.toUpperCase()?.includes(inputValue?.toUpperCase())) {
      return true;
    }
    return false;
  }
  render() {
    const tProps = {
      treeData: gData,
      treeDefaultExpandAll: true,
      onChange: this.onChange,
      treeCheckable: true,
      filterTreeNode: this.filterTreeNode,
      style: {
        width: '100%',
      },
    };
    return (
      <TreeSelect 
        {...tProps}
        showSearch
      />
    );
  }
}