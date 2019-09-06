import {
  FixtureDecoratorId,
  FixtureElementId,
  FixtureStateUnserializableValue,
  FixtureStatePrimitiveValueType,
  FixtureStateObjectValueType,
  FixtureStateArrayValueType,
  FixtureStateValueType,
  FixtureStatePrimitiveValue,
  FixtureStateObjectValue,
  FixtureStateArrayValue,
  FixtureStateValue,
  FixtureStateValues,
  FixtureStateValuePair,
  FixtureStateValuePairs,
  FixtureStateSelect,
  FixtureStateSelects,
  FixtureStateProps,
  FixtureStateClassState,
  FixtureState,
  SetFixtureState
} from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type FixtureDecoratorId = FixtureDecoratorId;
export type FixtureElementId = FixtureElementId;
export type FixtureStateUnserializableValue = FixtureStateUnserializableValue;
export type FixtureStatePrimitiveValueType = FixtureStatePrimitiveValueType;
export type FixtureStateObjectValueType = FixtureStateObjectValueType;
export type FixtureStateArrayValueType = FixtureStateArrayValueType;
export type FixtureStateValueType = FixtureStateValueType;
export type FixtureStatePrimitiveValue = FixtureStatePrimitiveValue;
export type FixtureStateObjectValue = FixtureStateObjectValue;
export type FixtureStateArrayValue = FixtureStateArrayValue;
export type FixtureStateValue = FixtureStateValue;
export type FixtureStateValues = FixtureStateValues;
export type FixtureStateValuePair = FixtureStateValuePair;
export type FixtureStateValuePairs = FixtureStateValuePairs;
export type FixtureStateSelect = FixtureStateSelect;
export type FixtureStateSelects = FixtureStateSelects;
export type FixtureStateProps = FixtureStateProps;
export type FixtureStateClassState = FixtureStateClassState;
export type FixtureState = FixtureState;
export type SetFixtureState = SetFixtureState;

export {
  isString,
  isNumber,
  isBoolean,
  isNull,
  isPrimitiveValue,
  isObject,
  isArray
} from './shared';
export { createValues, createValue } from './createValues';
export { extendWithValues, extendWithValue } from './extendWithValues';
export {
  DEFAULT_RENDER_KEY,
  getFixtureStateProps,
  findFixtureStateProps,
  createFixtureStateProps,
  resetFixtureStateProps,
  updateFixtureStateProps,
  removeFixtureStateProps
} from './props';
export {
  getFixtureStateClassState,
  findFixtureStateClassState,
  createFixtureStateClassState,
  updateFixtureStateClassState,
  removeFixtureStateClassState
} from './classState';
export { findFixtureStateValue } from './values';
