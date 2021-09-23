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
import ReactFileView from './module/ReactFileView';
// import Mammoth from './module/mammoth';
// import LoadingTree from './module/Tree';
// import EditableTable from './module/Table';
import './App.css';

class App extends Component {
  render() {
    return (
      <ReactFileView />
    );
  }
}

export default App;