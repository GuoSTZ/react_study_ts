import React, {ReactNode} from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import './index.css';

const { Meta } = Card;

export interface CardViewProps extends CardProps {
  data: any;
}

interface CardViewState { }

export default class CardView extends React.Component<
  CardViewProps,
  CardViewState
> {

  getColor(color: string|Function, value: number) {
    if(typeof color === 'function') {
      return color(value);
    } else {
      return color;
    }
  }

  renderDesc(content: any[]): ReactNode {
    return (
      <React.Fragment>
        {
          content?.map((item: any) => (
            <div className="desc-content" style={{color: `${this.getColor(item.color, item.value)}`}}>
              <label>{item.label}</label>
              {item.value}
            </div>
          ))
        }
      </React.Fragment>
    )
  }

  render() {
    const {data, ...otherProps} = this.props;
    return (
      <Card className="CardView">
        <Meta
          {...otherProps}
          avatar={
            <img src={data?.image} />
          }
          title={data?.title}
          description={this.renderDesc(data?.content)}
        />
      </Card>
    )
  }
}