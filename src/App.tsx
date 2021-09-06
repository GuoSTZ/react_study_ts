import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
// import { Button } from 'antd';
import EditTableView from './module/EditTable';
// import DisabledButton from './module/Button/DisabledButton';
import RouteTabs from './module/RouteTabs';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/app'>
            <RouteTabs />
          </Route>
          <Route path='/editTable'>
            <EditTableView />
          </Route>
          <Redirect to='/app'></Redirect>
        </Switch>
      </Router>
    );
  }
}

export default App;