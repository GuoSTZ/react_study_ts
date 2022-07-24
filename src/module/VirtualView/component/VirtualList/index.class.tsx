import clsx from 'clsx';
import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {
  AutoSizer,
  List,
} from 'react-virtualized';
import './index.class.css';

export default class ListExample extends React.PureComponent<any, any> {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List as any).isRequired,
    ceshi: []
  };

  constructor(props: any, context: any) {
    super(props, context);
    console.log(props, context, '====')

    this.state = {
      listHeight: 300,
      listRowHeight: 50,
      overscanRowCount: 10,
      rowCount: context?.list?.size || 10,
      scrollToIndex: undefined,
      showScrollingPlaceholder: false,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  render() {
    const {
      listHeight,
      listRowHeight,
      overscanRowCount,
      rowCount,
      scrollToIndex,
      showScrollingPlaceholder,
      useDynamicRowHeight,
    } = this.state;

    return (
      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              ref="List"
              className={"List"}
              height={listHeight}
              overscanRowCount={overscanRowCount}
              noRowsRenderer={this._noRowsRenderer}
              rowCount={rowCount}
              rowHeight={
                useDynamicRowHeight ? this._getRowHeight : listRowHeight
              }
              rowRenderer={this._rowRenderer}
              scrollToIndex={scrollToIndex}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

  _getDatum(index: number) {
    const { list } = this.context;

    return list?.get?.(index % list.size);
  }

  _getRowHeight({ index }: any) {
    return this._getDatum(index).size;
  }

  _noRowsRenderer() {
    return <div className={"noRows"}>No rows</div>;
  }

  _onRowCountChange(event: any) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({ rowCount });
  }

  _onScrollToRowChange(event: any) {
    const { rowCount } = this.state;
    let scrollToIndex: any = Math.min(
      rowCount - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({ scrollToIndex });
  }

  _rowRenderer({ index, isScrolling, key, style }: any) {
    const { showScrollingPlaceholder, useDynamicRowHeight } = this.state;

    if (showScrollingPlaceholder && isScrolling) {
      return (
        <div
          className={clsx("row", "isScrollingPlaceholder")}
          key={key}
          style={style}>
          Scrolling...
        </div>
      );
    }

    const datum = this._getDatum(index);

    let additionalContent;

    if (useDynamicRowHeight) {
      switch (datum.size) {
        case 75:
          additionalContent = <div>It is medium-sized.</div>;
          break;
        case 100:
          additionalContent = (
            <div>
              It is large-sized.
              <br />
              It has a 3rd row.
            </div>
          );
          break;
      }
    }

    return (
      <div className={"row"} key={key} style={style}>
        <div
          className={"letter"}
          style={{
            backgroundColor: datum.color,
          }}>
          {datum.name.charAt(0)}
        </div>
        <div>
          <div className={"name"}>{datum.name}</div>
          <div className={"index"}>This is row {index}</div>
          {additionalContent}
        </div>
        {useDynamicRowHeight && (
          <span className={"height"}>{datum.size}px</span>
        )}
      </div>
    );
  }
}