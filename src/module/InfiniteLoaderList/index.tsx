import React from 'react';
import { List, Icon, Avatar, Spin } from 'antd';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import './index.less';

export default class InfiniteLoaderList extends React.Component {
  index: number = 1;
  itemHeight: number = 50;
  state = {
    data: [],
    loading: false,
    showTotal: false
  };

  loadedRowsMap: any = {};

  componentDidMount() {
    this.fetchData((res: any) => {
      this.setState({
        data: res,
      });
    });
  }

  fetchData = (callback: any) => {
    if(this.index === 151) {
      callback([])
      return;
    }
    const data: any = [];
    for(let i=this.index; i<this.index + 50; i++ ) {
      data.push({
        id: i,
        name: {
          last: "姓名" + i,
        },
        email: "5400xxxxxx.com"
      })
    }
    this.index = this.index + 50;
    callback(data)
  };

  handleInfiniteOnLoad = (scrollTop: number, height: number, { startIndex, stopIndex }: any): any => {
    let { data } = this.state;
    this.setState({
      loading: true,
      showTotal: false
    });
    // 舍弃小数点位
    const int_scrollTop = Math.round(scrollTop);
    // 当前显示的节点数量，包含显示部分的节点
    const visibleNode = height / this.itemHeight;
    const unvisibleNode = data.length - visibleNode;
    if(
      int_scrollTop - 40 <= this.itemHeight * unvisibleNode && 
      int_scrollTop - 40 >= this.itemHeight * Math.trunc(unvisibleNode)
    ) {
      setTimeout(() => {
        this.fetchData((res: any) => {
          if(res.length === 0) {
            this.setState({
              showTotal: true,
              loading: false
            })
          } else {
            data = data.concat(res);
            this.setState({
              data,
              loading: false,
            })
          }
        })
      }, 2000)
    }
  };

  isRowLoaded = ({ index }: any) => !!this.loadedRowsMap[index];

  renderItem = ({ index, key, style }: any) => {
    const { data } = this.state;
    const item: any = data[index];
    return (
      <List.Item key={key} style={style}>
        <List.Item.Meta
          // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href="https://ant.design">{item.name.last}</a>}
          description={item.email}
        />
        <div>Content</div>
      </List.Item>
    );
  };

  render() {
    const { data } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }: any) => {
      // console.log(height, isScrolling, scrollTop, onRowsRendered, width, '=====' )
      return (
        <VList
          autoHeight
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          overscanRowCount={20}
          rowCount={data.length}
          rowHeight={this.itemHeight}
          rowRenderer={this.renderItem}
          onRowsRendered={onRowsRendered}
          scrollTop={scrollTop}
          width={width}
        />
      )
    };
    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }: any) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width,
          })
        }
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }: any) => (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleInfiniteOnLoad.bind(this, scrollTop, height)}
        rowCount={data.length}
        minimumBatchSize={10}
      >
        {({ onRowsRendered }) =>
          autoSize({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
          })
        }
      </InfiniteLoader>
    );
    return (
      <List>
        {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
        {/* {this.state.loading && <Spin className="demo-loading" />} */}
        {/* <Spin className="demo-loading" tip="加载中"/> */}
        {
          this.state.loading && (
            <div className="demo-loading">
              <Icon type="loading" style={{color: 'rgb(24, 144, 255)'}}/> 加载中
            </div>
          )
        }
        {
          this.state.showTotal && (
            <div className="demo-loading">
              已展示全部
            </div>
          )
        }
      </List>
    );
  }
}