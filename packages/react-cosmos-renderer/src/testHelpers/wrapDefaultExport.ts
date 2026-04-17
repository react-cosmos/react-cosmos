import type { ByPath } from 'react-cosmos-core';
import { mapValues } from 'react-cosmos-core';

export function wrapDefaultExport<T>(modules: ByPath<T>) {
  return mapValues(modules, v => ({ default: v }));
}
