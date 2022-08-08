import React, { Component } from 'react';
import { Tabs } from 'antd';
import McTreeSelectView from './module/TreeSelect/example/simple'
import McTreeSelectView_children from './module/TreeSelect/example/childNode'
import './App.less';

const { TabPane } = Tabs;

class App extends Component {
  state = {
    status: false,
    visible: false
  }
  render() {
    return (
      <div className="App">
        <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane>
          <TabPane tab="树下拉框" key="1">
            <Tabs
              defaultActiveKey="1"
              destroyInactiveTabPane
              tabPosition='left'>
              <TabPane tab="树下拉框-treeData" key="1">
                <McTreeSelectView />
              </TabPane>
              <TabPane tab="树下拉框-treeNode" key="2">
                <McTreeSelectView_children />
              </TabPane>
            </Tabs>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;