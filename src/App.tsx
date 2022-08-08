import React, { Component, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { Select, Button } from 'antd';

import {treeData} from './utils/mockData';

class App extends Component {
  state = {
    status: false,
    visible: false
  }
  render() {
    const {Option, OptGroup} = Select;
    const options = [];
    const options2 = [];
    for (let i = 1; i < 1; i++) {
      const value = `content${i}`;
      options.push({
        value,
        label: `content${i}`,
        disabled: i === 10,
      });
      // i< 500 && options2.push({
      //   value,
      //   label: `content${i}`,
      //   disabled: i === 10,
      // });
    }
    let data = [];
    for(let i=0;i< 50000; i++) {
      data.push({
        title: `content ${i}`,
        key: i.toString(),
        disabled: i === 4,
      })
    }
    return (
      <div className="App"></div>
    );
  }
}

export default App;