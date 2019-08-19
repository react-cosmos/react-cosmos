import { StateUpdater } from '../util';

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

// TODO: 'select' type with specific options (that may or may not be
// serializable)
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

export type FixtureStateValue2 = {
  type: 'primitive';
  defaultValue: FixtureStatePrimitiveValueType;
  currentValue: FixtureStatePrimitiveValueType;
};

export type FixtureStateValues2 = Record<string, FixtureStateValue2>;

export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
  customState?: FixtureStateValues2;
} & Record<string, any>;

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
