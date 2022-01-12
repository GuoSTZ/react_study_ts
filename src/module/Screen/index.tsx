import React, { useState } from 'react';
import { FullScreen } from '@mcfed/components';
import Center from './components/Center';
import FlyingLine from './components/FlyingLine';
import { Header, Left } from './components';
import './index.less';

interface ScreenViewProps {

}

const ScreenView: React.FC = (props: ScreenViewProps) => {
  const [fullscreen, setFullscreen] = useState(false as boolean);
  return (
    <FullScreen
      className='screenView'
      fullscreen={fullscreen}
      onChange={(isFull: any) => {
        console.log(isFull, '===')
        if (!isFull) {
          setFullscreen(false)
        }
      }}>
      <div className='large-screen'>
        <Header />
        <Left />
      </div>
    </FullScreen>

  )
}

export default ScreenView;