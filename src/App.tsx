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
// import ProgressView from './module/Progress';
import CardView from './module/CardView';
import './App.css';
import { Icon } from 'antd';
import image1 from './images/1.png'

class App extends Component {
  render() {
    return (
      <div className="App">
        <CardView 
          data={{
            title: "敏感访问", 
            image: image1, 
            content: [{label: '敏感SQL', value: 30, color: 'red'}, {label: "DROP", value: 20, color: (data: number) => {if(data> 30) return 'blue';else return 'orange';}}]
          }}/>
      </div>
    );
  }
}

export default App;