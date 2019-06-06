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

function extendWithValue(
  baseValue: unknown,
  value: FixtureStateValue
): unknown {
  if (value.type === 'unserializable') {
    return baseValue;
  }

  if (value.type === 'object') {
    // This works (for now) because users can't add/remove object keys nor can
    // they change the type of any value. If any of these requirements show up
    // in the future this will need to be redesign to handle merge conflicts
    const baseObj = baseValue as KeyValue;
    return extendWithValues(baseObj, value.values);
  }

  if (value.type === 'array') {
    // This works (for now) because users can't add/remove array items nor can
    // they change the type of any value. If any of these requirements show up
    // in the future this will need to be redesign to handle merge conflicts
    const baseArr = baseValue as unknown[];
    return value.values.map((v, idx) => extendWithValue(baseArr[idx], v));
  }

  return value.value;
}
