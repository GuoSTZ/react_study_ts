import React, { useEffect, useMemo, useState } from 'react';
import {Tree, TreeProps, TreeNodeProps, Button} from 'antd';
import type { DataNode } from 'antd/es/tree';
import styles from './index.module.less';

interface Props {

}

type Key = string|number;

interface TreeDataNode extends DataNode {
  pKey?: Key;
}

// const treeMap = new Map();
// mock 数据
const dig = (path = '0', level = 2) => {
  const list = [];
  for (let i = 0; i < 15; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: DataNode = {
      title: key,
      key,
      className: styles.hidden
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
};
const treeData = dig();

export default (props: Props) => {
  const [treeShowData, setTreeShowData] = useState([] as TreeDataNode[])

  // 遍历树数据
  const loop = (data: TreeDataNode[], map: Map<Key, TreeDataNode>, pKey?: Key) => {
    data.map((item: TreeDataNode) => {
      map.set(item.key, item);
      // 记录父节点key值
      pKey && (item.pKey = pKey)
      if(item.children) loop(item.children, map, item.key);
    })
  }

  const loop2 = (data: TreeDataNode[], map: Map<Key, TreeDataNode>, checked: boolean) => {
    data.map((item: TreeDataNode) => {
      const node = map.get(item.key)!;
      node.className = checked ? styles.show : styles.hidden;
      if(item.children) loop2(item.children, map, checked)
    })
  }

  const loop3 = (data: TreeDataNode, map: Map<Key, TreeDataNode>, checkedKeys: Key[], halfCheckedKeys: Key[]) => {
    const pKey: Key|undefined = data?.pKey;
    if(pKey) {
      const node = map.get(pKey);
      !checkedKeys.includes(pKey) &&
        !halfCheckedKeys.includes(pKey) &&
          (map.get(pKey)!.className = styles.hidden);
      if(node?.pKey) loop3(node, map, checkedKeys, halfCheckedKeys)
    }
  }

  const [treeMap] = useMemo(() => {
    const treeMap = new Map<Key, TreeDataNode>();
    loop(treeData, treeMap);
    return [treeMap];
  }, [treeData])

  const onCheck = (checked: any, info: any) => {
    // 点击选中时
    if(info?.checked) {
      loop2([info.node], treeMap, info?.checked);
      info?.halfCheckedKeys?.map((key: Key) => {
        const node = treeMap.get(key)!;
        node.className = styles.show;
      })
    } else {
      loop2([info.node], treeMap, info?.checked);
      loop3(info.node, treeMap, checked, info?.halfCheckedKeys);
    }
    // 本不该这么写的，只是为了做强制刷新，建议优化
    setTreeShowData([])
  }

  return (
    <div className={styles.TreeComponent}>
      <div className={styles.tree}>
        <span>共 {treeMap.size} 条</span>
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
        {/* <Button>向右</Button>
        <Button>向左</Button> */}
      </div>
      <div className={styles.treeShow}>
        <Tree 
          treeData={[...treeData]} 
          height={400}
          defaultExpandAll
        />
      </div>
    </div>
  )
}