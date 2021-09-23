import React, {ReactNode, Fragment, isValidElement, cloneElement, createElement} from 'react';
import {Icon, Tooltip} from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import classNames from 'classnames';
import './index.css';

export interface IconTipProps {
  /**
   * 提示语句
   */
  tip: string;
  /**
   * 展示文字
   */
  text?: string | ReactNode;
  /**
   * 指定展示图标的颜色，有四种选择 success，info，warning，error
   */
  type?: ColorType;
  /**
   * 展示图标为问号还是感叹号，目前仅内置该两种模式，默认为问号
   */
  iconType?: 'question' | 'exclamation';
  /**
   * 自定义图标
   */
  icon?: ReactNode;
  /**
   * ToolTip组件属性
   */
  tipProps?: TooltipProps
  /**
   * 图标相对于展示文字的位置，有两种选择 left，rigth
   */
  placement?: IconPlacement;
  /**
   * 是否显示图标，默认显示
   */
  showIcon?: boolean;
}

type ColorType = 'success' | 'info' | 'warning' | 'error';
type IconPlacement = 'left' | 'right';

type AnyObject = Record<any, any>;
type RenderProps = undefined | AnyObject | ((originProps: AnyObject) => AnyObject | undefined);

interface IconTipState {

}

export default class IconTip extends React.Component<
  IconTipProps,
  IconTipState
> {

  renderDefaultIcon(type?: ColorType): ReactNode {
    const {placement, iconType} = this.props;
    // Icon 类名定义
    let classList = `placement-${placement}`;
    if(type) {
      classList = `${classList} ${type}-icon`;
    } else {
      classList = `${classList} default-icon`;
    }
    // Icon 类型定义
    let typeStr = "";
    if(iconType === 'exclamation') {
      typeStr = "exclamation-circle";
    } else {
      typeStr = "question-circle";
    }
    return (
      <Icon 
        className={classList} 
        type={typeStr}
        theme="filled" 
      />
    );
  }

  replaceElement(
    element: ReactNode,
    replacement: ReactNode,
    props: RenderProps,
  ): ReactNode {
    if (!isValidElement(element)) return replacement;
  
    return cloneElement(
      element,
      typeof props === 'function' ? props(element.props || {}) : props,
    );
  }

  renderIconNode = (): ReactNode => {
    const { icon, type, placement } = this.props;
    // 渲染自定义按钮
    if (icon) {
      const prefixCls = 'anticon';
      return this.replaceElement(
        icon, 
        <span className={`${prefixCls}-icon placement-${placement}`}>{icon}</span>, 
        () => ({
          className: classNames(`${prefixCls}-icon placement-${placement}`, {
            [(icon as any).props.className]: (icon as any).props.className,
          }
        ),
      }));
    }
    return this.renderDefaultIcon(type);
  };

  renderTootip(tip: string, children: any): ReactNode {
    const {tipProps} = this.props;
    return (
      <Tooltip {...tipProps} title={tip}>
        {children}
      </Tooltip>
    )
  }

  renderComponent(): ReactNode {
    const {showIcon, text, tip, placement} = this.props;
    if(showIcon === false) {
      return this.renderTootip(tip, text);
    }
    if(placement === 'left') {
      return (
        <Fragment>
          {this.renderTootip(tip, this.renderIconNode())}
          {text}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {text}
          {this.renderTootip(tip, this.renderIconNode())}
        </Fragment>
      )
    }
  }

  render() {
    return (
      <span>
        {this.renderComponent()}
      </span>
    )
  }
}