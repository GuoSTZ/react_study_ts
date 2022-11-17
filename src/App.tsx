import React, { Component } from 'react';
import { Tabs } from 'antd';
import Container from './layout';
import './App.less';

const { TabPane } = Tabs;

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container />
      </div>
    );
  }
}

export default App;