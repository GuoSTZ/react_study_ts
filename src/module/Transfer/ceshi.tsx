import React from 'react';
import { SlidingWindowScrollHook } from "./SlidingWindowScrollHook";
 
function Ceshi() {
  let MY_ENDLESS_LIST = [];
  for(let i=0; i< 100; i++) {
    MY_ENDLESS_LIST.push({
      key: i,
      value: `title${i}`
    })
  }
  return (
    <div className="App">
     <h1>15个元素实现无限滚动</h1>
      <SlidingWindowScrollHook list={MY_ENDLESS_LIST} height={195}/>
    </div>
  );
}
 
export default Ceshi;