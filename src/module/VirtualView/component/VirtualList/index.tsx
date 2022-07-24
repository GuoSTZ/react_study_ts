import React from 'react';
import {
  List
} from 'react-virtualized';

const VirtualList: React.FC<any> = props => {
  const { list } = props;
  return (
    <List 
      list={list}
      height={200}
      width={500}
      rowHeight={list.length * 48}
      rowCount={list.length}
      rowRenderer={(props: any) => {
        console.log(props, '===')
        return <div key={props.index}>666</div>;
      }}
    />
  )
}

export default VirtualList;