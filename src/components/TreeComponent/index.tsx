import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Tree, TreeProps, TreeNodeProps, Button, Checkbox, Input } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.less';

interface LeftTreeProps extends TreeProps {

}

interface RigthTreeProps extends TreeProps {

}

interface Props {
  showSearch?: boolean;
  // leftTreeProps?: LeftTreeProps;
  // rigthTreeProps?: RigthTreeProps;
}

interface TreeDataNode extends DataNode {
  pKey?: React.Key;
  renderable: boolean;
  children?: TreeDataNode[];
}

const mockData = (path: number) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
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

const checkedKeysSet = new Set(); // 仅用作记录当前哪些树节点被手动选中，用于快速判定该树节点是否被手动选中
const halfCheckedKeysSet = new Set(); // 仅用作记录当前哪些树节点被半选中，用于快速判定该树节点是否被半选中
const TREE_HEIGHT = 281; // 树高，配合虚拟滚动
const CHECK_ALL_HEIGHT = 28; // “全部”选项的高度
const COUNT_TEXT_HEIGHT = 22; // 条数文字高度
const SEARCH_HEIGHT = 32; // 搜索框的高度

export default (props: Props) => {
  const { showSearch } = props;
  const [treeShowData, setTreeShowData] = useState([] as TreeDataNode[])
  const [checkedKeys, setCheckedKeys] = useState([] as React.Key[]);
  const [checkAll, setCheckAll] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const loop2 = (data: TreeDataNode[], map: Map<React.Key, TreeDataNode>, checked: boolean) => {
    data.map(item => {
      const node = map.get(item.key)!;
      node.renderable = checked;
      if(checked) {
        checkedKeysSet.add(item.key);
      } else {
        checkedKeysSet.delete(item.key);
      }
      if (item.children) loop2(item.children, map, checked)
    })
  }

  const loop3 = (data: TreeDataNode, map: Map<React.Key, TreeDataNode>, checkedKeys: React.Key[], halfCheckedKeys: React.Key[]) => {
    const pKey: React.Key | undefined = data?.pKey;
    if (pKey) {
      const node = map.get(pKey);
      if(!checkedKeys.includes(pKey) && !halfCheckedKeys.includes(pKey)) {
        map.get(pKey)!.renderable = false;
        halfCheckedKeysSet.delete(pKey);
      }
      if (node?.pKey) loop3(node, map, checkedKeys, halfCheckedKeys)
    }
  }

  const [treeMap, treeKeys] = useMemo(() => {
    const treeMap = new Map<React.Key, TreeDataNode>();
    const treeKeys: React.Key[] = [];

    // 遍历树数据
    const loop = (data: TreeDataNode[], pKey?: React.Key) => {
      data.map(item => {
        treeMap.set(item.key, item);
        treeKeys.push(item.key);
        // 记录父节点key值
        pKey && (item.pKey = pKey)
        if (item.children) loop(item.children, item.key);
      })
    }
    loop(treeData);

    return [treeMap, treeKeys];
  }, [treeData])

  const onCheck = useCallback((checked: any, info: any) => {
    console.log(checked, info, '=======')
    if (info?.checked) {
      info?.halfCheckedKeys?.map((key: React.Key) => {
        const node = treeMap.get(key)!;
        node.renderable = true;
        halfCheckedKeysSet.add(key);
      })
    } else {
      loop3(info.node, treeMap, checked, info?.halfCheckedKeys);
    }
    // [info.node]替代checked，是为了避免已被选择的key的重复计算
    loop2([info.node], treeMap, info?.checked);
    setCheckedKeys(checked)
  }, [])

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

  const cloneNodes = useCallback((data: TreeDataNode[]) => {
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
  }, [])

  const onSearch = useCallback((e: any) => {
    const { value } = e.target;
    setSearchValue(value);
  }, [])

  const searchTreeData = (data: TreeDataNode[]) => {
    if(!searchValue) {
      return data;
    }
    const list: TreeDataNode[] = [];
    const len = data.length;
    for(let i=0; i<len; i++) {
      if((data[i].title as string).indexOf(searchValue) === -1 && !data[i].children) {
        continue;
      }
      const item: TreeDataNode = Object.assign({}, data[i], {children: null});
      if(data[i].children) {
        const result = searchTreeData(data[i].children!);
        if(result.length === 0) {
          continue;
        } else {
          item.children = result;
        }
      }
      list.push(item);
    }
    return list;
  }

  console.log(treeData, '====treeData')

  // 左侧树 checkedKeys 值
  const mergedLeftCheckedKeys = checkAll ? treeKeys : checkedKeys;
  // const mergedDisabled = checkAll ? checkAll : 

  // 右侧树高度设置
  const mergedRightTreeHeight = showSearch ? (SEARCH_HEIGHT + CHECK_ALL_HEIGHT + TREE_HEIGHT) : (CHECK_ALL_HEIGHT + TREE_HEIGHT)
  // 包裹树的div的高度设置
  const treeDivHeight = showSearch ? (COUNT_TEXT_HEIGHT + SEARCH_HEIGHT + CHECK_ALL_HEIGHT + TREE_HEIGHT) : (COUNT_TEXT_HEIGHT + CHECK_ALL_HEIGHT + TREE_HEIGHT)

  return (
    <div className={styles.TreeComponent}>
      <div className={styles.tree} style={{height: treeDivHeight}}>
        <span>共 {treeMap.size} 条</span>
        { showSearch && <Input onChange={onSearch} placeholder='请输入'/> }
        <div>
          <Checkbox className={styles.checkAll} style={{height: CHECK_ALL_HEIGHT}} onChange={(e: any) => {
            const checked = e.target.checked;
            setCheckAll(checked);
            if(checked) {
              treeKeys.forEach((item: React.Key) => {
                const node = treeMap.get(item)!;
                node.renderable = true;
              })
            } else {
              treeKeys.forEach((item: React.Key) => {
                const node = treeMap.get(item)!;
                if(!checkedKeysSet.has(item) && !halfCheckedKeysSet.has(item)) {
                  node.renderable = false;
                }
              })
            }
          }}>全部</Checkbox>
          <Tree
            checkable
            checkedKeys={mergedLeftCheckedKeys}
            disabled={checkAll}
            selectable={false}
            treeData={searchTreeData(treeData)}
            height={TREE_HEIGHT}
            onCheck={onCheck}
            defaultExpandAll
          />
        </div>
      </div>

      <div className={styles.btns}>
      </div>

      <div className={styles.treeShow} style={{height: treeDivHeight}}>
        <span>共 {checkAll ? treeMap.size : checkedKeysSet.size} 条</span>
        <Tree
          treeData={cloneNodes(treeData)}
          height={mergedRightTreeHeight}
          key={Math.random() * 100}
          defaultExpandAll
          selectable={false}
          // titleRender={(nodeData: any) => {
          //   return (
          //     <div>
          //       {nodeData.title} 
          //       <DeleteOutlined onClick={() => {
          //         const node = treeMap.get(nodeData.key)!;
          //         node.renderable = false;
          //         // 本不该这么写的，只是为了做强制刷新，建议优化
          //         setTreeShowData([])
          //       }}/> 
          //     </div>
          //   )
          // }}
        >
          {/* {renderTreeNodes(treeData)} */}
        </Tree>
      </div>
    </div>
  )
}