// @flow

import path from 'path';
import { getCosmosConfig } from '../../../';

jest.mock('yargs', () => ({ argv: {} }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when no config exists', () => {
  it('returns normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [],
      hostname: 'localhost',
      hot: true,
      outputPath: path.join(mocksPath, 'cosmos-export'),
      port: 8989,
      proxiesPath: path.join(mocksPath, 'cosmos.proxies'),
      publicUrl: '/loader/',
      rootPath: mocksPath,
      webpackConfigPath: path.join(mocksPath, 'webpack.config')
    });
  });
});
