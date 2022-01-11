import React, {memo} from 'react';
import './index.less';

const Header: React.FC = () => {
  return (
    <div className='Header'>
      <h1>数据库防火墙防水坝</h1>
    </div>
  )
}

export default memo(Header);
