import React from 'react';
import { List, message, Avatar, Spin } from 'antd';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import './index.less';

export default class InfiniteLoaderList extends React.Component {
  index: number = 0;
  state = {
    data: [],
    loading: false,
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
    const data: any = [];
    for(let i=this.index; i<this.index+50; i++ ) {
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

  handleInfiniteOnLoad = ({ startIndex, stopIndex }: any): any => {
    let { data } = this.state;

    if(stopIndex === data.length - 1) {
      console.log(startIndex, stopIndex, '=====')
      this.fetchData((res: any) => {
        data = data.concat(res);
        setTimeout(() => {
          this.setState({
            loading: false,
            data
          })
        }, 2000)
      });
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
          overscanRowCount={100}
          rowCount={data.length}
          rowHeight={73}
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
        loadMoreRows={this.handleInfiniteOnLoad}
        rowCount={data.length}
        minimumBatchSize={5}
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
        <Spin className="demo-loading" />
      </List>
    );
  }
}