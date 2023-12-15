import { StateUpdater } from '../utils/state.js';

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

export type FixtureState = Record<string, unknown>;

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
