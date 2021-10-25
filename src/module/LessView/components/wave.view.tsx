import React from 'react';
import '../less/wave.less';
// 转义
export default class WaveView extends React.Component {

  render() {
    return (
      <React.Fragment>
        <div className="wave"></div>
        <div className="wave2"></div>
        <div className="wave3"></div>
        <div className="wave4"></div>
        <div className="wave5"></div>
      </React.Fragment>
    )
  }
}