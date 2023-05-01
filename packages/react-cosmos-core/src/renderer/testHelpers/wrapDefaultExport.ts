import { mapValues } from 'lodash-es';
import { ByPath } from '../../shared/userModuleTypes.js';

export function wrapDefaultExport<T>(modules: ByPath<T>) {
  return mapValues(modules, defaultExport => ({ default: defaultExport }));
}
