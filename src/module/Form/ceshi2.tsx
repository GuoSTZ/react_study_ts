import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
// import { Card, Table, Tabs, Form, message, DatePicker, Input, Select, Button, Divider, Modal, Pagination, Icon, Upload, Popconfirm } from 'antd';

// let obj: any = {};              //重要!!!!!
// const FormItem = Form.Item;
// const TabsPane = Tabs.TabPane;
// const { Option } = Select;
// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 3 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 21 },
//   },
// };

// @connect(({ testQuestions, loading, }: any) => ({
//   testQuestions,
//   loading: loading.models.testQuestions,
//   submitting: loading.effects['form/submitAdvancedForm'],
// }))

// class EditArticle extends PureComponent<any, any> {
//   state = {
//     testQuestionOptionList: [{ quesOption: '', flag: 'A' }],//存选项 重要!!!!!
//     eg: ['A', 'B', 'C', 'D'],//限制最多录四个
//     page: 1,
//     id: '',

//   };

//   componentDidMount() {
//     const { testQuestions: { txt } } = this.props;
//     if (txt && txt.testQuestionOptionList.length != 0) {
//       this.setState({
//         testQuestionOptionList: txt.testQuestionOptionList
//       })
//     }

//   }

//   handleCancel = (e: any) => {
//     const { popHide } = this.props
//     popHide()
//   }

//   onValidateForm = () => {
//     const { validateFields } = this.props.form;
//     const { popHide, editId } = this.props

//     validateFields((err: any, values: any) => {
//       if (editId) {
//         values.id = editId
//       }
//       values.testQuestionOptionList = this.state.testQuestionOptionList
//       if (!err) {
//         this.props.dispatch({
//           type: 'testQuestions/newOne',
//           payload: values,
//         }).then(() => {
//           this.props.form.resetFields()
//           popHide()
//           this.props.dispatch({
//             type: 'testQuestions/getQuestionList',
//             payload: {
//               rows: 10,
//               page: 1,
//             },
//           });
//         })
//       }
//     });
//   }

//   //录入问题答案-开始
//   handleFormChange = (changedFields: any, val: any) => {      //重要!!!!!
//     //内层表单，根据操作的form的index，修改并赋值对应的input
//     //val 即 当前操作form的index ，changedFields  即 当前操作form的input
//     const { testQuestionOptionList } = this.state
//     let testQuestionOptionListArr = testQuestionOptionList
//     if (changedFields['quesOption']) {
//       obj['index' + val] = { quesOption: changedFields['quesOption'].value, flag: changedFields['quesOption'].flag }
//     }
//     testQuestionOptionListArr[val] = { ...testQuestionOptionListArr[val], ...obj['index' + val] }
//     this.setState({
//       testQuestionOptionList: testQuestionOptionListArr
//     })
//     console.log(testQuestionOptionListArr)
//   }
//   remove = (index: any) => {
//     console.log('del', index)
//     const { testQuestionOptionList } = this.state
//     let arr = [...testQuestionOptionList]
//     arr.splice(index, 1)
//     this.setState({
//       testQuestionOptionList: arr
//     })
//   }
//   add = (index: any) => {
//     //testQuestionOptionList:[{quesOption:''}],

//     const { testQuestionOptionList, eg } = this.state
//     let arr = [...testQuestionOptionList]
//     if (arr.length >= 4) {
//       message.info('最多四个！')
//       return false
//     }
//     arr.push({ quesOption: '', flag: eg[arr.length] })
//     this.setState({
//       testQuestionOptionList: arr
//     })
//     console.log('add', testQuestionOptionList)
//   }
//   //录入问题答案-结束


//   render() {
//     const { testQuestions: { data, txt }, loading, form } = this.props;
//     const { validateFields, getFieldDecorator } = form;
//     const { testQuestionOptionList, eg } = this.state;

