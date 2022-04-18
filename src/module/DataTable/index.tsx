import React, { ReactNode } from 'react';
import { Badge } from 'antd';
import { DataTable as McDataTable } from '@mcfed/components';
import { InfoCard, DataCard } from './components';
import './index.less';

import access from './images/access.png';
import flow from './images/flow.png';
import interface_sum from './images/interface-sum.png';
import ip from './images/ip.png';
import monitor_interface from './images/monitor-interface.png';
import sensitive_interface from './images/sensitive-interface.png';

const DataTable: React.FC<any> = () => {

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: any) => ({
      name: record.name,
    }),
  };

  const renderLabel = (icon: ReactNode, label: string) => {
    if (!icon) {
      return label;
    }
    return (
      <span className='icon-label'>
        {icon}
        {label}
      </span>
    )
  }

  // 暂未做极端数据判断
  const formatNumber = (value: string|number) => {
    const data = String(value);
    // 小数点处理
    const list = data.split('.');
    // 负号处理
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
  }

  const renderAppStutas = (status: number) => {
    if(status === 1) {
      return <Badge status="success" text="已启用" />
    } else {
      return <Badge status="default" text="已停用" />
    }
  }

  let tableConf: any = {
    rowKey: "id",
    dataSource: [
      { key: '1', ceshi1: "11", ceshi22: "22" },
      { key: '2', ceshi1: "11", ceshi22: "22" },
      { key: '3', ceshi1: "11", ceshi22: "22" },
      { key: '4', ceshi1: "11", ceshi22: "22" },
      { key: '5', ceshi1: "11", ceshi22: "22" }
    ],
    columns: [
      {
        title: '测试1',
        dataIndex: 'ceshi1',
        key: 'ceshi1',
        // width: 400,
        render: (text: any, row: any) =>
          <InfoCard
            title="杭州美创防水坝防水坝防水坝"
            desc="www.hzmc.com"
            info={{
              column: 2,
              dataSource: [
                { label: "端口", value: 8030 },
                { label: "应用状态", value: renderAppStutas(1) },
                { label: "备注", value: "我是一段备注信息信息信我是一段备注信息信息信我是一段备注信息信息信我是一段备注信息信息信我是一段备注信息信息信" }
              ]
            }}
          />
      },
      {
        title: '测试2',
        dataIndex: 'ceshi2',
        key: 'ceshi2',
        render: (text: any, row: any) =>
          <DataCard
            monitorData={{
              className: "monitorData",
              column: 3,
              dataSource: [
                { label: renderLabel(<img src={access} />, "当日访问量"), value: formatNumber(10199) },
                { label: renderLabel(<img src={flow} />, "当日监控流量"), value: formatNumber("62111") + " GB" },
                { label: renderLabel(<img src={ip} />, "当日访问IP数量"), value: formatNumber(62111) },
                { label: renderLabel(<img src={interface_sum} />, "接口数量"), value: <a href='#'>{formatNumber(62111)}</a> },
                { label: renderLabel(<img src={sensitive_interface} />, "敏感接口数"), value: <a href='#'>{formatNumber(62111)}</a> },
                { label: renderLabel(<img src={monitor_interface} />, "未监控接口数"), value: <a href='#'>{formatNumber(62111)}</a> }
              ]
            }}
            dataLabel={{
              column: 1,
              dataSource: [
                { label: "返回数据标签", value: "姓名，手机号，公司，学校，地址，统一识别号，身份证，学位证书编号，现家庭住址，原家庭住址" },
                { label: "请求数据标签", value: undefined }
              ]
            }}
          />
      }
    ],
    rowSelection,
    showHeader: false
  };

  return (
    <McDataTable {...tableConf} className="McDataTable" />
  )
}

export default DataTable;