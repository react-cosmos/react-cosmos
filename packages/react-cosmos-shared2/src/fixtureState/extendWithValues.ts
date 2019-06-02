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
    // TODO: Throw if baseValue doesn't match keys of value.values (and each type)
    const baseObjValue = (baseValue || {}) as KeyValue;
    return extendWithValues(baseObjValue, value.values);
  }

  if (value.type === 'array') {
    // TODO: Throw if baseValue doesn't match length of value.values (and each type)
    const baseArrValue = (baseValue || []) as unknown[];
    return value.values.map((v, idx) => extendWithValue(baseArrValue[idx], v));
  }

  return value.value;
}
