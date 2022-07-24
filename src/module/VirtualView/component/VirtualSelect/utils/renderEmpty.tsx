import * as React from 'react';
import Empty from 'antd/lib/empty';
import { getPrefixCls } from './index';

const renderEmpty = (componentName?: string): React.ReactNode => {
  const prefix = getPrefixCls('empty');

  switch (componentName) {
    case 'Table':
    case 'List':
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

    case 'Select':
    case 'TreeSelect':
    case 'Cascader':
    case 'Transfer':
    case 'Mentions':
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={`${prefix}-small`} />;
    default:
      return <Empty />;
  }
}

export type RenderEmptyHandler = typeof renderEmpty;

export default renderEmpty;