//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 4 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//       },
//     };
//     //录入问题 -开始
//     const CustomizedForm = Form.create({            //重要!!!!!    
//       onFieldsChange(props: any, changedFields: any) {
//         props.onChange(changedFields);
//       },
//       mapPropsToFields(props) {
//         const { index } = props
//         console.log(eg[index])
//         return {
//           quesOption: Form.createFormField({
//             value: props.quesOption,
//             flag: eg[index]
//           }),

//         };
//       },
//       onValuesChange(_, values) {
//         console.log(values);
//       },
//     })((props) => {
//       const { getFieldDecorator } = props.form;
//       const { index } = props
//       return (
//         <Form >
//           <Form.Item label='选项' {...formItemLayout}>
//             {getFieldDecorator('quesOption', {
//               rules: [{ required: true, message: 'quesOption is required!' }],
//             })(<Input style={{ width: '95%' }} />)}
//             {testQuestionOptionList.length > 1 && index > 0 ? (
//               <Icon
//                 className="dynamic-delete-button"
//                 type="minus-circle-o"
//                 style={{ fontSize: '20px', position: 'absolute', top: '-1px', marginLeft: '10px' }}
//                 // disabled={testQuestionOptionList.length === 1}
//                 onClick={() => this.remove(index)}
//               />
//             ) : (
//               <Icon
//                 className="dynamic-delete-button"
//                 type="plus-circle-o"
//                 style={{ fontSize: '20px', position: 'absolute', top: '-1px', marginLeft: '10px' }}
//                 // disabled={testQuestionOptionList.length === 1}
//                 onClick={() => this.add(index)}
//               />
//             )}
//           </Form.Item>

//         </Form>
//       );
//     });
//     //录入问题-结束

//     return (
//       <div>
//         <Card bordered={false}>
//           <Form onSubmit={this.onValidateForm}>
//             <Form.Item label='问题标题' {...formItemLayout}>
//               {getFieldDecorator('question', {
//                 rules: [{ required: true, message: '请输入' }],
//                 initialValue: txt ? txt.testQuestion.question : '',
//               })(
//                 <Input></Input>
//               )}
//             </Form.Item>
//             { //循环加载内层 From
//               testQuestionOptionList.map((item, i) => (<CustomizedForm {...item} index={i} onChange={(e) => this.handleFormChange(e, i)} />))
//             }
//             <Form.Item label='正确答案' {...formItemLayout}>
//               {getFieldDecorator('answerFlag', {
//                 rules: [{ required: true, message: '请输入' }],
//                 initialValue: txt ? txt.testQuestion.answerFlag : '',
//               })(
//                 <Select>
//                   {testQuestionOptionList.map((item) => (<Option value={item.flag}>{item.flag}</Option>))}
//                 </Select>
//               )}
//             </Form.Item>
//             <Form.Item label='答案解析' {...formItemLayout}>
//               {getFieldDecorator('analysis', {
//                 rules: [{ required: true, message: '请输入' }],
//                 initialValue: txt ? txt.testQuestion.analysis : '',
//               })(
//                 <Input></Input>
//               )}
//             </Form.Item>
//             <Form.Item label='问题类型' {...formItemLayout}>
//               {getFieldDecorator('type', {
//                 rules: [{ required: true, message: '请输入' }],
//                 initialValue: txt ? txt.testQuestion.type + '' : '',
//               })(
//                 <Select>
//                   <Option value="1">文章类问题</Option>
//                   <Option value="2">测试类问题</Option>
//                 </Select>
//               )}
//             </Form.Item>

//             <div span={24} style={{ textAlign: 'right' }}>
//               <Button type="primary" onClick={this.handleCancel} offset={16}>返回</Button>
//               <Button type="primary" onClick={this.onValidateForm} style={{ marginLeft: 8 }} offset={20}>提交</Button>
//             </div>

//           </Form>
//         </Card>
//       </div>
//     );
//   }
// }


// const TestView = Form.create()(EditArticle);

// export default TestView;