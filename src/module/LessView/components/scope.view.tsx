import React from 'react';
import '../less/scope.less';

export default class ScopeView extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="scope">
          <div className="scope-child"></div>
        </div>
        <div className="other"></div>
      </React.Fragment>
    )
  }
}