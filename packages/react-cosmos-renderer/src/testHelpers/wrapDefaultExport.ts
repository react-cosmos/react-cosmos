import { ByPath, mapValues } from 'react-cosmos-core';

export function wrapDefaultExport<T>(modules: ByPath<T>) {
  return mapValues(modules, v => ({ default: v }));
}
