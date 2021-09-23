import * as React from 'react';
import {Table, Button, message, Form, Popconfirm} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColumnProps} from 'antd/lib/table/interface';
import {GetFieldDecoratorOptions} from 'antd/lib/form/Form';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import {HTMLAttributes} from 'react';

const FormItem = Form.Item;
const EditableContext = React.createContext({} as WrappedFormUtils);

const EditableRow: React.FunctionComponent<EditableRowProps> = ({
  form,
  index,
  ...props
}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

interface EditableRowProps
  extends HTMLAttributes<HTMLTableRowElement>,
    FormComponentProps {
  index: number;
}

const EditableFormRow = Form.create()(EditableRow);

declare type EditTableMode = 'full' | 'row'; // 全表格编辑 | 单行编辑

interface Item {
  key: string;
  [propName: string]: any;
}

interface ColumnsItem<T> extends ColumnProps<T> {
  dataIndex: string;
  editingStatus?: boolean;
  renderCol?: (text: string, row: T, instance: Object) => React.ReactNode;
  [propName: string]: any;
}

// type ColumnsItemWithoutRender<T> = Omit<ColumnsItem<T>, 'render'>;

/**
 * columns：表格列配置，必须
 * data: 数据数组，必须
 * mode: 编辑模式，非必须，默认为单行编辑
 */
interface EditTableProps<T> {
  /**
   * columns：表格列配置
   */
  columns: ColumnsItem<T>[];
  /**
   * 数据数组
   */
  data: T[];
  /**
   * 编辑模式
   */
  mode: EditTableMode;
  rowKey: string;
  hideOperation?: boolean;
  hideCancelConfirm?: boolean;
  onChangeWithOutForm?: (data: T[]) => void;
  onChange?: (data: T[]) => void;
  formatData4Form?: (data: T[]) => any;
  btnText?: {
    save?: string;
    add?: string;
    delete?: string;
    cancel?: string;
    edit?: string;
  };
  /**
   * 删除单条数据时触发的自定义方法
   */
  onDelete?: (data: T, callback: Function) => void;
  /**
   * 保存单条数据时触发的自定义方法
   */
  onSave?: (data: T, callback: Function) => void;
  /**
   * 可添加的数据条数最大值
   */
  maxNum?: number;
  /**
   * 表格数据达到最大值时的错误信息提示
   */
  maxErrorMsg?: string;
  /**
   * 设定数据新增在第一行或最后一行
   */
  direction?: 'top' | 'bottom';
  /**
   * 是否隐藏删除按钮的二次确认
   */
  hideDeleteConfirm?: boolean;
}

interface State<T> {
  data: T[];
  editingKey: string;
  keyList: string[];
  columns: ColumnsItem<T>[];
  currentPage?: number;
}

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
  // probably you might want to add the currentTarget as well
  // currentTarget: T;
};

type EditConfigFunctionType = (
  data: any,
  editingKey: any
) => GetFieldDecoratorOptions;

export default class EditTable<T extends Item> extends React.Component<
  EditTableProps<T>,
  State<T>
