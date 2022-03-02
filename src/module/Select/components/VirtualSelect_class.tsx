import React, { ReactElement, ReactNode } from 'react';
import { Select, Checkbox } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import DropdownRender_class from './DropdownRender_class';
import './index.less';

export interface VirtualSelectProps extends SelectProps {
  children?: any;
}

type FilterChildListType = undefined | any[];

interface VirtualSelectState {
  childList: any[];
  filterChildList: FilterChildListType;
  key?: string;
  visible: boolean;
  selectValue: any | any[];
  checkAll: boolean;
}

const Option = Select.Option;
const OptGroup = Select.OptGroup;

// 一次渲染的数据量
const ITEM_SIZE = 30;
// 子项高度
const ITEM_HEIGHT_CONFIG = {
  small: 24,
  large: 40,
  default: 32
};

// 可视区域展示的条数
const PAGE_SIZE = 8;

// 下拉框mode
const MULTIPLEMODES: any = ["multiple", "tags"];

// 选中全部设定
const checkAll_text = "全部";
const checkAll_height = 40;

export default class VirtualSelect_class extends React.Component<VirtualSelectProps, VirtualSelectState> {
  // 下拉菜单高度
  private DROPDOWN_HEIGHT: number = 0;
  // 子项高度
  private ITEM_HEIGHT: number;
  // 下拉菜单DOM节点
  private scrollDropdown: any = null;
  // 键盘上下键
  private scrollKey: any = null;
  // 当前滚动高度
  private currScrollTop: number = 0;
  // 上一次滚动高度
  private prevScrollTop: number = 0;
  // 滚动后刷新所需要的滚动高度
  private height_to_refresh: number;
  // 是否为多选
  private isMultiple: boolean = false;

  private cref: any = null;
  private selectRef: any = null;
  private timer: any = null;
  private lock: any = null;
  // 监听事件中使用了querySelector去获取元素，当存在多个下拉框组件时，会出现问题，需要对class类做区别
  private randomNum: string = `${new Date().valueOf()}${Math.floor(Math.random() * 100)}`;
  
  static Option = Option;
  static OptGroup = OptGroup

