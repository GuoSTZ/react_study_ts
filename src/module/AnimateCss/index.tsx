import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import './static/animate.conpat.min.css';

export default class AnimateCssView extends React.Component {
  state = {
    class: ''
  }

  onClick = (e: any) => {
    this.setState({class: 'fadeOutDown'}); 
    let timer = setTimeout(() => {
      this.setState({class: ''}, () => {
        clearTimeout(timer);
      })
    }, 1000);
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className={classnames("animated", this.state.class)}>66666</div>
        <Button onClick={this.onClick.bind(this)} style={{marginTop: 200}}>
          演示动画
        </Button>
      </div>
    );
  }
}