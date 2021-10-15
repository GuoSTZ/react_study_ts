import React from 'react';
import { viewPrefix } from '../../config';
import './index.less';

export interface LessViewProps { }

interface LessViewState { }

export default class LessView extends React.Component<
  LessViewProps,
  LessViewState
> {
  render() {
    const prefixCls = `${viewPrefix}-LessView ${viewPrefix}LessView`;
    return (
      <div className={prefixCls}>
        <div className={`box box-1`}>111</div>
        <div className={`box box-2`}>222</div>
        <div className={`box box-3`}>333</div>
        <div className={`box box-one`}>one</div>
        <div className={`box box-two`}>two</div>
        <div className={`box box-three`}>three</div>
      </div>
    )
  }
}