import React, { ReactElement, ReactNode } from 'react';
import omit from 'rc-util/lib/omit';
import RcSelect, { Option, OptGroup, BaseSelectRef } from 'rc-select';
import type { SelectProps as RcSelectProps } from 'rc-select';
import type { BaseOptionType, DefaultOptionType } from 'rc-select/lib/Select';
import { OptionProps } from 'rc-select/lib/Option';
import classNames from 'classnames';
import {
  InputStatus,
  SelectCommonPlacement,
  ValidateStatus,
  getPrefixCls,
  renderEmpty,
  getIcons,
  getMergedStatus,
  getStatusClassNames,
  getTransitionName,
  getTransitionDirection
} from './utils';
import 'rc-select/assets/index.less';

// export { OptionProps, BaseSelectRef as RefSelectProps, BaseOptionType, DefaultOptionType };

export interface FormItemStatusContextProps {
  isFormItemInput?: boolean;
  status?: ValidateStatus;
  hasFeedback?: boolean;
  feedbackIcon?: ReactNode;
}

export const FormItemInputContext = React.createContext<FormItemStatusContextProps>({});

export type SizeType = 'small' | 'middle' | 'large' | undefined;

type RawValue = string | number;

export interface LabeledValue {
  key?: string;
  value: RawValue;
  label: React.ReactNode;
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;

export interface InternalSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
  > extends Omit<RcSelectProps<ValueType, OptionType>, 'mode'> {
  suffixIcon?: React.ReactNode;
  size?: SizeType;
  mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
  bordered?: boolean;
}

export interface VirtualSelectProps<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
  > extends Omit<
  InternalSelectProps<ValueType, OptionType>,
  'inputIcon' | 'mode' | 'getInputElement' | 'getRawInputElement' | 'backfill' | 'placement'
  > {
  placement?: SelectCommonPlacement;
  mode?: 'multiple' | 'tags';
  status?: InputStatus;
  virtual?: boolean;
}

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';

type DirectionType = 'ltr' | 'rtl' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

// 全局默认 direction 值
let direction: DirectionType = "ltr";

const InternalSelect = <OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(
  {
    prefixCls: customizePrefixCls,
    bordered = true,
    className,
    getPopupContainer,
    dropdownClassName,
    listHeight = 256,
    placement,
    listItemHeight = 24,
    size: customizeSize,
    notFoundContent,
    status: customStatus,
    showArrow,
    virtual = true,
    dropdownMatchSelectWidth = true,
    ...props
  }: VirtualSelectProps<OptionType>,
  ref: React.Ref<BaseSelectRef>
) => {

  const size = React.useContext(SizeContext);
  const prefixCls = getPrefixCls('select', customizePrefixCls);
  const rootPrefixCls = getPrefixCls();

  const mode = React.useMemo(() => {
    const { mode: m } = props as InternalSelectProps<OptionType>;

    if ((m as any) === 'combobox') {
      return undefined;
    }

    if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
      return 'combobox';
    }

    return m;
  }, [props.mode]);

  const isMultiple = mode === 'multiple' || mode === 'tags';
  const mergedShowArrow =
    showArrow !== undefined ? showArrow : props.loading || !(isMultiple || mode === 'combobox');

  // ===================== Form Status =====================
  const {
    status: contextStatus,
    hasFeedback,
    isFormItemInput,
    feedbackIcon,
  } = React.useContext(FormItemInputContext);
  const mergedStatus = getMergedStatus(contextStatus, customStatus);

  // ===================== Empty =====================
  let mergedNotFound: React.ReactNode;
  if (notFoundContent !== undefined) {
    mergedNotFound = notFoundContent;
  } else if (mode === 'combobox') {
    mergedNotFound = null;
  } else {
    mergedNotFound = renderEmpty('Select');
  }

  // ===================== Icons =====================
  const { suffixIcon, itemIcon, removeIcon, clearIcon } = getIcons({
    ...props,
    multiple: isMultiple,
    hasFeedback,
    feedbackIcon,
    showArrow: mergedShowArrow,
    prefixCls,
  });

  const selectProps = omit(props as typeof props & { itemIcon: any }, ['suffixIcon', 'itemIcon']);

  const rcSelectRtlDropdownClassName = classNames(dropdownClassName, {
    [`${prefixCls}-dropdown-${direction}`]: direction === 'rtl',
  });

  const mergedSize = customizeSize || size;
  const mergedClassName = classNames(
    {
      [`${prefixCls}-lg`]: mergedSize === 'large',
      [`${prefixCls}-sm`]: mergedSize === 'small',
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-in-form-item`]: isFormItemInput,
    },
    getStatusClassNames(prefixCls, mergedStatus, hasFeedback),
    className,
  );

  // ===================== Placement =====================
  const getPlacement = () => {
    if (placement !== undefined) {
      return placement;
    }
    return direction === 'rtl'
      ? ('bottomRight' as SelectCommonPlacement)
      : ('bottomLeft' as SelectCommonPlacement);
  };

  return (
    <RcSelect<any, any>
      ref={ref as any}
      virtual={virtual}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      {...selectProps}
      transitionName={getTransitionName(
        rootPrefixCls,
        getTransitionDirection(placement),
        props.transitionName,
      )}
      listHeight={listHeight}
      listItemHeight={listItemHeight}
      mode={mode as any}
      prefixCls={prefixCls}
      placement={getPlacement()}
      direction={direction}
      inputIcon={suffixIcon}
      menuItemSelectedIcon={itemIcon}
      removeIcon={removeIcon}
      clearIcon={clearIcon}
      notFoundContent={mergedNotFound}
      className={mergedClassName}
      getPopupContainer={getPopupContainer}
      dropdownClassName={rcSelectRtlDropdownClassName}
      showArrow={hasFeedback || showArrow}
    />
  )
}

const VirtualSelect = React.forwardRef(InternalSelect) as unknown as (<
  ValueType = any,
  OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType,
  >(
  props: React.PropsWithChildren<VirtualSelectProps<ValueType, OptionType>> & {
    ref?: React.Ref<BaseSelectRef>;
  },
) => React.ReactElement) & {
  SECRET_COMBOBOX_MODE_DO_NOT_USE: string;
  Option: typeof Option;
  OptGroup: typeof OptGroup;
};

VirtualSelect.SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE;
VirtualSelect.Option = Option;
VirtualSelect.OptGroup = OptGroup;

export default VirtualSelect;