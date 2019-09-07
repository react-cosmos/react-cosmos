import { isPlainObject } from 'lodash';
import { isElement } from 'react-is';
import { StateUpdater } from '../util';

export type FixtureDecoratorId = string;

export type FixtureElementId = {
  decoratorId: string;
  elPath: string;
};

export type FixtureStateUnserializableValue = {
  type: 'unserializable';
  stringifiedValue: string;
};

export type FixtureStatePrimitiveValueType = string | number | boolean | null;

export type FixtureStateObjectValueType = Record<string, unknown>;

export type FixtureStateArrayValueType = unknown[];

export type FixtureStateValueType =
  | FixtureStatePrimitiveValueType
  | FixtureStateObjectValueType
  | FixtureStateArrayValueType;

export type FixtureStatePrimitiveValue = {
  type: 'primitive';
  value: FixtureStatePrimitiveValueType;
};

export type FixtureStateObjectValue = {
  type: 'object';
  values: FixtureStateValues;
};

export type FixtureStateArrayValue = {
  type: 'array';
  values: FixtureStateValue[];
};

export type FixtureStateValue =
  | FixtureStateUnserializableValue
  | FixtureStatePrimitiveValue
  | FixtureStateObjectValue
  | FixtureStateArrayValue;

export type FixtureStateValues = Record<string, FixtureStateValue>;

export type FixtureStateValuePair = {
  defaultValue: FixtureStateValue;
  currentValue: FixtureStateValue;
};

export type FixtureStateValuePairs = Record<string, FixtureStateValuePair>;

export type FixtureStateSelect = {
  options: string[];
  defaultValue: string;
  currentValue: string;
};

export type FixtureStateSelects = Record<string, FixtureStateSelect>;

export type FixtureRenderKey = number;

export type FixtureStateProps = {
  elementId: FixtureElementId;
  values: FixtureStateValues;
  renderKey: FixtureRenderKey;
  componentName: string;
};

export type FixtureStateClassState = {
  elementId: FixtureElementId;
  values: FixtureStateValues;
  componentName: string;
};

// TODO: Support options (with serializable label and any value type, which
// lives in the user land)
export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
  values?: FixtureStateValuePairs;
  selects?: FixtureStateSelects;
} & Record<string, unknown>;

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isPrimitiveValue(
  value: unknown
): value is FixtureStatePrimitiveValueType {
  return (
    isString(value) || isNumber(value) || isBoolean(value) || isNull(value)
  );
}

export function isObject(value: unknown): value is FixtureStateObjectValueType {
  return isPlainObject(value) && !isElement(value);
}

export function isArray(value: unknown): value is FixtureStateArrayValueType {
  return Array.isArray(value);
}
