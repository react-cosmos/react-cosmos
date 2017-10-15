// @flow

import path from 'path';
import getCosmosConfig from '../../';

jest.mock('yargs', () => ({ argv: {} }));

const mocksPath = path.join(__dirname, '__fsmocks__');

beforeEach(() => {
  global.process.cwd = () => mocksPath;
});

describe('when no config exists', () => {
  it('gets server defaults', () => {
    const config = getCosmosConfig();
    expect(config).toMatchObject({
      globalImports: [],
      hostname: 'localhost',
      port: 8989,
      publicUrl: '/loader/',
      hot: true
    });
  });

  it('gets root path', () => {
    const config = getCosmosConfig();
    expect(config.rootPath).toBe(mocksPath);
  });

  it('gets default proxies path', () => {
    const config = getCosmosConfig();
    expect(config.proxiesPath).toBe(path.join(mocksPath, 'cosmos.proxies'));
  });

  it('gets default webpack config path', () => {
    const config = getCosmosConfig();
    expect(config.webpackConfigPath).toBe(
      path.join(mocksPath, 'webpack.config')
    );
  });

  it('gets default output path', () => {
    const config = getCosmosConfig();
    expect(config.outputPath).toBe(path.join(mocksPath, 'cosmos-export'));
  });
});
