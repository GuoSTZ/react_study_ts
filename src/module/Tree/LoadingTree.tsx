import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default class LoadingTree extends React.Component {
  state = {
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  };

  onLoadData = (treeNode: any): any =>
    new Promise((resolve: any) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        console.log(this.state.treeData, '===***')
        // this.setState({
        //   treeData: [...this.state.treeData],
        // }, () => {
        //   console.log(this.state.treeData, '====')
        // });
        resolve();
      }, 1000);
    });

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
    return <Tree loadData={this.onLoadData}>{this.renderTreeNodes(this.state.treeData)}</Tree>;
  }
}
