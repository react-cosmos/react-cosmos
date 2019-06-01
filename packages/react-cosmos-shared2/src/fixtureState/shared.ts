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

export type FixtureStatePrimitiveValue = {
  type: 'primitive';
  value: string | number | boolean | null;
};

export type FixtureStateCompositeValue = {
  type: 'composite';
  values: FixtureStateValues;
};

// TODO: 'select' type with specific options (that may or may not be
// serializable)
export type FixtureStateValue =
  | FixtureStateUnserializableValue
  | FixtureStatePrimitiveValue
  | FixtureStateCompositeValue;

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
};

export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
} & Record<string, any>;
