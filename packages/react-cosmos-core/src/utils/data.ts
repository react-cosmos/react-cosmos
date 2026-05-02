import { isValidElement } from 'react';

export type PrimitiveData = string | number | boolean | null | undefined;

export type ObjectData = Record<string, unknown>;

export type ArrayData = unknown[];

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isPrimitiveData(data: unknown): data is PrimitiveData {
  return (
    isString(data) ||
    isNumber(data) ||
    isBoolean(data) ||
    isNull(data) ||
    isUndefined(data)
  );
}

export function isObject(data: unknown): data is ObjectData {
  if (data === null || typeof data !== 'object' || isValidElement(data))
    return false;
  const proto = Object.getPrototypeOf(data);
  return proto === Object.prototype || proto === null;
}

export function isArray(data: unknown): data is ArrayData {
  return Array.isArray(data);
}
