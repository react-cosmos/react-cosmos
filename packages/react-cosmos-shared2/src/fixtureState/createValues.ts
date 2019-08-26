import reactElementToJSXString from 'react-element-to-jsx-string';
import { isElement } from 'react-is';
import {
  FixtureStateObjectValueType,
  FixtureStateValue,
  FixtureStateValues,
  isArray,
  isObject,
  isPrimitiveValue
} from './shared';

export function createValues(
  obj: FixtureStateObjectValueType
): FixtureStateValues {
  const values: FixtureStateValues = {};
  Object.keys(obj)
    // Ignore noise from attrs defined as undefined (eg. props.children is
    // often `undefined` if element has no children)
    .filter(key => obj[key] !== undefined)
    .forEach(key => {
      values[key] = createValue(obj[key]);
    });
  return values;
}

export function createValue(value: unknown): FixtureStateValue {
  if (isPrimitiveValue(value)) {
    return { type: 'primitive', value };
  }

  if (isArray(value)) {
    return {
      type: 'array',
      values: (value as unknown[]).map(v => createValue(v))
    };
  }

  if (isObject(value)) {
    return {
      type: 'object',
      values: createValues(value)
    };
  }

  // Why store unserializable values in fixture state?
  // - Because they still provides value in the Cosmos UI. They let the user know
  //   that, eg. a prop, is present and see the read-only stringified value.
  // - More importantly, because the fixture state controls which props to render.
  //   This way, if a prop is read-only and cannot be edited in the UI, it can
  //   still be removed.
  return {
    type: 'unserializable',
    stringifiedValue: stringifyUnserializableValue(value)
  };
}

function stringifyUnserializableValue(value: unknown) {
  // TODO: Enable custom stringifier plugins
  return isElement(value) ? reactElementToJSXString(value) : String(value);
}
