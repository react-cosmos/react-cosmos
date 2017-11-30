// @flow

import createEnzymeContext from 'react-cosmos-test/enzyme';

import type { EnzymeContextArgs } from 'react-cosmos-test/src/enzyme';

export function createContext(args: EnzymeContextArgs) {
  return createEnzymeContext({
    ...args,
    cosmosConfigPath: require.resolve('../../cosmos.config')
  });
}
