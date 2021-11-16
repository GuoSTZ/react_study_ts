import React, {ReactNode} from 'react';
import {Row, Col, Card, Select, Radio, Button} from 'antd';
import {BaseFormViewProps} from '@soc/framework';
import {Echart} from '@soc/components';
import moment from 'moment';
import {data} from './data';
import './index.less';

const {Option} = Select;

export interface FormProps {

}

interface FormState {}

export default class EchartsView extends React.Component<
  FormProps,
  FormState
> {
  constructor(props: FormProps) {
    super(props);
  }

  state = {
    flowMonitorDbid: undefined, //缺省全部
    flowMonitorCyc: 1, //缺省时
    dsList: [],
    flowData: {},
    show: false
  };

  componentDidMount() {
    this.setState({
      dsList: []
    });
    this.changeFlowMonitor();
  }
  handlerFlowMonitorMenuButton(e: any) {
    this.setState(
      {
        flowMonitorCyc: e.target.value
      },
      () => {
        this.changeFlowMonitor();
      }
    );
  }

  handelFlowMonitorSelect = (e: any) => {
    this.setState(
      {
        flowMonitorDbid: e
      },
      () => {
        this.changeFlowMonitor();
      }
    );
  };

  setFlowChartInfo = (flowData: any) => {
    let xLineList = new Array();
    let inAllList = new Array();
    let outAllList = new Array();
    let xtime = '';
    const {flowMonitorCyc} = this.state;
    flowData?.inFlowFigure?.points &&
      flowData?.inFlowFigure?.points.map((x: any) => {
        xLineList.push(moment(x.x * 1000).format('YYYY-MM-DD HH:mm:ss'));
        inAllList.push(x.y);
      });
    flowData?.outFlowFigure?.points &&
      flowData?.outFlowFigure?.points.map((x: any) => {
        outAllList.push(x.y);
      });
    const data = {
      xData: xLineList,
      yData: [{data: outAllList}, {data: inAllList}]
    };
    return data;
  };

  changeFlowMonitor = () => {
    const {flowMonitorCyc, flowMonitorDbid} = this.state;
    this.setState({
      flowData: data
    });
  };

  renderFlowMonitorDashboardExtra = () => {
    const {dsList} = this.state;
    return (
      <Row>
        <Col span={14}>
          <Select
            allowClear
            placeholder={'全部'}
            onChange={this.handelFlowMonitorSelect.bind(this)}>
            {dsList?.map((ds: any) => {
              return <Option value={ds.dsId}>{ds.dsName}</Option>;
            })}
          </Select>
        </Col>
        <Col span={10}>
          <Radio.Group
            defaultValue={this.state.flowMonitorCyc}
            buttonStyle='solid'
            onChange={this.handlerFlowMonitorMenuButton.bind(this)}>
            {[]?.map((d: any) => {
              return <Radio.Button value={d.value}>{d.label}</Radio.Button>;
            })}
            {/* <Radio.Button value='hour'>时</Radio.Button>
            <Radio.Button value='day'>日</Radio.Button>
            <Radio.Button value='month'>周</Radio.Button> */}
          </Radio.Group>
        </Col>
      </Row>
    );
  };

  render(): ReactNode {
    const {props} = this;
    const {flowData} = this.state;
    const data = this.setFlowChartInfo(flowData);
    const {flowMonitorCyc} = this.state;
    return (
      <Card
        title='流量监控'
        extra={this.renderFlowMonitorDashboardExtra()}>
        <Echart
          dataInfo={data}
          columnsName={[
            '全部流量【发送】(单位:KB)',
            '全部流量【接收】(单位:KB)'
          ]}
          colors={['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16']}
          // isArea={true}
          areaColors={['#fff']}
          legendConfig={{
            show: true,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 18
          }}
          titleConfig={{
            titleName: ' ',
            fontSize: 16,
            fontWeight: 'bolder',
            logoWidth: 25,
            logoHeight: 25
          }}
          basicConfig={
            {
              // backgroundColor:'#ffe9db'
            }
          }
          tooltipConfig={{
            backgroundColor: 'black',
            borderWidth: 1
            // textColor: 'green'
          }}
          axisConfig={{
            xLineShow: true,
            // xColor: '#e3c5ed',
            xTickShow: true,
            xTickAlign: 'up',
            xLabelAlign: 'center',
            yLineShow: true,
            // yColor: 'green',
            yLabelAlign: 'left',
            yTickAlign: 'right',
            ySplitLineShow: true,
            // ySplitLineColor: 'orange',
            ySplitLineStyle: 'dashed'
          }}
          options={{
            xAxis: {
              data: data.xData,
              axisLabel: {
                formatter: function(value: any) {
                  return flowMonitorCyc === 3
                    ? (value + '')?.substr(0, 10)
                    : (value + '')?.substr(10, value.length);
                }
              }
            }
          }}
          otherProps={props}
        />
      </Card>
    );
  }
}
