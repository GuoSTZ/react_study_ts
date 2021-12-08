import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import './index.less';

export interface WrapProps {
  width: number;
  height: number;
}

interface WrapState {
  scale: number;
}

class Wrap extends Component<
  WrapProps,
  WrapState
> {
  constructor(props: any) {
    super(props);
    this.state={
      scale: this.getScale()
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.setScale);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setScale);
  }
  
  getScale= () => {
    const {width=1920, height=1080} = this.props;
    let ww = window.innerWidth / width;
    let wh = window.innerHeight / height;
    return ww < wh ? ww : wh;
  }

  setScale = debounce(() => {
    let scale = this.getScale();
    this.setState({ scale });
  }, 500)

  render() {
    const { width=1920, height=1080, children } = this.props;
    const { scale } = this.state;
    return(
      <div
        className={'scale-box'}
        style={{
          transform: `scale(${scale}) translate(-50%, -50%)`,
          WebkitTransform: `scale(${scale}) translate(-50%, -50%)`,
          width,
          height
        }}
      >
        {children}
      </div>
    )
  }
}

export default Wrap;