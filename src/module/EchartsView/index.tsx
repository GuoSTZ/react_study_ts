import React from 'react';
import {Row, Col} from 'antd';
import Chart from './chart.view';

export default class EchartsView extends React.Component {
  render() {
    return (
      <Row>
        <Col span={12}>
          <Chart />
        </Col>
        <Col span={12}>
          666
        </Col>
      </Row>
    )
  }
}