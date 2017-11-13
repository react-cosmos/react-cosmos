// @flow

import path from 'path';
import { getCosmosConfig } from '../../../';

jest.mock('yargs', () => ({ argv: {} }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when config exists at default path', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [path.join(mocksPath, 'some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: path.join(mocksPath, 'cosmos-export'),
      port: 9000,
      proxiesPath: path.join(mocksPath, 'cosmos.proxies'),
      publicUrl: '/loader/',
      rootPath: mocksPath,
      webpackConfigPath: path.join(mocksPath, 'webpack.config')
    });
  });
});
