import { isArray, isObject, isPrimitiveData } from './data.js';

export function pickSerializableValues(object: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(object).filter(([k, v]) => isSerializable(v))
  );
}

export function isSerializable(data: unknown): boolean {
  if (isObject(data)) return Object.values(data).every(isSerializable);
  if (isArray(data)) return data.every(isSerializable);
  return isPrimitiveData(data);
}
