import React, { useEffect } from 'react';
import {Tree, TreeProps, Button} from 'antd';
import type { DataNode } from 'antd/es/tree';
import styles from './index.module.less';

interface Props {

}

export default (props: Props) => {
  const treeMap = new Map();
  const dig = (path = '0', level = 2) => {
    const list = [];
    for (let i = 0; i < 2; i += 1) {
      const key = `${path}-${i}`;
      const treeNode: DataNode = {
        title: key,
        key,
      };
  
      if (level > 0) {
        treeNode.children = dig(key, level - 1);
      }
  
      list.push(treeNode);
    }
    return list;
  };
  const treeData = dig();

  const loop = (data: any[]) => {
    data.map((item: any) => {
      treeMap.set(item.key, item);
      if(item.children) loop(item.children);
    })
  }

  useEffect(() => {
    loop(treeData);
  }, [])

  const onCheck = (checked: any, info: any) => {
    console.log(checked, info, '=====checkedKeys', treeData)
    // info?.node?.map((key: string) => {
    //   const node = treeMap.get(key);
    //   node.selected = info?.checked;
    // })
    // info?.halfCheckedKeys?.map((key: string) => {
    //   const node = treeMap.get(key);
    //   node.selected = true;
    // })
  }
  return (
    <div className={styles.TreeComponent}>
      <div className={styles.tree}>
        <Tree 
          checkable
          selectable={false}
          treeData={treeData} 
          height={400}
          onCheck={onCheck}
        />
      </div>
      <div className={styles.btns}>
        <Button>向右</Button>
        <Button>向左</Button>
      </div>
      <div className={styles.tree}><Tree treeData={treeData} height={400}/></div>
    </div>
  )
}