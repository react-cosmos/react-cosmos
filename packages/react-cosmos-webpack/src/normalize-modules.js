import type { Modules } from '@skidding/react-cosmos-voyager2/lib/types';

const {
  default: importModule
} = require('react-cosmos-utils/lib/import-module');

// TODO: New fs API coming fru
export const normalizeModules = (modules: Modules) =>
  Object.keys(modules).reduce(
    (acc, next) => ({
      ...acc,
      [next]: importModule(modules[next])
    }),
    {}
  );
