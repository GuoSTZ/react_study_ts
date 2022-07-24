import React, { useContext, FC, ComponentType, useMemo } from 'react';
import { Route, RouteProps, useHistory } from 'react-router';
import { Spin, Drawer, Button } from 'antd';
import { Panel } from '@mcfed/components';
import { DrawerProps } from 'antd/lib/drawer';
import LocaleReceiver from 'antd/lib/locale-provider/LocaleReceiver';
import { History } from 'history';
import './index.less';

export type Mode = 'view' | 'drawer';

export type EventType = React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

const ModeContext = React.createContext<Mode>('view');

interface ModeRouteProps extends RouteProps {
  mode: Mode;
}

export function ModeRoute(props: ModeRouteProps) {
  const { mode, ...restProps } = props;
  return (
    <ModeContext.Provider value={mode}>
      <Route {...restProps} />
    </ModeContext.Provider>
  );
}

export interface DrawerOrViewProps extends DrawerProps {
  /** 模式配置 */
  mode?: Mode;
  /** 页面loading状态 */
  loading?: boolean;
  /** 自定义抽屉组件 */
  DrawerComponent?: ComponentType<DrawerProps>;
  /** 确定按钮回调函数 */
  onOk?: React.MouseEventHandler<HTMLElement>;
  /** 底部按钮 */
  footer?: React.ReactNode | null;
  /** 确定按钮loading状态 */
  confirmLoading?: boolean;
  /** 确认按钮文案 */
  okText?: string;
  /** 关闭按钮文案 */
  closeText?: string;
}

export const useHandleClose = (params: {
  onClose?: ((e: EventType) => void);
  history?: History;
}) => {
  const { onClose, history } = params;
  return useMemo(
    () =>
      onClose as any ||
      ((e: React.MouseEventHandler<HTMLElement>) => {
        history?.goBack();
      }),
    [onClose, history]
  );
};

export const DrawerOrView: FC<DrawerOrViewProps> = function DrawerOrView(props) {
  const {
    mode: propsMode,
    DrawerComponent,
    children,
    confirmLoading,
    loading,
    footer,
    onOk,
    okText,
    closeText,
    ...drawerProps
  } = props;
  const contextMode = useContext(ModeContext);
  const history = useHistory();
  const mode = propsMode || contextMode;
  const { onClose, className, ...restProps } = drawerProps || {};
  const handleClose = useHandleClose({ onClose, history });

  const renderFooter = () => {
    if(footer === null) {
      return null;
    } else if (footer) {
      return (
        <div
          className='DrawerView-footer'
          style={{ textAlign: 'right' }}>
          {footer}
        </div>
      )
    } else {
      return (
        <div
          className='DrawerView-footer'
          style={{ textAlign: 'right' }}>
          <Button type='primary' onClick={onOk} style={{ marginRight: 8 }} loading={confirmLoading}>
            {okText ?? "确认"}
          </Button>
          <Button onClick={handleClose}>
            {closeText ?? "取消"}
          </Button>
        </div>
      )
    }
  }

  if (mode === 'view') {
    return (
      <Panel {...restProps} loading={loading} onCancel={handleClose}>
        {children}
      </Panel>
    );
  }
  if (DrawerComponent) {
    return (
      <DrawerComponent
        visible={true}
        maskClosable={false}
        {...restProps}
        className={className ? `DrawerView ${className}` : `DrawerView`}
        onClose={handleClose}>
        <Spin spinning={!!loading}>{children}</Spin>
        {renderFooter()}
      </DrawerComponent>
    );
  }
  return null;
};

DrawerOrView.defaultProps = {
  DrawerComponent: Drawer,
  mode: 'view'
};

export function withDrawerOrView<T = any>(drawerProps?: DrawerOrViewProps) {
  return (Component: ComponentType) => {
    return function (props: T) {
      return (
        <DrawerOrView {...drawerProps}>
          <Component {...props} />
        </DrawerOrView>
      );
    };
  };
}
