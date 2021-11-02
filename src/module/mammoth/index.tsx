import React from 'react';
import mammoth from 'mammoth';
import { Button } from 'antd';

export default class Mammoth extends React.Component {
  onClick() {
    mammoth.convertToHtml({ path: "./files/test.docx" }, { path: "./files/test.docx" })
      .then(function (result: any) {
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        console.log(html, '===', messages);
      })
      .done();
  }
  render() {
    return (
      <div>
        <Button onClick={this.onClick.bind(this)}>测试</Button>
      </div>
    )
  }
}