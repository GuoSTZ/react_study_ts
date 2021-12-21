import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

const x = 15;
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

export default class TreeView extends React.Component {
  state = { };

  renderTreeNodes = (data: any) =>
    data.map((item: any) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  render() {
    return <Tree defaultExpandAll>{this.renderTreeNodes(gData)}</Tree>;
  }
}
