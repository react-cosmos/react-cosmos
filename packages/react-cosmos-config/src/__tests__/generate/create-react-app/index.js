// @flow

import path from 'path';
import mkdirp from 'mkdirp';
import touch from 'touch';
import rimraf from 'rimraf';
import { generateCosmosConfig } from '../../..';

jest.mock('yargs', () => ({ argv: {} }));

// Note: __fsoutput__ are in Jest's watchPathIgnorePatterns
const outputPath = path.join(__dirname, '__fsoutput__');
const craWebpackConfigPath = path.join(
  outputPath,
  'node_modules/react-scripts/config/webpack.config.dev'
);
const cosmosConfigPath = path.join(outputPath, 'cosmos.config.js');

beforeEach(() => {
  global.process.cwd = () => outputPath;

  mkdirp.sync(path.dirname(craWebpackConfigPath));
  touch.sync(craWebpackConfigPath);
});

afterEach(() => {
  rimraf.sync(path.join(outputPath, 'node_modules'));
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
