import React, { useState } from 'react';
import { Transfer, Checkbox, message } from 'antd';

const mockData: any[] = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
  });
}

const TransferView: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState([] as any);
  const [sourceSelectedKeys, setSourceSelectedKeys] = useState([]);
  const [targetSelectedKeys, setTargetSelectedKeys] = useState([]);
  const [checkStatus, setCheckStatus] = useState(false);

  const onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
    if(nextTargetKeys?.length > 10) {
      message.error("最多添加10条数据");
      setSourceSelectedKeys(sourceSelectedKeys);
      return;
    }
    setCheckStatus(false);
    setTargetKeys(nextTargetKeys);
  }

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSourceSelectedKeys(sourceSelectedKeys);
    setTargetSelectedKeys(targetSelectedKeys);
  }

  const checkOnChange = (e: any) => {
    setCheckStatus(e?.target?.checked);
    const sourceKeys = mockData?.map((item: any) => item.key)?.filter((item: any) => !targetKeys?.includes(item));
    const sourceKeysFor5: any = sourceKeys?.slice(0, 10);
    e?.target?.checked ? setSourceSelectedKeys(sourceKeysFor5) : setSourceSelectedKeys([]);
  }

  return (
    <Transfer 
      dataSource={mockData}
      targetKeys={targetKeys}
      selectedKeys={[].concat(sourceSelectedKeys, targetSelectedKeys)}
      render={(item: any) => item.title}
      // @ts-ignore
      titles={[<Checkbox checked={checkStatus} onChange={checkOnChange}>选中前10条</Checkbox>, 'target']}
      onChange={onChange}
      onSelectChange={onSelectChange}
      listStyle={{width: 400, height: 400}}
    />
  )
}

export default TransferView;