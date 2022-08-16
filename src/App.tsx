import React, { Component } from 'react';
import { Tabs } from 'antd';
import McTreeSelectView from './module/TreeSelect/example/simple'
import McTreeSelectView_children from './module/TreeSelect/example/childNode'
import FormView from './module/Form/example/mc_tree_select';
import CollapseCardView from './module/CollapseCard/example/base';
import CollapseCardJson from './module/CollapseCard/example/schema';
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
          <TabPane tab="表单（用于验证自定义组件）" key="1">
            <FormView />
          </TabPane>
          <TabPane tab="树下拉框" key="2">
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
          <TabPane tab="折叠面板" key="3">
            <Tabs
              defaultActiveKey="1"
              destroyInactiveTabPane
              tabPosition='left'>
              <TabPane tab="折叠面板-antd Form表单" key="1">
                <CollapseCardView />
              </TabPane>
              <TabPane tab="折叠面板-formily Form表单" key="2">
                <CollapseCardJson />
              </TabPane>
            </Tabs>
            
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default App;