// @flow

import { dirname } from 'path';
import { slash } from 'react-cosmos-shared/server';
import mkdirp from 'mkdirp';
import touch from 'touch';
import rimraf from 'rimraf';
import { generateCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: {} }));

const outputPath = slash(__dirname, '__jestnowatch__');
const craWebpackConfigPath = slash(
  outputPath,
  'node_modules/react-scripts/config/webpack.config.dev'
);
const cosmosConfigPath = slash(outputPath, 'cosmos.config.js');

beforeEach(() => {
  global.process.cwd = () => outputPath;

  mkdirp.sync(dirname(craWebpackConfigPath));
  touch.sync(craWebpackConfigPath);
});

afterEach(() => {
  rimraf.sync(slash(outputPath, 'node_modules'));
  rimraf.sync(cosmosConfigPath);
});

describe('Create React App config generation', () => {
  it('returns correct name', () => {
    const generatedConfigFor = generateCosmosConfig();
    expect(generatedConfigFor).toBe('Create React App');
  });

  it('creates config file', () => {
    generateCosmosConfig();
    expect(require(cosmosConfigPath)).toEqual({
      containerQuerySelector: '#root',
      webpackConfigPath: 'react-scripts/config/webpack.config.dev',
      publicPath: 'public',
      proxiesPath: 'src/cosmos.proxies'
    });
  });
});
