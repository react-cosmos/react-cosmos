// @flow

import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: { config: 'nested/cosmos.config' } }));

const mocksPath = slash(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when config exists at custom path', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [slash(mocksPath, 'nested/some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: slash(mocksPath, 'nested/cosmos-export'),
      port: 9000,
      proxiesPath: slash(mocksPath, 'nested/cosmos.proxies'),
      publicUrl: '/',
      rootPath: slash(mocksPath, 'nested'),
      webpackConfigPath: slash(mocksPath, 'nested/webpack.config')
    });
  });
});
