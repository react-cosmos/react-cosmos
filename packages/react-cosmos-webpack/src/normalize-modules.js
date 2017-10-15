// @flow

import type { Modules } from 'react-cosmos-voyager2/src/types';

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
