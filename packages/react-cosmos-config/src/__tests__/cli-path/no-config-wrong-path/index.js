// @flow

import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: { config: 'cozmos.config' } }));

const mocksPath = slash(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when no config exists at explicit path', () => {
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
});
