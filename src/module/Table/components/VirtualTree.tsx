import React from 'react';
import { Tree, Checkbox, Icon } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import './index.less';

export interface VirtualTreeProps extends TreeProps {
  /**
   * 树结构数组
   */
  // dataSource: any[];
}

interface VirtualTreeState {
  /**
   * 树结构数组拍平后的数组
   */
  dataSource: any[];
  /**
   * 树节点高度
   */
  itemHeight: number;
  /**
   * 渲染节点从树结构数组中截取的起点
   */
  sliceStart: number;
  /**
   * 可视数据
   */
  visibleData: any[];
  /**
   * 可视数据的条数
   */
  visibleCount: number;
  /**
   * 偏移量
   */
  offset: number;
}

const x = 100;
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

export default class VirtualTree extends React.Component<
  VirtualTreeProps,
  VirtualTreeState
> {
  treeRef = React.createRef();
  state = {
    dataSource: [],
    itemHeight: 32,
    sliceStart: 0,
    visibleData: [],
    visibleCount: 10,
    offset: 0
  }

  componentDidMount() {
    this.setState({
      dataSource: this.clapTree(gData, 1)
    });
  }

  // 拍平树结构数据，添加parentKey、childrenKey、tLevel、visible、expand
  clapTree(data: any, level: number, parentKey?: string, ) {
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
        dataList = [].concat(dataList, this.clapTree(node.children, ++tLevel, key));
      }
    }
    return dataList;
  }

  // 截取数据
  sliceData(dataSource: any[], start: number) {
    const { visibleCount } = this.state;
    const res = [];
    const data = dataSource?.filter((item: any) => item.visible);
    for(let i=start; i< data?.length; i++) {
      if(res?.length >= visibleCount) {
        break;
      }
      if(data[i].visible) {
        console.log(i, data[i])
        res.push(data[i]);
      }
    }
    return res;
  }
  
  // 展开节点和折叠节点的回调
  handleClick(key: string, e: any) {
    const { dataSource } = this.state;
    // 展开节点
    if(Array.from(e?.currentTarget.classList)?.includes("switcher-close")) {
      e?.currentTarget.classList.remove("switcher-close");
      e?.currentTarget.classList.add("switcher-open");
      let res = dataSource?.map((item: any) => {
        if(item.parentKey === key) {
          return Object.assign({}, item, {visible: true});
        } else if(item.key === key){
          return Object.assign({}, item, {expand: true});
        } else {
          return item;
        }
      });
      this.setState({
        dataSource: res
      });
    } 
    // 折叠节点
    else if(Array.from(e?.currentTarget.classList)?.includes("switcher-open")) {
      e?.currentTarget.classList.remove("switcher-open");
      e?.currentTarget.classList.add("switcher-close");
      let res = dataSource?.map((item: any) => {
        if(item.parentKey === key) {
          return Object.assign({}, item, {visible: false});
        } else if(item.key === key){
          return Object.assign({}, item, {expand: false});
        } else {
          return item;
        }
      });
      this.setState({
        dataSource: res
      });
    }
  }

  // 监听滚动事件
  handleScroll(e: any) {
    const { itemHeight } = this.state;
    let scrollTop = e?.target?.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    this.setState({
      offset: start * itemHeight,
      sliceStart: start
    })
  }

  render() {
    const {...otherProps} = this.props;
    const { dataSource, sliceStart, itemHeight, offset } = this.state;
    const treeLength = dataSource?.filter((item: any) => item.visible)?.length;
    return (
      <div 
        className="VirtualTreeContainer" 
        onScroll={this.handleScroll.bind(this)}
        ref={(ref: any) => this.treeRef = ref}>
        <div className="VirtualTreeContainer-box" style={{height: treeLength * itemHeight}}></div>
        <div className="VirtualTreeContainer-content" style={{transform: `translateY(${offset}px)`}}>
          <ul>
            {
              this.sliceData(dataSource, sliceStart)?.map((item: any) => {
                return (
                  <li key={item.key} className={`level${item.tLevel} ${item.visible ? 'visible' : 'invisible'}`}>
                    {
                      item?.childrenKey?.length > 0 ? (
                        <span id={item.key} className={`switcher switcher-close`} onClick={this.handleClick.bind(this, item.key)}>
                          <Icon type="caret-down" />
                        </span>
                      ) : (
                        <span id={item.key} className={`switcher`}>
                        </span>
                      )
                    }
                    <Checkbox indeterminate={false} value={item.key}>{item.title}</Checkbox>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}