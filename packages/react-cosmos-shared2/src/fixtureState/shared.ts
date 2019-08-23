import { StateUpdater } from '../util';

// TODO: Deprecate in favor of FixtureStateObjectValueType
export type KeyValue = Record<string, unknown>;

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

export type FixtureStateValueGroup = {
  defaultValue: FixtureStateValue;
  currentValue: FixtureStateValue;
};

export type FixtureStateValueGroups = Record<string, FixtureStateValueGroup>;

// TODO: 'select' type with specific options (that may or may not be
// serializable)

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

export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
  customState?: FixtureStateValueGroups;
} & Record<string, any>;

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
