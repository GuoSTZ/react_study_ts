import React from 'react';
import './index.less';

export default class AnimationView extends React.Component {
  render(): React.ReactNode {
    return (
      <div id="animation-wrap">
        <div className="class1"></div>
        <div className="class2"></div>
        <div className="class3"></div>
      </div>
    )
  }
}