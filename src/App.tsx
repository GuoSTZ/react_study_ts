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
import ProgressView from './module/Progress';
import './App.css';
import { Icon } from 'antd';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ProgressView 
          dataSource={[
            {percent: 50, label: "CPU", color: 'red'},
            {percent: 85, color: '#000'},
            {percent: 99, color: (data: number) => {if(data> 80) return 'red'; else return 'orange';}},
          ]} 
          size="small"
          status="active"
        />
      </div>
    );
  }
}

export default App;