import React from 'react';
import { Tabs } from 'antd';
import { TabsProps } from 'antd/lib/tabs';
import FirstView from './template/first.view';
import SecondView from './template/second.view';
import ThirdView from './template/third.view';

export interface RouteTabsProps extends TabsProps {

}

interface RouteTabsState {

}

const { TabPane } = Tabs;

export default class RouteTabs extends React.Component<
  RouteTabsProps,
  RouteTabsState
> {

  callback(key: any) {
    console.log(key);
  }

  render() {
    const tabsData = [
      {
        path: "first",
        component: <FirstView />,
      },
      {
        path: "second",
        component: <SecondView />,
      },
      {
        path: "third",
        component: <ThirdView />,
      }
    ]
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
        <TabPane tab="Tab 1" key="1">
          <FirstView />
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          <SecondView />
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          <ThirdView />
        </TabPane>
      </Tabs>
    )
  }
}