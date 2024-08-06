import { mapValues } from 'lodash-es';
import { ByPath } from 'react-cosmos-core';

export function wrapDefaultExport<T>(modules: ByPath<T>, options = {}) {
  return mapValues(modules, defaultExport => ({
    default: defaultExport,
    options,
  }));
}
