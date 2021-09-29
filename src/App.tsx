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
// import IconTip from './module/IconTip';
import ProgressView from './module/ProgressView';
// import CardView from './module/CardView';
// import SelectView from './module/SelectView';
// import TreeSelectView from './module/TreeSelectView';
import TableTransfer from './module/TableTransfer';
import './App.css';
import { Icon } from 'antd';
import image1 from './images/1.png'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ProgressView 
          dataSource={
            [
              {label: '测试', percent: 40, color: 'red'}
            ]
          }
        />
      </div>
    );
  }
}

export default App;