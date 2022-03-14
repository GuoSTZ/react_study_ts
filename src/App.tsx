import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { Select } from 'antd';
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
import TreeSelect from './module/TreeSelect/select';
import TableTransfer from './module/TableTransfer';
// import EchartsView from './module/EchartsView';
// import LessView from './module/LessView';
// import { ModalMethodView } from './module/Modal';
// import TableMenuView from './module/TableMenu/ceshi';
// import AnimateCssView from './module/AnimateCss';
// import AnimationView from './module/Animation';
// import Select from './module/Select';
import VirtualSelect_class from './module/Select/components';
import ScreenView from './module/Screen';
import TransferView, { ListTransfer, Ceshi } from './module/Transfer';
import { FormView, WrappedDynamicFieldSet } from './module/Form';
import './App.css';
import { Icon } from 'antd';
import image1 from './images/1.png'
import borderSvg from './border.svg';
import ceshiSvg from './ceshi.svg';
import customSvg from './custom.svg';


import {treeData} from './utils/mockData';

class App extends Component {
  render() {
    const {Option, OptGroup} = Select;
    const options = [];
    const options2 = [];
    for (let i = 1; i < 1004; i++) {
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
    for(let i=0;i< 1000; i++) {
      data.push({
        title: `content ${i}`,
        key: i.toString(),
      })
    }
    return (
      <div className="App">
        <VirtualSelect_class 
          placeholder="请选择内容" 
          style={{width: 400}}
          // dropdownStyle={{height: 400}}
          // dropdownClassName={'aaaaaa'}
          showSearch
          optionFilterProp="children"
          mode="tags"
          // mode="multiple"
          // open={true}  
          // getPopupContainer={(triggerNode: any) => triggerNode.parentElement}
        >
          {
            options.map((item: any, index: number) => <Option value={item.value} key={index}>{item.label}</Option>)
          }
        </VirtualSelect_class>
        {/* <Select
          optionFilterProp="children"
          // mode="tags"
          showSearch
          placeholder="普通Select" 
          style={{width: 400}}
          open={true}
        >
          {
            options.map((item: any, index: number) => <Option value={item.value} key={index}>{item.label}</Option>)
          }
        </Select> */}
        {/* <FormView /> */}
        {/* <TableTransfer 
          dataSource={data}
          leftColumns={[{dataIndex: 'title'}]}
          rightColumns={[{dataIndex: 'title'}]}
          showSearch
          showSelectAll={false}
          maxTargetKeys={200}
          dropdownSelectCount={[100]}
        /> */}
        {/* <TreeSelect 
          style={{width: 400}}
          placeholder="请选择"
          treeData={treeData}
          treeCheckable
          open={true}
        /> */}
      </div>
    );
  }
}

export default App;