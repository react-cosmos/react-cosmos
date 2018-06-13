// @flow

import path from 'path';
import { getCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: { config: 'cozmos.config' } }));

const mocksPath = path.join(__dirname, '__fsmocks__');

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
      outputPath: path.join(mocksPath, 'cosmos-export'),
      port: 8989,
      proxiesPath: path.join(mocksPath, 'cosmos.proxies'),
      publicUrl: '/',
      rootPath: mocksPath,
      webpackConfigPath: path.join(mocksPath, 'webpack.config')
    });
  });
});
