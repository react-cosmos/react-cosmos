import {
  FixtureStateObjectValueData,
  FixtureStateValue,
  FixtureStateValues,
  isArray,
  isObject,
} from './shared';

// Use fixture state for serializable values and fall back to base values
export function extendWithValues(
  obj: FixtureStateObjectValueData,
  values: FixtureStateValues
): FixtureStateObjectValueData {
  const extendedObj: FixtureStateObjectValueData = {};
  Object.keys(values).forEach(key => {
    extendedObj[key] = extendWithValue(obj[key], values[key]);
  });
  return extendedObj;
}

export function extendWithValue(
  data: unknown,
  value: FixtureStateValue
): unknown {
  if (value.type === 'unserializable') return data;

  if (value.type === 'object') {
    const obj = isObject(data) ? data : {};
    return extendWithValues(obj, value.values);
  }

  if (value.type === 'array') {
    const array = isArray(data) ? data : [];
    return value.values.map((v, idx) => extendWithValue(array[idx], v));
  }

  return value.data;
}
