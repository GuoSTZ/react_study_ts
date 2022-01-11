import React from 'react';
import Center from './components/center';
import FlyingLine from './components/FlyingLine';
import './index.less';

export default class ScreenView extends React.Component {
  render() {
    return (
      <div style={{background: "gray", opacity: .5}}>
        {/* <div className="center"></div> */}
        {/* <Center /> */}
        <FlyingLine start={{x: 20, y: 20}} control={{x: 150, y: 20}} end={{x: 300, y: 200}}/>
        <div style={{marginLeft: 200, width: 200, height: 200}}>
          <FlyingLine start={{x: 20, y: 20}} control={{x: 150, y: 20}} end={{x: 300, y: 200}}/>
        </div>
      </div>
    )
  }
}