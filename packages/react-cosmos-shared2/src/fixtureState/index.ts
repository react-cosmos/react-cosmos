import {
  KeyValue,
  FixtureDecoratorId,
  FixtureElementId,
  FixtureStateUnserializableValue,
  FixtureStatePrimitiveValueType,
  FixtureStatePrimitiveValue,
  FixtureStateObjectValue,
  FixtureStateArrayValue,
  FixtureStateValue,
  FixtureStateValues,
  FixtureStateProps,
  FixtureStateClassState,
  FixtureStatePrimitiveValue2,
  FixtureStateValue2,
  FixtureStateValues2,
  FixtureState,
  SetFixtureState
} from './shared';

// Types can't be re-exported because Babel (see root tsconfig.json)
export type KeyValue = KeyValue;
export type FixtureDecoratorId = FixtureDecoratorId;
export type FixtureElementId = FixtureElementId;
export type FixtureStateUnserializableValue = FixtureStateUnserializableValue;
export type FixtureStatePrimitiveValueType = FixtureStatePrimitiveValueType;
export type FixtureStatePrimitiveValue = FixtureStatePrimitiveValue;
export type FixtureStateObjectValue = FixtureStateObjectValue;
export type FixtureStateArrayValue = FixtureStateArrayValue;
export type FixtureStateValue = FixtureStateValue;
export type FixtureStateValues = FixtureStateValues;
export type FixtureStateProps = FixtureStateProps;
export type FixtureStateClassState = FixtureStateClassState;
export type FixtureStatePrimitiveValue2 = FixtureStatePrimitiveValue2;
export type FixtureStateValue2 = FixtureStateValue2;
export type FixtureStateValues2 = FixtureStateValues2;
export type FixtureState = FixtureState;
export type SetFixtureState = SetFixtureState;

export { createValues, createValue } from './createValues';
export { extendWithValues } from './extendWithValues';
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
export { findFixtureStateInputState } from './inputState';
