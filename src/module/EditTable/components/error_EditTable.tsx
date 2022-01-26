import * as React from 'react';
import {Table, Button, message, Form, Popconfirm} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {ColumnProps} from 'antd/lib/table/interface';
import {GetFieldDecoratorOptions} from 'antd/lib/form/Form';
import {WrappedFormUtils} from 'antd/lib/form/Form';
import {HTMLAttributes} from 'react';
import './style/check.less';

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

const EditableFormRow = function(others: any) {
  return Form.create({
    onFieldsChange: function(props, changedFields, allFields) {
      if (changedFields && 'onSearch' in others) {
        others.onSearch(allFields);
      }
    }
  })(EditableRow);
};
const _EditableFormRow = Form.create()(EditableRow);

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
  /**
   * 自定义主键
   */
  rowKey: string;
  /**
   * 隐藏操作按钮
   */
  hideOperation?: boolean;
  /**
   * 隐藏取消按钮的二次确认
   */
  hideCancelConfirm?: boolean;
  /**
   * 数据抛出方法自定义
   */
  onChangeWithOutForm?: (data: T[]) => void;
  /**
   * 数据抛出到父级组件，通常为form表单
   */
  onChange?: (data: T[]) => void;
  /**
   * 导出数据的格式自定义
   */
  formatData4Form?: (data: T[]) => any;
  /**
   * 按钮文字自定义
   */
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
  /**
   * 是否隐藏编辑按钮
   */
  hideEditBtn?: boolean;
  /**
   * 点击编辑时是否要清空阿里云key值
   */
  emptyRacAliyunKeyFlag?: boolean;
  /**
   * 是否隐藏add按钮
   */
  hideAddBtn?: boolean;
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
              className: 'operation',
              render: (text: any, record: any, index: number) => {
                const editable = this.isEditing(record);
                if (this.props.mode === 'full') {
                  return (
                    <div className='operation-button-full'>
                      {this.renderAddAndDeleteButton('delete', index) &&
                        this.renderDeleteConfirmButton(props, record)}
                      {this.renderAddAndDeleteButton('add', index) && (
                        <EditableContext.Consumer>
                          {form => (
                            <a onClick={(e: any) => this.addNew(e, form)}>
                              {props.btnText?.add ? props.btnText?.add : '添加'}
                            </a>
                          )}
                        </EditableContext.Consumer>
                      )}
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
                              this.props?.hideCancelConfirm === false ||
                              !JSON.parse(
                                localStorage.getItem('hideCancelConfirm') ||
                                  'true'
                              ) ? (
                                <Popconfirm
                                  title='确认取消?'
                                  onConfirm={() =>
                                    this.cancel(form, record.key)
                                  }>
                                  <a>
                                    {props.btnText?.cancel
                                      ? props.btnText?.cancel
                                      : '取消'}
                                  </a>
                                </Popconfirm>
                              ) : (
                                <a
                                  onClick={() => this.cancel(form, record.key)}>
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
                          {!props.hideEditBtn && (
                            <a
                              style={{marginRight: 8}}
                              onClick={() => this.edit(record.key)}>
                              {props.btnText?.edit
                                ? props.btnText?.edit
                                : '编辑'}
                            </a>
                          )}
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
    if (props.hideDeleteConfirm) {
      return (
        <a
          style={{marginRight: 8}}
          onClick={() => this.delete(record.key, 'delete')}>
          {props.btnText?.delete ? props.btnText?.delete : '删除'}
        </a>
      );
    } else {
      return (
        <Popconfirm
          title='确认删除?'
          onConfirm={() => this.delete(record.key, 'delete')}>
          <a style={{marginRight: 8}}>
            {props.btnText?.delete ? props.btnText?.delete : '删除'}
          </a>
        </Popconfirm>
      );
    }
  }

  renderAddAndDeleteButton(type: 'add' | 'delete', index: number) {
    const {direction} = this.props;
    if (type === 'add') {
      if (direction === 'bottom') {
        return this.state.data?.length - 1 === index;
      } else {
        return index === 0;
      }
    } else {
      return this.state.data?.length - 1 > 0;
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
    const rowKey = this.props.rowKey || 'key';
    if (!data) {
      return [];
    }
    // 全编辑表格模式数据初始化
    if (this.props.mode === 'full') {
      if (data?.length === 0) {
        let key =
          new Date().valueOf() + '' + Math.floor(Math.random() * 10 + 1);
        let columns = [...this.props.columns];
        let obj: any = { key };
        columns.forEach((d: any) => {
          obj[d?.dataIndex] = '';
        });
        return [obj];
      }
    }
    return data.map
      ? data.map((it: any, idex: number) => ({
          ...it,
          key: it[rowKey]
        }))
      : [];
  }
  UNSAFE_componentWillReceiveProps(nextprops: Readonly<EditTableProps<T>>) {
    const list = [
      {
        title: '操作',
        dataIndex: '操作',
        className: 'operation',
        render: (text: any, record: any, index: number) => {
          const editable = this.isEditing(record);
          if (this.props.mode === 'full') {
            return (
              <div className='operation-button-full'>
                {this.renderAddAndDeleteButton('delete', index) &&
                  this.renderDeleteConfirmButton(this.props, record)}
                {this.renderAddAndDeleteButton('add', index) && (
                  <EditableContext.Consumer>
                    {form => (
                      <a onClick={(e: any) => this.addNew(e, form)}>
                        {this.props.btnText?.add
                          ? this.props.btnText?.add
                          : '添加'}
                      </a>
                    )}
                  </EditableContext.Consumer>
                )}
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
                          {this.props.btnText?.save
                            ? this.props.btnText?.save
                            : '保存'}
                        </a>
                      )}
                    </EditableContext.Consumer>
                    <EditableContext.Consumer>
                      {form =>
                        this.props?.hideCancelConfirm === false ||
                        !JSON.parse(
                          localStorage.getItem('hideCancelConfirm') || 'true'
                        ) ? (
                          <Popconfirm
                            title='确认取消?'
                            onConfirm={() => this.cancel(form, record.key)}>
                            <a>
                              {this.props.btnText?.cancel
                                ? this.props.btnText?.cancel
                                : '取消'}
                            </a>
                          </Popconfirm>
                        ) : (
                          <a onClick={() => this.cancel(form, record.key)}>
                            {this.props.btnText?.cancel
                              ? this.props.btnText?.cancel
                              : '取消'}
                          </a>
                        )
                      }
                    </EditableContext.Consumer>
                  </span>
                ) : (
                  <span>
                    {!this.props.hideEditBtn && (
                      <a
                        style={{marginRight: 8}}
                        onClick={() => this.edit(record.key)}>
                        {this.props.btnText?.edit
                          ? this.props.btnText?.edit
                          : '编辑'}
                      </a>
                    )}
                    {this.renderDeleteConfirmButton(this.props, record)}
                  </span>
                )}
              </div>
            );
          }
        }
      }
    ];

    /* istanbul ignore else */
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextprops.data)) {
      this.setState({
        data: this.compileData(nextprops.data),
        editingKey: ''
      });
    }

    // hideOperation改变需要重新设置columns
    if (this.props.hideOperation !== nextprops.hideOperation) {
      if (nextprops.hideOperation === false) {
        this.setState({
          columns: [...this.state.columns, ...list]
        });
      }
    }
  }

  isEditing = (record: Item) => {
    // isEditing = <T extends unknown>(record: {key:T}) => {
    return record.key === this.state.editingKey;
  };

  edit = (key: string) => {
    const {emptyRacAliyunKeyFlag} = this.props;

    if (this.state.editingKey !== '') {
      message.error('请先保存编辑项再进行其他编辑操作！');
      return false;
    }

    if (emptyRacAliyunKeyFlag) {
      this.emptyRacAliyunKey(key);
    }

    this.setState({
      editingKey: key
    });

    this.activeStatus();
  };

  // 清空阿里云key的值
  emptyRacAliyunKey = (key: string) => {
    const newData = [...this.state.data];

    newData.map((item: any) => {
      if (item.racAliyunKey && item.key === key) {
        item.racAliyunKey = undefined;
      }
    });

    this.setState({
      data: newData
    });
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

  // 重复代码抽出
  handleDataForSave(newRow: any, key: string) {
    const newData = [...this.state.data];
    const index = newData.findIndex((item: Item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...newRow,
        key: item.key
      });
    } else {
      newData.push(newRow);
    }
    return newData;
  }

  save(form: WrappedFormUtils, key: string) {
    const {onSave, mode} = this.props;
    // 全编辑表格模式下，不需要子项触发onChange时，对一行内的其他子项进行规则校验
    if(mode === 'full') {
      const full_row: any = form.getFieldsValue();
      const newData = this.handleDataForSave(full_row, key);
      this.setState({data: newData, editingKey: ''}, () => {
        this.handleChangeData(newData);
      });
      return;
    }

    form.validateFields((error: any, row: T) => {
      if (error) {
        return;
      }
      const index = [...this.state.data].findIndex((item: Item) => key === item.key);
      const newData = this.handleDataForSave(row, key);
      if (onSave && mode === 'row') {
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

  // 获取字段的initialValue值，全编辑表格模式下，需要将该值初始化到新增的数据中
  // 使用该方法原因：当前最外层的Form收集数据时，无法触发内部子项的校验，故只能在新增的时候，直接进行数据初始化
  getColumnInitialValue() {
    const columns = this.props.columns;
    const configs = columns?.map((item: any) => ({
      dataIndex: item.dataIndex,
      config: this.renderEditConfig(item.editConfig, {}, {} as any)
    }));
    let obj: any = {};
    configs?.map((item: any) => {
      obj[item.dataIndex] = item.config?.initialValue
    });
    return obj;
  }

  addNew = (e: any, form?: WrappedFormUtils) => {
    const {mode, maxNum, maxErrorMsg} = this.props;
    if (this.state.editingKey !== '' && mode === 'row') {
      message.error('请先保存编辑项再进行添加操作！');
      return false;
    }
    localStorage.setItem('hideCancelConfirm', 'true');
    // 如果是全表单编辑模式下
    if (mode === 'full') {
      let fullFlag = false;
      form?.validateFields((error: any, row: T) => {
        if (error) {
          return;
        }
        fullFlag = true;
      });
      // 如果当前行有校验未通过的子项，则无法新增行
      if (!fullFlag) {
        return;
      }
    }
    if (maxNum && this.state.data?.length >= maxNum) {
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
    keyList.forEach((d: any) => {
      if(mode === 'full') {
        obj[d] = this.getColumnInitialValue()[d] ?? '';
        return;
      }
      obj[d] = '';
    });
    let data: any = [];
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
    }, () => {
      // 目前只开放全编辑表格模式下，添加一条空数据后，需要直接抛出
      if(mode === 'full') {
        this.handleChangeData(data);
      }
    });

    this.activeStatus();
  };

  // 根据外界传入的editConfig来处理，当前仅接受对象和方法
  renderEditConfig(
    config: GetFieldDecoratorOptions | EditConfigFunctionType,
    instance: any,
    form: WrappedFormUtils
  ): GetFieldDecoratorOptions | null {
    if (Object.prototype.toString.call(config) === '[object Object]') {
      // @ts-ignore
      return config;
    } else if (Object.prototype.toString.call(config) === '[object Function]') {
      // @ts-ignore
      return config(instance, form);
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
          const component = editComponent(text, record, instance, form);
          return (
            <FormItem style={{margin: 0}}>
              {getFieldDecorator(dataIndex, {
                ...this.renderEditConfig(editConfig, instance, form),
                initialValue:
                  record[dataIndex] === ''
                    ? editConfig &&
                      this.renderEditConfig(editConfig, instance, form)
                        ?.initialValue
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

  renderDefaultConfig() {
    const {mode, btnText, hideAddBtn} = this.props;

    if (mode === 'row') {
      // hideAddBtn为true隐藏add按钮
      if (hideAddBtn) {
        return;
      }

      return {
        footer: () => (
          <Button icon='plus' onClick={this.addNew} style={{width: '100%'}}>
            {btnText?.add ? btnText?.add : '新增'}
          </Button>
        )
      };
    } else {
      // 当前全表格编辑默认不需要分页
      return {
        pagination: false
      };
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
      rowKey,
      ...otherProps
    } = this.props;
    const components = {
      body: {
        row: (otherProps as any)?.onSearch ? EditableFormRow(otherProps) : _EditableFormRow
        // row: EditableFormRow(otherProps)
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
        // @ts-ignore
        pagination={{
          pageSize: this.pageSize,
          current: this.state.currentPage,
          onChange: this.pageOnChange.bind(this)
        }}
        rowClassName={(record: object, index: number) =>
          mode === 'row' ? 'editable-row' : 'editTable-full'
        }
        {...otherProps}
        {...this.renderDefaultConfig()}
      />
    );
  }
}
