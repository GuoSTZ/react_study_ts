import React from 'react';

interface PointProps {
  x: number;
  y: number;
}

export interface FlyingLineProps {
  start: PointProps;
  end: PointProps;
  control: PointProps;
  speed?: number;
}

export default class FlyingLine extends React.Component<
  FlyingLineProps,
  any
> {
  percent: number = 0.0;
  canvasRef: any = null;

  static defaultProps = {
    start: {x: 0, y: 0},
    end: {x: 0, y: 0}
  }

  componentDidMount() {
    this.getLine();
  }

  interpolation(P0: any, P1: any, t: any) {
    var Q = {
      x: P0.x * (1 - t) + P1.x * (t),
      y: P0.y * (1 - t) + P1.y * (t),
    };
    return Q;
  }

  // 设置飞线颜色
  createGradient(ctx: any, p0: any, p1: any) {
    var grd = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    grd.addColorStop(0, 'rgba(250, 250, 210, 0)');
    grd.addColorStop(1, 'rgba(250, 250, 210, 0.1)');
    return grd;
  }

  // 绘制飞线
  draw(ctx: any, P0: any, P1: any, P2: any, percent: any) {
    let Q01 = this.interpolation(P0, P1, percent),
      Q11 = this.interpolation(P1, P2, percent),
      B1 = this.interpolation(Q01, Q11, percent);
    ctx.beginPath();
    ctx.moveTo(P0.x, P0.y);
    ctx.quadraticCurveTo(Q01.x, Q01.y, B1.x, B1.y);
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.createGradient(ctx, P0, P2);
    ctx.shadowColor = 'rgba(250, 250, 210, 1)';
    ctx.shadowBlur = 1;
    ctx.stroke();
  }

  // 控制绘画速率
  handleSpeed() {
    const { speed } = this.props;
    if(!speed || speed <= 0) {
      return 0.005;
    }
    if(speed > 1) {
      return 1;
    }
    return speed;
  }

  // 飞线流动
  getLine() {
    const {start, end, control, speed} = this.props;
    const canvas: any = this.canvasRef;
    const ctx = canvas.getContext("2d");
    // ctx.save();
    //按百分比绘制
    this.draw(ctx, start, control, end, this.percent);
    // ctx.restore();
    const sp = this.handleSpeed();
    this.percent += sp;
    if (this.percent > 1) {
      this.percent = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(this.getLine.bind(this));
  }

  render(): React.ReactNode {
    return (
      <canvas ref={ref => this.canvasRef = ref} id="canvas">
        浏览器不支持canvase
      </canvas>
    )
  }
}