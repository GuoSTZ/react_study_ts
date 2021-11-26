import React from 'react';
import { Tree, Input, Button } from 'antd';


const { TreeNode } = Tree;
const { Search } = Input;

interface DataSourceProps {
  title: string;
  key: string;
  children?: DataSourceProps;
}

export interface SearchTreeProps {
  /**
   * 数据源
   */
  dataSource?: DataSourceProps[];
  /**
   * 执行过滤条件 - 表格提供
   */
  confirm: Function;
  /**
   * 清除过滤条件 - 表格提供
   */
  clearFilters: Function;
  /**
   * 记录过滤条件 - 表格提供
   */
  setSelectedKeys: Function;
  /**
   * true - 显示确认和重置按钮，通过按钮来触发过滤操作
   * false - 不显示确认和重置按钮，选中节点时，触发过滤操作
   * 默认为true
   */
  showNode?: boolean;
  /**
   * true - 展示树
   * false - 隐藏树
   * 默认为true
   */
  showTree?: boolean;
  /**
   * 过滤方式
   * default - 高亮显示匹配节点
   * hidden - 隐藏未匹配节点
   * disabled - 禁用未匹配节点
   */
  type?: 'default'|'hidden'|'disabled';
  /**
   * 临时方案，目前使用不便
   * 用来处理过滤操作后，继续显示过滤菜单
   */
  setVisible?: Function;
}

interface SearchTreeState {
  searchValue: string,
  autoExpandParent: boolean,
  expandedKeys: string[],
  checkedKeys: string[],
  selectedKeys: string[],
}

export default class SearchTree extends React.Component<
  SearchTreeProps,
  SearchTreeState
> {
  static defaultProps = {
    dataSource: [],
    showTree: true,
    showNode: true,
    type: 'default'
  }
  state = {
    searchValue: '',
    autoExpandParent: true,
    expandedKeys: [],
    checkedKeys: [],
    selectedKeys: []
  };

  getParentKey = (key: string, tree?: any[]): any => {
    let parentKey;
    if(!tree?.length) {
      return [];
    }
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 拆分层级
  generateList = (data: any) => {
    let dataList: any = [];
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: key });
      if (node.children) {
        dataList = [].concat(dataList, this.generateList(node.children));
      }
    }
    return dataList;
  };

  // 节点展开回调
  onExpand = (expandedKeys: string[]) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  // 搜索框onChange事件
  onChange = (e: any) => {
    const { dataSource, showTree, setSelectedKeys, confirm } = this.props;
    const { value } = e.target;
    if(showTree) {
      const expandedKeys = this.generateList(dataSource)
        .map((item: any) => {
          if (item.title?.toUpperCase()?.indexOf(value?.toUpperCase()) > -1) {
            return this.getParentKey(item.key, dataSource);
          }
          return null;
        })
        .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);

      this.setState({
        expandedKeys,
        autoExpandParent: true,
      });
    } else {
      setSelectedKeys(value ? [value] : []);
    }
    this.setState({
      searchValue: value,
    });
  };

  // 选中节点以及选中节点复选框时的回调
  onChoose = (keys: any, e: any) => {
    const { setSelectedKeys, confirm, showNode, setVisible } = this.props;
    setSelectedKeys(keys);
    this.setState({
      checkedKeys: keys,
      selectedKeys: keys
    }, () => {
      !showNode && confirm();
      setVisible && setVisible();
    });
  }

  // 确定按钮回调
  handleSearch = () => {
    const { confirm } = this.props;
    confirm();
  };

  // 重置按钮回调
  handleReset = () => {
    const { clearFilters } = this.props;
    clearFilters();
    this.setState({
      searchValue: '',
      checkedKeys: [],
      selectedKeys: [],
      expandedKeys: []
    });
  };

  // 搜索框回车键回调
  onPressEnter = () => {
    const { showTree, confirm } = this.props;
    if(!showTree) {
      confirm();
    }
  }

  // 提供三种过滤方式
  handleNodeWithType = (flag: boolean, item: any, title: React.ReactNode) => {
    const { type } = this.props;
    if(type === 'hidden') {
      if(flag) {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {this.loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      } else {
        return null;
      }
    } else {
      let disabled = type === 'disabled' ? !flag : false;
      if (item.children) {
        return (
          <TreeNode disabled={disabled} key={item.key} title={title}>
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode disabled={disabled} key={item.key} title={title} />;
    }
  }

  loop = (data: any) => {
    const { type } = this.props;
    const { searchValue } = this.state;
    return data.map((item: any) => {
      const index = !searchValue ? -1 : item.title?.toUpperCase()?.indexOf(searchValue?.toUpperCase());
      const title =
        (index > -1 && type === 'default') ? (
          <span style={{ color: 'red', fontWeight: 500 }}>{item.title}</span>
        ) : (
          <span>{item.title}</span>
        );
      return this.handleNodeWithType((index > -1 || !searchValue), item, title);
    });
  }

  // 节点过滤，使用该方法后，不需要在loop方法中做文本的处理
  // 但是该方法目前来看，限制较大。匹配到的节点，其全部文字高亮，且颜色固定为红色。
  filterTreeNode(searchValue: string, node: any) {
    return !!searchValue && node?.props?.title?.props?.children?.toUpperCase()?.includes(searchValue?.toUpperCase());
  }

  render() {
    const { 
      searchValue,
      autoExpandParent,
      expandedKeys,
      checkedKeys,
      selectedKeys
    } = this.state;
    const { dataSource, showNode, showTree } = this.props;
    return (
      <div style={{ padding: 8 }}>
        <Search 
          style={{ marginBottom: 8 }} 
          placeholder="Search" 
          onChange={this.onChange}
          value={searchValue}
          onPressEnter={this.onPressEnter.bind(this)}
        />
        {
          showTree && (
            <Tree
              style={{ maxHeight: 256, overflow: 'auto' }}
              checkable
              multiple
              checkedKeys={checkedKeys}
              onCheck={this.onChoose.bind(this)}
              selectedKeys={selectedKeys}
              onSelect={this.onChoose.bind(this)}
              expandedKeys={expandedKeys}
              onExpand={this.onExpand}
              autoExpandParent={autoExpandParent}
              // filterTreeNode={this.filterTreeNode.bind(this, searchValue)}
            >
              {this.loop(dataSource)}
            </Tree>
          )
        }
        {
          showNode && (
            <div style={{borderTop: "1px solid #f2f2f2", marginTop: 8, paddingTop: 8}}>
              <Button
                onClick={this.handleReset.bind(this)}
                size="small"
                style={{ width: 90, marginRight: 8 }}>
                重置
              </Button>
              <Button
                onClick={this.handleSearch.bind(this)}
                size="small"
                style={{ width: 90}}>
                确定
              </Button>
            </div>
          )
        }
      </div>
    );
  }
}