import React from 'react';
import { Transfer } from 'antd';
import { TransferProps } from 'antd/lib/transfer';

export interface TableTransferProps extends TransferProps {

}

interface TableTransferState { }

export default class TableTransfer extends React.Component<
  TableTransferProps,
  TableTransferState
> {
  static defaultProps = {
  }
  render() {
    return (
      <Transfer 
      
      />
    )
  }
}