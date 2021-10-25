import React from 'react';
import '../less/scope.less';

export default class ScopeView extends React.Component {
  value = 1;
  scope1() {
    let value = 2;
    return value;
  }
  scope2() {
    let value = 3;
    return value;
  }
  scope3() {
    const item = 666;
    const arr = ['hello', 'world', ['hello world']];
    const res: any[] = [];
    arr.map((it: any) => {
      if(Array.isArray(item)) {
        item.map((item: any) => {
          res.push(item);
        })
      } else {
        res.push(item);
      }
    });
    return res.join(" ");
  }
  render() {
    return (
      <div className="scope">
        {this.scope1()}
        {this.scope2()}
        {this.scope3()}
      </div>
    )
  }
}