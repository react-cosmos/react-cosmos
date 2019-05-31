import { FixtureStateValue, FixtureStateValues, KeyValue } from './shared';

// Use fixture state for serializable values and fall back to base values
export function extendWithValues(
  obj: KeyValue,
  values: FixtureStateValues
): KeyValue {
  const extendedObj: KeyValue = {};
  Object.keys(values).forEach(key => {
    extendedObj[key] = extendWithValue(obj[key], values[key]);
  });
  return extendedObj;
}

function extendWithValue(baseValue: unknown, value: FixtureStateValue) {
  return value.type === 'unserializable'
    ? baseValue
    : value.type === 'object'
    ? extendWithValues((baseValue as KeyValue) || {}, value.values)
    : value.value;
}
