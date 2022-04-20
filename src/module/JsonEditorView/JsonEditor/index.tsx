import React, {useEffect} from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import './index.less';

export interface JsonEditorProps {
  value?: any;
  onChange?: any;
  onError?: any;
}

const JsonEditor: React.FC<JsonEditorProps> = props => {
  let container: any = React.useRef(null);
  let jsoneditor: any = null;

  const {value = {}, onChange, onError} = props;
  useEffect(() => {
    initJsonEditor();
    return () => {
      jsoneditor && jsoneditor.destroy();
    };
  }, []);

  useEffect(() => {
    jsoneditor && jsoneditor.update(value);
  }, [value]);

  const handleOnChange = () => {
    try {
      let _value = jsoneditor && jsoneditor.get();
      onChange && onChange(_value);
    } catch (e) {
      console.warn('输入格式错误');
    }
  };

  const handleOnError = (error: any) => {
    onError && onError(error);
  };

  const initJsonEditor = () => {
    const options: any = {
      mode: 'code',
      history: true,
      onChange: handleOnChange,
      onValidationError: handleOnError
    };
    jsoneditor = new JSONEditor(container, options);
    jsoneditor && jsoneditor?.set(value);
  };

  return <div className='jsonedit-wrap' ref={ref => (container = ref)} />;
};

export default JsonEditor;
