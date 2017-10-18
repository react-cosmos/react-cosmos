// @flow

import path from 'path';
import getCosmosConfig from '../../';

jest.mock('yargs', () => ({ argv: { config: 'cozmos.config' } }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('when no config exists at explicit path', () => {
  it('returns server defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [],
      hostname: 'localhost',
      port: 8989,
      publicUrl: '/loader/',
      hot: true
    });
  });

  it('returns absolute root path', () => {
    const config = getCosmosConfig();
    expect(config.rootPath).toBe(mocksPath);
  });

  it('returns absolute default proxies path', () => {
    const config = getCosmosConfig();
    expect(config.proxiesPath).toBe(path.join(mocksPath, 'cosmos.proxies'));
  });

  it('returns absolute default webpack config path', () => {
    const config = getCosmosConfig();
    expect(config.webpackConfigPath).toBe(
      path.join(mocksPath, 'webpack.config')
    );
  });

  it('returns absolute default output path', () => {
    const config = getCosmosConfig();
    expect(config.outputPath).toBe(path.join(mocksPath, 'cosmos-export'));
  });
});
