import React from 'react';
import { viewPrefix } from '../../config';
import ScopeView from './components/scope.view';
import NamespaceView from './components/namespace.view';
import FunctionView from './components/function.view';
import WaveView from './components/wave.view';
import VariableView from './components/variable.view';
import MixinView from './components/mixin.view';
import BuiltInFunction from './components/built-in-function.view';
import ExtendView from './components/extend.view';
import PseudoClassView from './components/pseudo-classes.view';
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
      <div className='guos-react-LessView'>
        {/* <div className="template" />     */}
        {/* <div className="aa"></div> */}
        {/* <div className={prefixCls}>
          <div className={`box box-1`}>111</div>
          <div className={`box box-2`}>222</div>
          <div className={`box box-3`}>333</div>
          <div className={`box box-one`}>one</div>
          <div className={`box box-two`}>two</div>
          <div className={`box box-three`}>three</div>
        </div> */}
        {/* <ScopeView /> */}
        {/* <NamespaceView /> */}
        {/* <FunctionView /> */}
        {/* <WaveView /> */}
        {/* <VariableView /> */}
        {/* <MixinView /> */}
        {/* <BuiltInFunction /> */}
        {/* <ExtendView /> */}
        <PseudoClassView />
      </div>
    )
  }
}