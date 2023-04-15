import { mapValues } from 'lodash-es';
import { ByPath } from '../reactTypes.js';

export function wrapDefaultExport<T>(modules: ByPath<T>) {
  return mapValues(modules, defaultExport => ({ default: defaultExport }));
}
