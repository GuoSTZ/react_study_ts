import React, { useState, useEffect, useRef } from 'react';
import { Transfer, List, Checkbox, Row, Col } from 'antd';
import { TransferProps } from 'antd/lib/transfer';
import { useInView } from "react-intersection-observer";
import ListTemplate from './useListTemplate';
import './style/listTransfer.less';

let mockDatasource: any = [];
for (let i = 0; i < 200; i++) {
  mockDatasource.push({
    title: `title${i}`,
    key: `${i}`
  })
}

const mockTargetKeys = ["3"];

const THRESHOLD = 15;




const ListTransfer: React.FC = (props: any) => {
  const {
    dataSource = mockDatasource,
    targetKeys = mockTargetKeys
  } = props;
  // const [ref, inView] = useInView();

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(THRESHOLD);
  const [observer, setObserver] = useState(null);
  const $bottomElement = useRef();
  const $topElement = useRef();

  const [_sourceSelectKeys, setSourceSelectKeys] = useState([] as any);
  const [_targetSelectKeys, setTargetSelectKeys] = useState([] as any);
  const [_targetKeys, setTargetKeys] = useState([] as any);

  useEffect(() => {
    setTargetKeys(targetKeys);
  }, [dataSource]);

  const getSourceData = () => {
    return dataSource?.filter((item: any) => !_targetKeys?.includes(item.key));
  }

  const getTargetData = () => {
    return dataSource?.filter((item: any) => _targetKeys?.includes(item.key));
  }

  const onChange = (targetKeys: any, direction: any, moveKeys: any) => {
    console.log(targetKeys, direction, moveKeys);
    setTargetKeys(targetKeys);
  }

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    if (sourceSelectedKeys?.length === 0) {
      setSourceSelectKeys([]);
    }
    if (sourceSelectedKeys?.length === getSourceData()?.length) {
      setSourceSelectKeys(sourceSelectedKeys);
    }
    if (targetSelectedKeys?.length === 0) {
      setTargetSelectKeys([]);
    }
    if (targetSelectedKeys?.length === getTargetData()?.length) {
      setTargetSelectKeys(targetSelectedKeys);
    }
  }

  return (
    <Transfer
      className='ListTransfer'
      dataSource={dataSource}
      targetKeys={_targetKeys}
      listStyle={{ width: 400, height: 400 }}
      showSelectAll={true}
      onChange={onChange}
      onSelectChange={onSelectChange}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const isLeft = () => {
          return direction === 'left';
        }

        const sourceGroupOnChange = (checkedValues: any) => {
          setSourceSelectKeys(checkedValues);
        }

        const sourceOnChange = (e: any, value: any) => {
          onItemSelect(value, e?.target?.checked);
        }

        const targetGroupOnChange = (checkedValues: any) => {
          setTargetSelectKeys(checkedValues);
        }

        const targetOnChange = (e: any, value: any) => {
          onItemSelect(value, e?.target?.checked);
        }

        if (isLeft()) {
          return (
            <ListTemplate 
              className={'ListTransfer-left'} 
              filteredItems={filteredItems} 
              onItemSelect={onItemSelect}
              selectKeys={_sourceSelectKeys} 
              groupOnChange={sourceGroupOnChange}
            />
          )
        } else {
          return (
            <Checkbox.Group className='ListTransfer-right' value={_targetSelectKeys} style={{ width: '100%' }} onChange={targetGroupOnChange}>
              <List
                className='ListTransfer-right-list'
                dataSource={filteredItems}
                renderItem={(item: any) => (
                  <List.Item>
                    <Checkbox
                      value={item.key}
                      onChange={(e: any) => targetOnChange(e, item.key)}>
                      {item.title}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Checkbox.Group>
          )
        }
      }}
    </Transfer>
  )
}

export default ListTransfer;