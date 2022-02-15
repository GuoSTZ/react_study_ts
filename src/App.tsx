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
// import TableTransfer from './module/TableTransfer';
// import EchartsView from './module/EchartsView';
// import LessView from './module/LessView';
// import { ModalMethodView } from './module/Modal';
// import TableMenuView from './module/TableMenu/ceshi';
// import AnimateCssView from './module/AnimateCss';
// import AnimationView from './module/Animation';
import Select from './module/Select';
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
    const {Option, OptGroup} = Select;
    const options = [];
    for (let i = 0; i < 100000; i++) {
      const value = `${i.toString(36)}${i}`;
      options.push({
        value,
        label: `content${i}`,
        disabled: i === 10,
      });
    }
    return (
      <div className="App">
        <Select placeholder="请输入内容" style={{width: 400}}>
          {
            options.map((item: any) => <Option value={item.value}>{item.label}</Option>)
          }
        </Select>
      </div>
    );
  }
}

export default App;