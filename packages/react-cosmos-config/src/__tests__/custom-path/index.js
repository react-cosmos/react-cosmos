// @flow

import path from 'path';
import getCosmosConfig from '../../';

jest.mock('yargs', () => ({ argv: { config: 'nested/cosmos.config' } }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('when no config exists', () => {
  it('returns extended server defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [path.join(mocksPath, 'nested/some-polyfill')],
      hostname: '127.0.0.1',
      port: 9000,
      publicUrl: '/loader/',
      hot: true
    });
  });

  it('returns absolute root path', () => {
    const config = getCosmosConfig();
    expect(config.rootPath).toBe(path.join(mocksPath, 'nested'));
  });

  it('returns absolute default proxies path', () => {
    const config = getCosmosConfig();
    expect(config.proxiesPath).toBe(
      path.join(mocksPath, 'nested/cosmos.proxies')
    );
  });

  it('returns absolute default webpack config path', () => {
    const config = getCosmosConfig();
    expect(config.webpackConfigPath).toBe(
      path.join(mocksPath, 'nested/webpack.config')
    );
  });

  it('returns absolute default output path', () => {
    const config = getCosmosConfig();
    expect(config.outputPath).toBe(
      path.join(mocksPath, 'nested/cosmos-export')
    );
  });
});
