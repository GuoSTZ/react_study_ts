import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import './index.less';

const Wrap: React.FC = (props: any) => {
  const { children } = props;
  return (
    <div>
      {children}
    </div>
  )
}