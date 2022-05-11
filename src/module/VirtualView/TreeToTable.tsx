import React, { useEffect, useState, useLayoutEffect } from 'react';
import VirtualTree from './component/VirtualTree';
import './TreeToTable.less'

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const initTreeData: DataNode[] = [
  { title: 'Expand to load', key: '0' },
  // { title: 'Expand to load', key: '1' },
  // { title: 'Tree Node', key: '2', isLeaf: true },
  // { title: 'Expand to load', key: '0', children: [
  //   { title: 'childNode', key: '0-1' },
  // ]},
];

const getChildNodes = (key: number, count: number) => {
  const arr = Array.from(Array(count), (v,k) =>k);
  const list = arr.map((item: number) => ({
    title: 'Child Node', key: `${key}-${item}`
  }))
  return list;
}

const TreeToTable: React.FC<any> = props => {
  const [treeData, setTreeData] = useState([] as DataNode[]);

  useLayoutEffect(() => {
    setTreeData(initTreeData);
  }, [initTreeData])

  const dig = (path = '0', level = 2) => {
    const list = [];
    for (let i = 0; i < 10; i += 1) {
      const key = `${path}-${i}`;
      const treeNode: any = {
        title: key,
        key,
      };

      if (level > 0) {
        treeNode.children = dig(key, level - 1);
      }

      list.push(treeNode);
    }
    return list;
  }

  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map(node => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  }

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData(origin =>
          updateTreeData(origin, key, getChildNodes(key, 5)),
        );
        resolve();
      }, 1000);
    });

  return (
    <VirtualTree
      className='McVirtual-Tree'
      treeData={dig()}
      height={233}
      checkable
      showLine
      switcherIcon={ <span className={"row-expand-icon"} /> }
      // loadData={onLoadData}
    />
  )
}

export default TreeToTable;