import React, { Component } from 'react';
// import { Button } from 'antd';
import EditTableView from './module/EditTable';
// import DisabledButton from './module/Button/DisabledButton';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <EditTableView />
      </div>
    );
  }
}

export default App;