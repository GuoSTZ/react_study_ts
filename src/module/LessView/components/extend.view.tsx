import React from 'react';
import '../less/extend.less';

export default class ExtendView extends React.Component {
  render() {
    return (
      <div className="ExtendView">
        <div className="mixin1">111</div>
        <div className="mixin2">222</div>
        <div className="extend1">333</div>
      </div>
    )
  }
}