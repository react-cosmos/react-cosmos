import { isEqual } from 'lodash';
import { isElement } from 'react-is';
import * as reactElementToJSXString from 'react-element-to-jsx-string';

export type KeyValue = Record<string, unknown>;

export type FixtureDecoratorId = string;

export type FixtureElementId = {
  decoratorId: string;
  elPath: string;
};

export type FixtureStateValue = {
  serializable: boolean;
  key: string;
  stringified: string;
};

export type FixtureRenderKey = number;

export type FixtureStateProps = {
  elementId: FixtureElementId;
  values: FixtureStateValue[];
  renderKey: FixtureRenderKey;
  componentName: string;
};

export type FixtureStateClassState = {
  elementId: FixtureElementId;
  values: FixtureStateValue[];
};

export type FixtureState = {
  props?: FixtureStateProps[];
  classState?: FixtureStateClassState[];
} & Record<string, any>;

// Why store unserializable values in fixture state?
// - Because they still provides value in the Cosmos UI. They let the user know
//   that, eg. a prop, is present and see the read-only stringified value.
// - More importantly, because the fixture state controls which props to render.
//   This way, if a prop is read-only and cannot be edited in the UI, it can
//   still be removed.
export function createValues(obj: KeyValue): FixtureStateValue[] {
  return (
    Object.keys(obj)
      // Ignore noise from attrs defined as undefined (eg. props.children is
      // often `undefined` if element has no children)
      .filter(key => obj[key] !== undefined)
      .map(key => stringifyValue(key, obj[key]))
  );
}

// Use fixture state for serializable values and fall back to base values
export function extendWithValues(
  obj: KeyValue,
  values: FixtureStateValue[]
): KeyValue {
  return values.reduce(
    (acc, { serializable, key, stringified }) => ({
      ...acc,
      [key]: serializable ? JSON.parse(stringified) : obj[key]
    }),
    {}
  );
}

function stringifyValue(key: string, value: unknown): FixtureStateValue {
  try {
    // NOTE: Is this optimal?
    if (!isEqual(JSON.parse(JSON.stringify(value)), value)) {
      throw new Error('Unserializable value');
    }
  } catch (err) {
    return {
      serializable: false,
      key,
      // TODO: Enable custom stringifiers to plug in
      stringified: isElement(value)
        ? reactElementToJSXString(value)
        : String(value)
    };
  }

  return {
    serializable: true,
    key,
    stringified: JSON.stringify(value)
  };
}
