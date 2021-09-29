import React from 'react';
import { Progress, Row, Col } from 'antd';
import { ProgressProps } from 'antd/lib/progress';
import './index.less';

export interface ProgressViewProps extends ProgressProps {
  /**
   * 数据源
   */
  dataSource: dataSourceProps[];
  /**
   * 统一控制分隔符的显示和隐藏
   */
  colon?: boolean;
  /**
   * label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}
   */
  labelCol?: any;
  /**
   * 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
   */
  wrapperCol?: any;
}

interface dataSourceProps {
  /**
   * 进度值
   */
  percent: number;
  /**
   * 左侧文字
   */
  label?: string;
  /**
   * 自定义进度条颜色
   */
  color?: string | Function;
}

interface ProgressViewState { }

export default class ProgressView extends React.Component<
  ProgressViewProps,
  ProgressViewState
> {
  static defaultProps = {
    dataSource: [],
    colon: true,
    labelCol: {
      span: 4
    },
  }

  compileWrapperCol(label: string, labelCol: any, wrapperCol: any) {
    if(wrapperCol) {
      return wrapperCol;
    } else if(!label) {
      return { span: 24 };
    } else {
      return { span: 24 - labelCol?.span };
    }
  }

  render() {
    const {dataSource, colon, labelCol, wrapperCol, ...otherProps} = this.props;
    return (
      <div className="ProgressView">
        {
          dataSource?.map((item: any) => (
            <Row>
              { 
                item.label && (
                  <Col {...labelCol}>
                    <label className={`progressView-label ${colon ? 'progressView-label-colon' : ''}`}>
                      {item.label}
                    </label>
                  </Col>
                )
              }
              <Col {...this.compileWrapperCol(item.label, labelCol, wrapperCol)} >
                <Progress
                  {...otherProps}
                  percent={item.percent}
                  strokeColor={
                    typeof item.color === 'function'
                      ? item.color(item.percent)
                      : item.color
                  }
                />
              </Col>
            </Row>
          ))
        }
      </div>
    )
  }
}