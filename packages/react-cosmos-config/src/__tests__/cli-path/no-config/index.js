// @flow

import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig, hasUserCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: {} }));

const mocksPath = slash(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when no config exists', () => {
  it('returns normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [],
      hostname: null,
      hot: true,
      outputPath: slash(mocksPath, 'cosmos-export'),
      port: 8989,
      proxiesPath: slash(mocksPath, 'cosmos.proxies'),
      publicUrl: '/',
      rootPath: mocksPath,
      webpackConfigPath: slash(mocksPath, 'webpack.config')
    });
  });

  it('reports users has no config', () => {
    expect(hasUserCosmosConfig()).toBe(false);
  });
});
