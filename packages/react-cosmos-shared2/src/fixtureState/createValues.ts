import { isPlainObject } from 'lodash';
import { isElement } from 'react-is';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { KeyValue, FixtureStateValue, FixtureStateValues } from './shared';

export function createValues(obj: KeyValue): FixtureStateValues {
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
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return { type: 'primitive', value };
  }

  if (Array.isArray(value)) {
    return {
      type: 'array',
      values: (value as unknown[]).map(v => createValue(v))
    };
  }

  if (!isSerializableObject(value)) {
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

  return {
    type: 'object',
    values: createValues(value)
  };
}

function isSerializableObject(value: unknown): value is KeyValue {
  return isPlainObject(value) && !isElement(value);
}

function stringifyUnserializableValue(value: unknown) {
  // TODO: Enable custom stringifier plugins
  return isElement(value) ? reactElementToJSXString(value) : String(value);
}
