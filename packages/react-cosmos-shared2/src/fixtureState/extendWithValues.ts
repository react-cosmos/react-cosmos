import {
  FixtureStateObjectValueType,
  FixtureStateValue,
  FixtureStateValues,
  isArray,
  isObject,
} from './shared';

// Use fixture state for serializable values and fall back to base values
export function extendWithValues(
  obj: FixtureStateObjectValueType,
  values: FixtureStateValues
): FixtureStateObjectValueType {
  const extendedObj: FixtureStateObjectValueType = {};
  Object.keys(values).forEach((key) => {
    extendedObj[key] = extendWithValue(obj[key], values[key]);
  });
  return extendedObj;
}

export function extendWithValue(
  baseValue: unknown,
  value: FixtureStateValue
): unknown {
  if (value.type === 'unserializable') {
    return baseValue;
  }

  if (value.type === 'object') {
    const baseObj = isObject(baseValue) ? baseValue : {};
    return extendWithValues(baseObj, value.values);
  }

  if (value.type === 'array') {
    const baseArr = isArray(baseValue) ? baseValue : [];
    return value.values.map((v, idx) => extendWithValue(baseArr[idx], v));
  }

  return value.value;
}
