import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
// import { Button } from 'antd';
// import EditTableView from './module/EditTable';
import CheckView from './module/EditTable/check';
// import DisabledButton from './module/Button/DisabledButton';
// import RouteTabs from './module/RouteTabs';
// import ReactFileView from './module/ReactFileView';
// import Mammoth from './module/mammoth';
// import TreeView, {LoadingTree, VirtualTree, IOTreeView} from './module/Tree';
// import TableView, {FilterTable, ExpandedTableView, EditableTable} from './module/Table';
// import IconTip from './module/IconTip';
// import ProgressView from './module/ProgressView';
// import CardView from './module/CardView';
// import SelectView from './module/SelectView';
// import TreeSelectView from './module/TreeSelectView';
import TableTransfer from './module/TableTransfer';
// import EchartsView from './module/EchartsView';
// import LessView from './module/LessView';
// import { ModalMethodView } from './module/Modal';
// import TableMenuView from './module/TableMenu/ceshi';
// import AnimateCssView from './module/AnimateCss';
// import AnimationView from './module/Animation';
import ScreenView from './module/Screen';
import TransferView, { ListTransfer, Ceshi } from './module/Transfer';
import { FormView, WrappedDynamicFieldSet } from './module/Form';
import './App.css';
import { Icon } from 'antd';
import image1 from './images/1.png'
import borderSvg from './border.svg';
import ceshiSvg from './ceshi.svg';
import customSvg from './custom.svg';

class App extends Component {
  render() {
    const leftTableColumns = [
      {
        dataIndex: 'title',
        title: 'Name',
      }
    ];
    const rightTableColumns = [
      {
        dataIndex: 'title',
        title: 'Name',
      }
    ];
    const mockData: any = [];
    for (let i = 0; i < 100; i++) {
      mockData.push({
        key: i.toString(),
        title: `content${i + 1}`,
        disabled: i % 2 === 0
      });
    }
    return (
      <div className="App">
        <TableTransfer
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
          dataSource={mockData}
          showSearch
          targetKeys={['1', '2', '3', '4']}
        />
      </div>
      // <div
      //   style={{
      //     margin: 200,
      //     width: 410,
      //     height: 400,
      //     background: `url(${customSvg})`,
      //     backgroundSize: 'contain',
      //     backgroundRepeat: 'no-repeat'
      //   }}
      // >
      //   666
      // </div>
    );
  }
}

export default App;