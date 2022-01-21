import React, { useState, useEffect, useRef } from "react";
import { Checkbox, List } from 'antd'
import classNames from 'classnames';
const THRESHOLD = 15;

const ListTemplate = (props: any) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(THRESHOLD);
  const [observer, setObserver] = useState(null as any);
  const $bottomElement = useRef<any>(null);
  const $topElement = useRef<any>(null);

  const {className, filteredItems, onItemSelect, selectKeys, groupOnChange} = props;

  useEffect(() => {
    intiateScrollObserver();
    return () => {
      resetObservation()
    }
  }, [start, end])

  const intiateScrollObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const Observer: any = new IntersectionObserver(callback, options)
    console.log($topElement.current, document.getElementById("top"), '===')
    if ($topElement.current) {
      Observer.observe($topElement.current);
    }
    if (document.getElementById("bottom")) {
      Observer.observe(document.getElementById("bottom"));
    }
    setObserver(Observer)
  }

  const callback = (entries: any, observer: any) => {
    entries.forEach((entry: any, index: number) => {
      const listLength = filteredItems.length;
      console.log("===", entry.target.id)
      // 向下滑动
      if (entry.isIntersecting && entry.target.id === "bottom") {
        const maxStartIndex = listLength - 1 - THRESHOLD;     // Maximum index value `start` can take
        const maxEndIndex = listLength - 1;                   // Maximum index value `end` can take
        const newEnd = (end + 10) <= maxEndIndex ? end + 10 : maxEndIndex;
        const newStart = (end - 5) <= maxStartIndex ? end - 5 : maxStartIndex;
        setStart(newStart)
        setEnd(newEnd)
      }
      // 向上滑动
      if (entry.isIntersecting && entry.target.id === "top") {
        const newEnd = end === THRESHOLD ? THRESHOLD : (end - 10 > THRESHOLD ? end - 10 : THRESHOLD);
        let newStart = start === 0 ? 0 : (start - 10 > 0 ? start - 10 : 0);
        setStart(newStart)
        setEnd(newEnd)
      }
    });
  }

  // 取消观察
  const resetObservation = () => {
    observer && observer.unobserve(document.getElementById("bottom"));
    observer && observer.unobserve(document.getElementById("top"));
  }

  const targetOnChange = (e: any, value: any) => {
    onItemSelect(value, e?.target?.checked);
  }

  const updatedList = filteredItems.slice(start, end);
  const lastIndex = updatedList.length - 1;

  return (
    <Checkbox.Group className={className} value={selectKeys} style={{ width: '100%' }} onChange={groupOnChange}>
      <List
        className={`${className}-list`}
        dataSource={updatedList}
        renderItem={(item: any, index: number) => {
          const id = index === 0 ? 'top' : (index === lastIndex ? 'bottom' : 'aa');
          if(index < start || index >= end) {
            return <></>
          }
          return (
            <List.Item id={id}>
              <Checkbox
                value={item.key}
                onChange={(e: any) => targetOnChange(e, item.key)}>
                <span ref={$topElement}>{item.title}</span>
              </Checkbox>
            </List.Item>
          )
        }}
      />
    </Checkbox.Group>
  );

}

export default ListTemplate;