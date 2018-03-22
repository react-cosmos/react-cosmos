// @flow

import path from 'path';
import { getCosmosConfig } from '../..';

const configPath = require.resolve('./__fsmocks__/cosmos.config.js');
const rootPath = path.dirname(configPath);

describe('[arg path] when config exists', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig(configPath);
    expect(config).toMatchObject({
      globalImports: [path.join(rootPath, 'some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: path.join(rootPath, 'cosmos-export'),
      port: 9000,
      proxiesPath: path.join(rootPath, 'cosmos.proxies'),
      publicPath: path.join(rootPath, 'static'),
      publicUrl: '/loader/',
      rootPath,
      webpackConfigPath: path.join(rootPath, 'webpack.config')
    });
  });
});
