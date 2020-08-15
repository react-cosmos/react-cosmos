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
  stringifiedData: string;
};

export type PrimitiveData = string | number | boolean | null | undefined;

export type ObjectData = Record<string, unknown>;

export type ArrayData = unknown[];

export type FixtureStateData = PrimitiveData | ObjectData | ArrayData;

export type FixtureStatePrimitiveValue = {
  type: 'primitive';
  data: PrimitiveData;
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

export type FixtureStateStandardControl = {
  type: 'standard';
  defaultValue: FixtureStateValue;
  currentValue: FixtureStateValue;
};

export type FixtureStateSelectControl = {
  type: 'select';
  options: string[];
  defaultValue: string;
  currentValue: string;
};

export type FixtureStateControl =
  | FixtureStateStandardControl
  | FixtureStateSelectControl;

export type FixtureStateControls = Record<string, FixtureStateControl>;

export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
  controls?: FixtureStateControls;
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

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isPrimitiveData(data: unknown): data is PrimitiveData {
  return (
    isString(data) ||
    isNumber(data) ||
    isBoolean(data) ||
    isNull(data) ||
    isUndefined(data)
  );
}

export function isObject(data: unknown): data is ObjectData {
  return isPlainObject(data) && !isElement(data);
}

export function isArray(data: unknown): data is ArrayData {
  return Array.isArray(data);
}
