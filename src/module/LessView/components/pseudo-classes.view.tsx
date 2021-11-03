import React from 'react';
import '../less/pseudo-classes.less';

export default class PseudoClassView extends React.Component {

  render() {
    return (
      <div className="PseudoClassView">
        {/* 伪类 */}
        <div className="hover-div">鼠标悬停</div>
        <div className="a-div">
          <a href="#1">链接</a>
        </div>
        <div className="focus-div">
          <input placeholder="焦点获取" />
        </div>
        <div className="child-div">

          <div>
            <a>第一个孙子元素a</a>
            <p>第二个孙子元素p</p>
          </div>

          <div>
            <p>第三个孙子元素p</p>
          </div>

          <p>第一个子元素p</p>
          <p>第二个子元素p</p>
          <a>第三个子元素a混入其中</a>
          <p>第四个子元素p</p>

          <ul>
            <li>第五个元素是一个li</li>
            <li>第六个元素另一个li</li>
          </ul>

        </div>
        <div className="not-div">
          <section>111</section>
          <section>222</section>
          <p>p标签乱入</p>
          <section>333</section>
          <section>444</section>
        </div>

        {/* 伪元素 */}
        <div className="selection-div">床前明月光，疑是地上霜。举头望明月，低头思故乡。</div>
      </div>
    )
  }
}