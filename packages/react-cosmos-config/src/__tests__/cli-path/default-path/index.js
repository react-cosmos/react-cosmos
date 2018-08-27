// @flow

import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: {} }));

const mocksPath = slash(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when config exists at default path', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [slash(mocksPath, 'some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: slash(mocksPath, 'cosmos-export'),
      port: 9000,
      proxiesPath: slash(mocksPath, 'cosmos.proxies'),
      publicUrl: '/',
      rootPath: mocksPath,
      webpackConfigPath: slash(mocksPath, 'webpack.config')
    });
  });
});
