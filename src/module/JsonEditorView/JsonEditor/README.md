```js
// create the editor
const container = document.getElementById('jsoneditor');
// 需要装载的元素需要选中

// 参数支持
const options = {
  mode: 'code', // 代码模式:可以全部编辑所有内容
  // mode:'form', //表格模式，只能修改value模式
  // mode:"text",
  // mode:"view",
  // mode:"preview", // 预览模式，可以支持超大的json文本传入
  onChange() {
    // 装载的json发生修改之后触发
  },
  onChangeJSON(json) {
    // 装载的json发生修改之后触发，传递一个改变之后的json
  },
  onChangeText(jsonString) {
    // 返回一个字符串
  },
  // 只能是用户主动的修改才会触发，程序改变的情况下不会触发，比如set,setText,update,updateText
  onError(error) {
    coonsole.log('发生了报错');
  },
  onModeChange(newMode, oldMode) {
    // 发生了更改模式立即触发的函数
  },
  onValidate(json) {
    var errors = [];
    if (json && json.params) {
      console.log('正确');
    } else {
      console.log('修改失败');
    }
    // 每次修改json之后应该判断一下数据结构是否是正确的
  },
  history: false,
  mainMenuBar: false,
  navigationBar: false,
  statusBar: false
};

// 显示的数据
const initialJson = {
  Array: [1, 2, 3],
  Boolean: true,
  Null: null,
  Number: 123,
  Object: {a: 'b', c: 'd'},
  String: 'Hello World'
};
const editor = new JSONEditor(container, options, initialJson);
// 可以自定的时候就传一份默认的进去

// editor.set(initialJson)
// 也可以使用这个方法后期注入

//获得修改之后的数据
const updatedJson = editor.get();
editor.expandAll();
```
