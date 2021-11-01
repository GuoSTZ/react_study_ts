import React from "react";
import "../less/built-in-function.less";

export default class BuiltInFunction extends React.Component {
  render() {
    return (
      <div className="BuiltInFunction">
        <div className="built-in">hello world!</div>
        <ul className="colorList">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="extract"></div>
        <div className="range"></div>
        <ul className="colorList-range">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="svg-gradient"></div>
      </div>
    )
  }
}