> {
  static defaultProps = {
    mode: 'row'
  };
  pageSize = 10; // 设定table的每页条数
  constructor(props: Readonly<EditTableProps<T>>) {
    super(props);
    this.state = {
      data: [],
      editingKey: '',
      keyList: [],
      columns: props.hideOperation
        ? []
        : [
            {
              title: '操作',
              dataIndex: '操作',
              render: (text: any, record: any, index: number) => {
                const editable = this.isEditing(record);
                if(this.props.mode === 'full') {
                  return (
                    <div>
                      {
                        this.state.data?.length > 1 && this.renderDeleteConfirmButton(props, record)
                      }
                      {
                        this.state.data?.length-1 === index && (
                          <EditableContext.Consumer>
                            {form => (
                              <a onClick={(e: any) => this.addNew(e, form)}>
                                {props.btnText?.add
                                  ? props.btnText?.add
                                  : '添加'}
                            </a>
                            )}
                          </EditableContext.Consumer>
                        )
                      }
                    </div>
                  );
                } else {
                  return (
                    <div>
                      {editable ? (
                        <span>
                          <EditableContext.Consumer>
                            {form => (
                              <a
                                onClick={() => this.save(form, record.key)}
                                style={{marginRight: 8}}>
                                {props.btnText?.save
                                  ? props.btnText?.save
                                  : '保存'}
                              </a>
                            )}
                          </EditableContext.Consumer>
                          <EditableContext.Consumer>
                            {form =>
                              !props.hideCancelConfirm ? (
                                <Popconfirm
                                  title='确认取消?'
                                  onConfirm={() => this.cancel(form, record.key)}>
                                  <a>
                                    {props.btnText?.cancel
                                      ? props.btnText?.cancel
                                      : '取消'}
                                  </a>
                                </Popconfirm>
                              ) : (
                                <a onClick={() => this.cancel(form, record.key)}>
                                  {props.btnText?.cancel
                                    ? props.btnText?.cancel
                                    : '取消'}
                                </a>
                              )
                            }
                          </EditableContext.Consumer>
                        </span>
                      ) : (
                        <span>
                          <a
                            style={{marginRight: 8}}
                            onClick={() => this.edit(record.key)}>
                            {props.btnText?.edit ? props.btnText?.edit : '编辑'}
                          </a>
                          {this.renderDeleteConfirmButton(props, record)}
                        </span>
                      )}
                    </div>
                  );
                }
              }
            }
          ],
      currentPage: 1
    };
  }

  renderDeleteConfirmButton(props: Readonly<EditTableProps<T>>, record: any) {
    if(props.hideDeleteConfirm) {
      return (
        <a style={{marginRight: 8}} onClick={() => this.delete(record.key, 'delete')}>
          {props.btnText?.delete
            ? props.btnText?.delete
            : '删除'}
        </a>
      )
    } else {
      return (
        <Popconfirm
          title='确认删除?'
          onConfirm={() => this.delete(record.key, 'delete')}>
          <a style={{marginRight: 8}}>
            {props.btnText?.delete
              ? props.btnText?.delete
              : '删除'}
          </a>
        </Popconfirm>
      )
    }
  }

  componentDidMount() {
    /* istanbul ignore else */
    if (this.props.columns && this.props.columns.length > 0) {
      this.setState(
        {
          data: this.compileData(this.props.data),
          columns: [...this.props.columns, ...this.state.columns]
        },
        () => {
          let keyList = this.state.columns.map(c => c.dataIndex);
          this.setState({
            keyList
          });
        }
      );
    }
  }

  compileData(data: any[]) {
    const {rowKey} = this.props;
    if (!data) {
      return [];
    }
    return data.map
      ? data.map((it: any, idex: number) => ({
          ...it,
          key: it[rowKey]
        }))
      : [];
  }
  UNSAFE_componentWillReceiveProps(nextprops: Readonly<EditTableProps<T>>) {
    /* istanbul ignore else */
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextprops.data)) {
      this.setState({
        data: this.compileData(nextprops.data),
        editingKey: ''
      });
    }
  }

  isEditing = (record: Item) => {
    // isEditing = <T extends unknown>(record: {key:T}) => {
    return record.key === this.state.editingKey;
  };

  edit = (key: string) => {
    if (this.state.editingKey !== '') {
      message.error('请先保存编辑项再进行其他编辑操作！');
      return false;
    }
    this.setState({editingKey: key});
    this.activeStatus();
  };

  // 双击td事件
  editColumn = (key: string) => {
    if (this.state.editingKey !== '') {
      message.error('请先保存编辑项再进行其他编辑操作！');
      return false;
    }
    this.setState({editingKey: key});
  };

  // changeColumnEditStatus = (record: Item, tdObject: any) => {
  //   this.editColumn(record.key);
  //   this.state.columns.forEach((item: any) => {
  //     /* istanbul ignore else */
  //     if (item.dataIndex === tdObject.dataIndex) {
  //       item.editingStatus = true;
  //     }
  //   });
  // };

  revertStatus() {
    // 恢复每一列的编辑状态，去除所有editingStatus
    this.state.columns.map(
      (item: ColumnsItem<T>) => (item.editingStatus = false)
    );
  }

  activeStatus() {
    // 激活每一列的编辑状态，所有列editingStatus设为true
    this.state.columns.map(
      (item: ColumnsItem<T>) => (item.editingStatus = true)
    );
  }

  delete(key: string, type: string) {
    const {onDelete, mode} = this.props;
    if (type === 'delete' && this.state.editingKey !== '' && mode === 'row') {
      message.error('请先保存编辑项再进行其他删除操作！');
      return false;
    }
    let newData = [...this.state.data];
    if (onDelete && type === 'delete') {
      const deleteData = this.state.data?.filter(c => c.key === key)[0];
      onDelete(deleteData, (status: boolean) => {
        // 如果返回为false，则不继续执行前端数据删除操作
        if (status === true) {
          this.setState(
            {
              data: newData.filter(c => c.key !== key),
              editingKey: ''
            },
            () => {
              this.handleChangeData(this.state.data);
            }
          );
        }
      });
      return;
    }
    this.setState(
      {
        data: newData.filter(c => c.key !== key),
        editingKey: ''
      },
      () => {
        this.handleChangeData(this.state.data);
      }
    );
  }
  save(form: WrappedFormUtils, key: string) {
    const {onSave} = this.props;
    form.validateFields((error: any, row: T) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex((item: Item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          key: item.key
        });
      } else {
        newData.push(row);
      }
      if (onSave) {
        onSave(newData[index], (status: boolean) => {
          // 如果返回为false，则不继续执行前端数据保存操作
          if (status === true) {
            this.setState({data: newData, editingKey: ''}, () => {
              this.handleChangeData(newData);
            });
          }
        });
        return;
      }
      this.setState({data: newData, editingKey: ''}, () => {
        this.handleChangeData(newData);
      });
    });
  }

  handleChangeData(data: any) {
    const {onChange, formatData4Form, onChangeWithOutForm} = this.props;
    if (onChangeWithOutForm !== undefined) {
      onChangeWithOutForm(data);
      return false;
    }
    if (onChange === undefined) {
      return false;
    }
    if (formatData4Form !== undefined) {
      onChange(formatData4Form(data));
      return false;
    }
    onChange(data);
  }

  cancel = (form: WrappedFormUtils, key: string) => {
    let obj = this.state.data.filter(d => d.key === key)[0];
    let Bdelete = false;
    for (let b in obj) {
      if (obj[b] === '') {
        Bdelete = true;
        break;
      }
    }
    if (Bdelete) {
      this.delete(key, 'cancel');
    }
    this.setState({editingKey: ''});

    this.revertStatus();
  };

  addNew = (e: any, form?: WrappedFormUtils) => {
    const {mode, maxNum, maxErrorMsg} = this.props;
    if (this.state.editingKey !== '' && mode === 'row') {
      message.error('请先保存编辑项再进行添加操作！');
      return false;
    }
    // 如果是全表单编辑模式下
    if(mode === 'full') {
      let fullFlag = false;
      form?.validateFields((error: any, row: T) => {
        if (error) {
          return;
        }
        fullFlag = true;
      });
      if(!fullFlag) {
        return;
      }
    }
    if(maxNum && this.state.data?.length >= maxNum) {
      message.error(maxErrorMsg || `最多可添加${maxNum}条数据`);
      return;
    }
    let key = new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1);
    let obj: any = {
      key: key
    };
    let keyList = [...this.state.keyList];
    /* istanbul ignore else */
    if (keyList.length > 1) {
      keyList.length = keyList.length - 1;
    }
    keyList.forEach(d => {
      obj[d] = '';
    });
    let data = [];
    if (this.props.direction === 'bottom') {
      data = [...this.state.data, obj];
      // 默认页数为10条，该属性为默认配置不暴露，故此处直接设为10来处理
      const page = Math.ceil(data?.length / this.pageSize);
      this.setState({
        currentPage: page
      });
    } else {
      data = [obj, ...this.state.data];
      this.setState({
        currentPage: 1
      });
    }
    // data.push(obj);
    this.setState({
      data,
      editingKey: key
    });

    this.activeStatus();
  };

  // 根据外界传入的editConfig来处理，当前仅接受对象和方法
  renderEditConfig(
    config: GetFieldDecoratorOptions | EditConfigFunctionType,
    form: WrappedFormUtils
  ): GetFieldDecoratorOptions | null {
    if (Object.prototype.toString.call(config) === '[object Object]') {
      // @ts-ignore
      return config;
    } else if (Object.prototype.toString.call(config) === '[object Function]') {
      // @ts-ignore
      return config(this.state.data, this.state.editingKey, form);
    } else {
      return {};
    }
  }

  pageOnChange(page: number, pageSize?: number) {
    this.setState({
      currentPage: page
    });
  }

  renderCell(text: string, record: Item, cellConfig: ColumnsItem<T>) {
    const {dataIndex, editComponent, editConfig} = cellConfig;
    const instance = this;
    const {data} = this.state;
    const {mode} = this.props;
    return (
      <EditableContext.Consumer>
        {(form: WrappedFormUtils) => {
          const {getFieldDecorator, setFieldsValue} = form;
          const component = editComponent(text, record, instance, form, data);
          return (
            <FormItem style={{margin: 0}}>
              {getFieldDecorator(dataIndex, {
                ...this.renderEditConfig(editConfig, form),
                initialValue:
                  record[dataIndex] === ''
                    ? editConfig &&
                      this.renderEditConfig(editConfig, form)?.initialValue
                    : record[dataIndex]
              })(
                React.createElement(component.type, {
                  ...component.props,
                  ...(mode !== 'row'
                    ? {
                        onChange: function(
                          e: HTMLElementEvent<HTMLInputElement>
                        ) {
                          // e is event
                          if (e.target) {
                            setFieldsValue({[dataIndex]: e.target.value});
                          } else {
                            setFieldsValue({[dataIndex]: e});
                          }
                          instance.save(form, record.key);
                        }
                      }
                    : {})
                })
              )}
            </FormItem>
          );
        }}
      </EditableContext.Consumer>
    );
  }

  isRenderFooter() {
    const {mode, maxNum, btnText} = this.props;
    if(mode === 'row') {
      return {
        footer: () => (
          <Button
            icon='plus'
            onClick={this.addNew}
            style={{width: '100%'}}>
            {btnText?.add ? btnText?.add : '新增'}
          </Button>
        )
      };
    } else {
      return {};
    }
  }

  render() {
    const {
      data,
      columns,
      mode,
      onChange,
      btnText,
      maxNum,
      ...otherProps
    } = this.props;
    const components = {
      body: {
        row: EditableFormRow
        // cell: EditableCell
      }
    };
    const instance = this;

    const columnsFinal = this.state.columns.map((col: ColumnsItem<T>) => {
      if (col.editComponent === undefined) {
        return col;
      }
      return {
        ...col,
        // onCellClick: (record,index)=>{
        //   console.log(record,index)
        // },
        render: (text: string, row: T) => {
          return mode === 'full' || this.isEditing(row)
            ? this.renderCell(text, row, col)
            : // ts 中 render 为table clumns 关键字，用renderCol 替换
            // : col.render
            // ? col.render(text, row, instance)
            col.renderCol
            ? col.renderCol(text, row, instance)
            : text;
        }
      };
    });

    return (
      <Table
        components={components}
        bordered
        dataSource={this.state.data}
        columns={columnsFinal}
        pagination={{
          pageSize: this.pageSize,
          current: this.state.currentPage,
          onChange: this.pageOnChange.bind(this)
        }}
        rowClassName={(record: object, index: number) => mode === 'row' ? 'editable-row' : 'editTable-full'}
        {...otherProps}
        {...this.isRenderFooter()}
      />
    );
  }
}
