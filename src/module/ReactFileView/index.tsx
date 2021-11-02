import React from 'react';
import FileViewer from 'react-file-viewer';
// import wordFile from './files/test.docx';

// const wordFile = `./files/test.docx`;

export default class ReactFileView extends React.Component {
  render() {
    return (
      <FileViewer fileType='docx'
        // filePath={wordFile}
        filePath={"https://guostz.github.io/Tuan/files/test.docx"}
        // onError={this.onError.bind(this)}
        errorComponent={console.log("出现错误")}
        unsupportedComponent={console.log("不支持")}
      />
    )
  }
} 