  constructor(props: VirtualSelectProps) {
    super(props);
    this.state = {
      childList: this.handlePropsChildren(props.children),
      filterChildList: undefined,
      key: undefined,
      visible: false,
      selectValue: undefined,
      checkAll: false
    }
    this.ITEM_HEIGHT = ITEM_HEIGHT_CONFIG[props.size || "default"]
    this.DROPDOWN_HEIGHT = PAGE_SIZE * this.ITEM_HEIGHT;
    // 判断是否为多选模式
    if (MULTIPLEMODES.includes(props.mode)) {
      this.isMultiple = true;
      this.DROPDOWN_HEIGHT = PAGE_SIZE * this.ITEM_HEIGHT + checkAll_height - this.ITEM_HEIGHT;
    }

    this.height_to_refresh = this.ITEM_HEIGHT * ITEM_SIZE / 3;
    this.cref = React.createRef();
    this.selectRef = React.createRef();
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { children } = this.props;
    if (prevProps.children !== children) {
      this.setState({
        childList: this.handlePropsChildren(children),
        filterChildList: undefined
      });
    }
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  // 处理children
  handlePropsChildren(children: React.ReactNode) {
    if(children) {
      return Array.isArray(children) ? children : [children];
    } else {
      return [];
    }
  }

  // 区分是否存在搜索情况
  getChildList() {
    const { childList, filterChildList } = this.state;
    return filterChildList || childList;
  }

  // 获取总高度，数据为空时，设置为100
  getAllHeight() {
    return this.getChildList().length * this.ITEM_HEIGHT || 100;
  }

  // 获取children的value值，供【全部】使用
  getAllValue() {
    const list = this.getChildList();
    return list.map((item: ReactElement) => item.props.value);
  }

  handleItemIndex(initialIndex?: number) {
    const index = initialIndex ?? Math.floor(this.currScrollTop / this.ITEM_HEIGHT);
    let start = index - ITEM_SIZE < 0 ? 0 : index - ITEM_SIZE / 2;
    // 记录滚动高度
    this.prevScrollTop = this.currScrollTop;
    const end = index + ITEM_SIZE;
    return { start, end };
  }

  // 是否应该渲染新的数据
  shouldRefreshDropdown(): boolean {
    this.currScrollTop = this.scrollDropdown ? this.scrollDropdown.scrollTop : 0;
    let height = Math.abs(this.currScrollTop - this.prevScrollTop);
    return height > this.height_to_refresh;
  }

  // 重渲染下拉菜单
  refreshDropdown() {
    const { start, end } = this.handleItemIndex();
    this.cref?.initialDropdown && this.cref?.initialDropdown(start, end, this.getAllHeight());
  }

  // 滚动监听事件
  onScroll() {
    this.shouldRefreshDropdown() && this.refreshDropdown();
  }

  // 监听键盘方向键 上下
  onKeyDown(e: any) {
    const { keyCode } = e;
    const up = keyCode === 38;
    const down = keyCode === 40;

    var keyTimer: any = null;
    if (!keyTimer) {
      clearTimeout(keyTimer);
    }
    keyTimer = setTimeout(() => {
      // 获取当前正处于高亮显示的子项
      const currentItem: HTMLElement | null = document.querySelector(`.VtSelect-dropdown${this.randomNum} .ant-select-dropdown-menu-item-active`);

      if (!currentItem) return;
      const offsetTop = currentItem.offsetTop;
      // 根据是否多选，调整高度
      const dropdown_height = this.isMultiple ? this.DROPDOWN_HEIGHT - checkAll_height : this.DROPDOWN_HEIGHT;
      const diff = offsetTop - this.currScrollTop;

      /**要注意的是，处于最后一项向下移动时，并不是直接回到第一项，同理，第一项向上移动时，也不是直接到最后一项 */

      // 向下滚动
      if (down) {
        const down_distance = dropdown_height - this.ITEM_HEIGHT;
        // 处于全部数据的底部时
        if (diff < 0 && this.currScrollTop - this.prevScrollTop <= dropdown_height) {
          this.scrollDropdown.scrollTo(0, 0);
          return;
        }
        // 当下拉菜单中的最后一项显示不完整时，显示完全该项
        if (dropdown_height - this.ITEM_HEIGHT < diff && diff < dropdown_height) {
          const times = Math.ceil(Math.abs(offsetTop - dropdown_height) / this.ITEM_HEIGHT) + 1;
          this.scrollDropdown.scrollTo(0, times * this.ITEM_HEIGHT);
        }
        // 处于可视下拉菜单区域的底部时
        if (diff >= dropdown_height) {
          this.scrollDropdown.scrollTo(0, offsetTop - down_distance);
        }
      }
      // 向上滚动
      if (up) {
        // this.scrollDropdown.scrollTo(0, offsetTop);
        // 处于全部数据的顶部时
        if (diff > dropdown_height) {
          this.scrollDropdown.scrollTo(0, this.getAllHeight() - dropdown_height);
          return;
        }
        // 处于可视下拉菜单区域的顶部时
        if (diff < 0) {
          this.scrollDropdown.scrollTo(0, offsetTop);
        }
      }
    }, 0)
  }

  // 挂载监听事件
  addEvent() {
    this.scrollDropdown = document.querySelector(`.VtSelect-dropdown${this.randomNum}`);
    this.scrollKey = document.querySelector(`.VtSelect${this.randomNum}`);
    // 下拉菜单未展开时元素不存在
    this.scrollDropdown && this.scrollDropdown.addEventListener("scroll", this.onScroll.bind(this), false);
    this.scrollKey && this.scrollKey.addEventListener("keydown", this.onKeyDown.bind(this), false);
  };

  // 卸载监听事件
  removeEvent() {
    this.scrollDropdown && this.scrollDropdown.removeEventListener("scroll", this.onScroll.bind(this), false);
    this.scrollKey && this.scrollKey.removeEventListener("keydown", this.onKeyDown.bind(this), false);
  }

  // 滚动到相应的位置
  scrollWithValue(key: number) {
    const { start, end } = this.handleItemIndex(key);
    const itemTop = key * this.ITEM_HEIGHT;
    this.cref?.initialDropdown && this.cref?.initialDropdown(start, end, this.getAllHeight(), () => {
      // 当选中元素处于下拉菜单上方不可见区域或处于上方半遮挡
      if (this.currScrollTop - itemTop >= 0) {
        this.scrollDropdown.scrollTo(0, itemTop);
      } else if (itemTop - this.currScrollTop >= this.DROPDOWN_HEIGHT - this.ITEM_HEIGHT) { // 当选中元素处于下拉菜单下方不可见区域或处于下方半遮挡时
        this.scrollDropdown.scrollTo(0, itemTop - this.DROPDOWN_HEIGHT + this.ITEM_HEIGHT);
      }
    });
  }

  // 下拉菜单展开/收起 回调
  onDropdownVisibleChange(visible: boolean) {
    const { onDropdownVisibleChange: _onDropdownVisibleChange, mode } = this.props;
    const { key } = this.state;
    if (visible) {
      // 下拉菜单展开时，确保能够获取到元素并绑定监听事件
      if (!this.timer) {
        this.timer = setTimeout(() => this.addEvent(), 0);
      } else {
        // 单选配置，且已经有选中值时
        !this.isMultiple && key
          ? this.scrollWithValue(Number(key))
          : this.refreshDropdown();
      }
    }
    if (this.lock) {
      this.selectRef.focus();
      return;
    }
    this.setState({ visible });
    _onDropdownVisibleChange && _onDropdownVisibleChange(visible);
  }

  checkAllDivOnClick() {
    const { onChange: _onChange } = this.props;
    const {checkAll} = this.state;
    this.setState({
      checkAll: !checkAll
    });
    const value = !checkAll ? this.getAllValue() : this.state.selectValue;
    _onChange && _onChange(value, []);
  }

  lockClose = (e: any) => {
    clearTimeout(this.lock);
    this.lock = setTimeout(() => {
      this.lock = null;
    }, 100);
  };

  checkOnChange = (e: CheckboxChangeEvent) => {
    const { onChange: _onChange } = this.props;
    this.setState({
      checkAll: e.target.checked
    });
    const value = e.target.checked ? this.getAllValue() : this.state.selectValue;
    _onChange && _onChange(value, []);
  }

  // 自定义下拉菜单
  renderDropdown(menuNode: ReactNode, props: any) {
    const { start, end } = this.handleItemIndex();
    return (
      <React.Fragment>
        {
          this.isMultiple && (
            <div 
              className='VtSelect-dropdown-checkAll VtSelect-dropdown-checkAll-fixed' 
              onClick={this.checkAllDivOnClick.bind(this)} 
              onMouseDown={this.lockClose} 
              onMouseUp={this.lockClose}
            >
              <Checkbox checked={this.state.checkAll} onChange={this.checkOnChange.bind(this)}>
                {checkAll_text}
              </Checkbox>
            </div>
          )
        }
        <DropdownRender_class
          start={start}
          end={end}
          allHeight={this.getAllHeight()}
          itemHeight={this.ITEM_HEIGHT}
          menuNode={menuNode}
          ref={ele => this.cref = ele}
          isCheckAll={this.state.checkAll}
        />
      </React.Fragment>
    );
  }

  // 搜索回调
  onSearch(value: string) {
    const { onSearch: _onSearch, showSearch, filterOption, children } = this.props;
    let result: any = undefined;
    if (showSearch || this.isMultiple) {
      if (typeof filterOption === "function") {
        result = children?.filter((item: any) => filterOption(value, item));
      }
      if (!filterOption) {
        result = children?.filter((item: any) => this.customFilterOption(value, item));
      }
      // 做搜索时，如果向下滚动一定高度，此时scrollTop一直在变大
      // 到一定程度后，会导致计算出来的start和end的值都大于过滤后的数据的总高度
      // 这样会演变成过滤数组存在，但是在模板组件内切割出来的数据为空，最终无法显示下拉菜单
      // 目前处理为，每一次搜索，都滑动回顶部
      this.scrollDropdown.scrollTo(0, 0);
      this.setState({
        filterChildList: !value ? undefined : result
      }, () => {
        this.refreshDropdown();
      });
    }
    _onSearch && _onSearch(value);
  }

  // 选中选项后，清除搜索条件，重新计算下拉框高度
  onChange(value: any, option: any) {
    const { showSearch, onChange: _onChange, autoClearSearchValue } = this.props;
    if (showSearch || this.isMultiple) {
      // 在选中选项后，清空输入框内容
      if (autoClearSearchValue !== false) {
        this.setState({
          filterChildList: undefined
        }, () => {
          this.refreshDropdown();
        });
      }
    }
    this.setState({ key: option.key, selectValue: value });
    _onChange && _onChange(value, option);
  };

  // 自定义过滤方法，默认大小写不匹配
  customFilterOption(value: string, option: any) {
    const { optionFilterProp } = this.props;
    const customOptionFilterProp = optionFilterProp || "children";
    return `${option.props[customOptionFilterProp]}`?.indexOf(value) !== -1;
  }

  render(): React.ReactNode {
    const {
      children = [],
      className = "",
      dropdownClassName = "",
      dropdownStyle,
      ...restProps
    } = this.props;
    const { visible, selectValue, checkAll } = this.state;
    const customDropdownStyle = Object.assign({}, dropdownStyle, {
      maxHeight: this.DROPDOWN_HEIGHT,
      overflow: 'auto',
    })
    return (
      <Select
        {...restProps}
        className={`VtSelect VtSelect${this.randomNum} ${className}`}
        dropdownClassName={`VtSelect-dropdown VtSelect-dropdown${this.randomNum} ${dropdownClassName}`}
        onSearch={this.onSearch.bind(this)}
        onChange={this.onChange.bind(this)}
        dropdownStyle={customDropdownStyle}
        dropdownRender={this.renderDropdown.bind(this)}
        onDropdownVisibleChange={this.onDropdownVisibleChange.bind(this)}
        ref={ref => this.selectRef = ref}
        open={visible}
        value={checkAll ? checkAll_text : selectValue}
      >
        {this.getChildList()}
      </Select>
    )
  }
}