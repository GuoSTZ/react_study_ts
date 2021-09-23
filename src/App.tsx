import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
// import { Button } from 'antd';
// import EditTableView from './module/EditTable';
// import DisabledButton from './module/Button/DisabledButton';
// import RouteTabs from './module/RouteTabs';
// import ReactFileView from './module/ReactFileView';
// import Mammoth from './module/mammoth';
// import LoadingTree from './module/Tree';
// import EditableTable from './module/Table';
import IconTip from './module/IconTip';
import './App.css';
import { Icon } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <IconTip 
          tip="测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中测试开发中" 
          text={<span>测试语句</span>}
          // showIcon={false}
          placement="right"
          type="warning"
          iconType="exclamation"
        />
      </div>
    );
  }
}

export default App;