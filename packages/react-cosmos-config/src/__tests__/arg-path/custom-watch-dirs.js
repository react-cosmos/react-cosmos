// @flow

import { dirname } from 'path';
import { slash } from 'react-cosmos-shared/server';
import { getCosmosConfig } from '../..';

const configPath = slash(
  require.resolve('./__fsmocks__/cosmos-watch-dirs.config.js')
);
const rootPath = dirname(configPath);

describe('[arg path] when config exists', () => {
  it('extends normalized defaults', () => {
    const config = getCosmosConfig(configPath);
    expect(config).toMatchObject({
      globalImports: [slash(rootPath, 'some-polyfill')],
      hostname: '127.0.0.1',
      hot: true,
      outputPath: slash(rootPath, 'cosmos-export'),
      port: 9000,
      proxiesPath: slash(rootPath, 'cosmos.proxies'),
      publicPath: slash(rootPath, 'static'),
      publicUrl: '/',
      rootPath,
      webpackConfigPath: slash(rootPath, 'webpack.config'),
      watchDirs: [slash(rootPath, 'src'), slash(rootPath, 'fixtures')]
    });
  });
});
