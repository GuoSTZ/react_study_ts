import React, { useEffect, useMemo, useState } from 'react';
import { Tree, TreeProps, TreeNodeProps, Button } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.less';

interface Props {

}

type Key = string | number;

interface TreeDataNode extends DataNode {
  pKey?: Key;
  renderable: boolean;
  children?: TreeDataNode[];
}

const mockData = (path: number) => {
  const list = [];
  for (let i = 0; i < 2; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: TreeDataNode = {
      title: key,
      key,
      renderable: false
    };
    list.push(treeNode);
  }
  return list;
}
const treeData = [
  {
    title: 'title1',
    key: '0',
    renderable: false,
    children: mockData(0)
  },
  {
    title: 'title2',
    key: '1',
    renderable: false,
    children: mockData(1)
  },
  {
    title: 'title3',
    key: '2',
    renderable: false,
    children: mockData(2)
  }
]

export default (props: Props) => {
  const [treeShowData, setTreeShowData] = useState([] as TreeDataNode[])

  // 遍历树数据
  const loop = (data: TreeDataNode[], map: Map<Key, TreeDataNode>, pKey?: Key) => {
    data.map((item: TreeDataNode) => {
      map.set(item.key, item);
      // 记录父节点key值
      pKey && (item.pKey = pKey)
      if (item.children) loop(item.children, map, item.key);
    })
  }

  const loop2 = (data: TreeDataNode[], map: Map<Key, TreeDataNode>, checked: boolean) => {
    data.map((item: TreeDataNode) => {
      const node = map.get(item.key)!;
      node.renderable = checked;
      if (item.children) loop2(item.children, map, checked)
    })
  }

  const loop3 = (data: TreeDataNode, map: Map<Key, TreeDataNode>, checkedKeys: Key[], halfCheckedKeys: Key[]) => {
    const pKey: Key | undefined = data?.pKey;
    if (pKey) {
      const node = map.get(pKey);
      !checkedKeys.includes(pKey) &&
        !halfCheckedKeys.includes(pKey) &&
        (map.get(pKey)!.renderable = false);
      if (node?.pKey) loop3(node, map, checkedKeys, halfCheckedKeys)
    }
  }

  const [treeMap] = useMemo(() => {
    const treeMap = new Map<Key, TreeDataNode>();
    loop(treeData, treeMap);
    return [treeMap];
  }, [treeData])

  const onCheck = (checked: any, info: any) => {
    // 点击选中时
    if (info?.checked) {
      loop2([info.node], treeMap, info?.checked);
      info?.halfCheckedKeys?.map((key: Key) => {
        const node = treeMap.get(key)!;
        node.renderable = true;
      })
    } else {
      loop2([info.node], treeMap, info?.checked);
      loop3(info.node, treeMap, checked, info?.halfCheckedKeys);
    }
    // 本不该这么写的，只是为了做强制刷新，建议优化
    setTreeShowData([])
  }

  const renderTreeNodes = (data: TreeDataNode[]) =>
    data.map(item => {
      if (!item.renderable) {
        return null;
      }
      if (item.children) {
        return (
          <Tree.TreeNode title={item.title} key={item.key}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode {...item} />;
    });

  const cloneNodes = (data: TreeDataNode[]) => {
    const list: TreeDataNode[] = [];
    const len = data.length;
    for(let i=0; i<len; i++) {
      if(!data[i].renderable) {
        continue;
      }
      const item: TreeDataNode = Object.assign({}, data[i], {children: null});
      if(data[i].children) {
        item.children = cloneNodes(data[i].children!);
      }
      list.push(item);
    }
    return list;
  }


  return (
    <div className={styles.TreeComponent}>
      <div className={styles.tree}>
        <span>左侧树共 {treeMap.size} 条</span>
        <Tree
          checkable
          selectable={false}
          treeData={treeData}
          height={400}
          onCheck={onCheck}
          defaultExpandAll
        />
      </div>

      <div className={styles.btns}>
      </div>

      <div className={styles.treeShow}>
        <span>共 xxx 条</span>
        <Tree
          treeData={cloneNodes(treeData)}
          height={400}
          key={Math.random() * 100}
          defaultExpandAll
          selectable={false}
          titleRender={(nodeData: any) => {
            return (
              <div>
                {nodeData.title} 
                <DeleteOutlined onClick={() => {
                  const node = treeMap.get(nodeData.key)!;
                  node.renderable = false;
                  // 本不该这么写的，只是为了做强制刷新，建议优化
                  setTreeShowData([])
                }}/> 
              </div>
            )
          }}
        >
          {/* {renderTreeNodes(treeData)} */}
        </Tree>
      </div>
    </div>
  )
}