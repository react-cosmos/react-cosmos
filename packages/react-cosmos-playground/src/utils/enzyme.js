// @flow

import { createContext as _createContext } from 'react-cosmos-enzyme';

import type { EnzymeContextArgs } from 'react-cosmos-enzyme/src';

export function createContext(args: EnzymeContextArgs) {
  return _createContext({
    ...args,
    cosmosConfigPath: require.resolve('../../cosmos.config')
  });
}
