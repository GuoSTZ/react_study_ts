import React, { useRef, useState } from 'react';
import { Tree, Input, Button } from 'antd';
import { useInView } from "react-intersection-observer";
import './index.less';

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

const x = 25;
const y = 1;
const z = 1;
const gData: any[] = [];

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

const dataList: any = [];
// 拍平数据
const generateList = (data: any[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

// 拍平数据
const clapTree = (data: any) => {
  let dataList: any = [];
  data?.map((item: any) => {
    dataList.push(item);
    if (item.children) {
      dataList = [].concat(dataList, clapTree(item.children));
    }
  })
  return dataList;
}

// console.log(clapTree(gData))

const getParentKey = (key: string, tree: any) => {
  let parentKey: any;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const IOTreeView = (props: any) => {
  const [expandedKeys, setExpandedKeys] = useState([] as string[]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const { ref, inView, entry } = useInView();
  const treeRef = useRef({} as any);
  console.log(inView, entry, '===')

  const onExpand = (expandedKeys: any, e: any) => {
    console.log(e.node.props.dataRef?.children, '===')
    e.node.props.dataRef?.children.push(
      {key: '0-0-100', title: '0-0-100'},
    );
    console.log(e.node.props.dataRef?.children, '===***')
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: any) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: any[]) =>
    data.map((item: any, idx: number) => {
      console.log(item, idx, '===')

      // const index = item.title.indexOf(searchValue);
      // const beforeStr = item.title.substr(0, index);
      // const afterStr = item.title.substr(index + searchValue.length);
      // const title =
      //   index > -1 ? (
      //     <span>
      //       {beforeStr}
      //       <span style={{ color: '#f50', fontWeight: 500 }}>{searchValue}</span>
      //       {afterStr}
      //     </span>
      //   ) : (
      //     <span>{item.title}</span>
      //   );
      if (item.children) {
        return (
          <TreeNode key={item.key} title={item.title} dataRef={item}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={<span ref={idx % 10 === 0 ? ref : undefined}>{item.title}</span>} />;
    });

  // console.log(treeRef, inView, '===')
  // if (treeRef?.current) {
  //   treeRef.current?.props?.children?.push(
  //     <TreeNode key={'0-100'} title={<span>{'0-100'}</span>} />,
  //     <TreeNode key={'0-101'} title={<span>{'0-101'}</span>} />,
  //   );
  //   console.log(treeRef.current?.props?.children, expandedKeys)
  //   if(expandedKeys.length === 0) {
  //     setExpandedKeys(["0"]);
  //   }
  // }

  // if(inView) {
  //   treeNode.props.dataRef.children.push([
  //     { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
  //     { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
  //   ])
  //   setExpandedKeys([].concat(expandedKeys, treeNode.props?.eventKey))
  // }
  return (
    <div className='intersectionObserverTree'>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Button onClick={() => {
        console.log(treeRef)
        treeRef.current?.props?.children?.push(
          <TreeNode key={'0-100'} title={<span>{'0-100'}</span>} />,
          <TreeNode key={'0-101'} title={<span>{'0-101'}</span>} />,
        );
        setExpandedKeys([])
        return new Promise((resolve: any) => {
          resolve();
        })
      }}>点击</Button>
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        ref={treeRef}
        // loadData={(node: any) => {
        //   return new Promise(resolve => {
        //     resolve();
        //   })
        // }}
      >
        {loop(gData)}
      </Tree>
    </div>
  )
}

export default IOTreeView;