// @flow

import path from 'path';
import { getCosmosConfig } from '../../../';

jest.mock('yargs', () => ({ argv: { config: 'nested/cosmos.config' } }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('[CLI path] when config exists at custom path', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [path.join(mocksPath, 'nested/some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: path.join(mocksPath, 'nested/cosmos-export'),
      port: 9000,
      proxiesPath: path.join(mocksPath, 'nested/cosmos.proxies'),
      publicUrl: '/loader/',
      rootPath: path.join(mocksPath, 'nested'),
      webpackConfigPath: path.join(mocksPath, 'nested/webpack.config')
    });
  });
});
