/**
 * @flow
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'fs';
import rimraf from 'rimraf';
import { slash } from 'react-cosmos-shared/server';
import { replaceKeys } from '../../shared/template';
import { generateExport } from '../export';

const mockRootPath = __dirname;
const mockOutputPath = slash(__dirname, './__jestnowatch__/export');

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    publicUrl: '/',
    outputPath: mockOutputPath,
    watchDirs: ['.'],
    globalImports: [],
    // Deprecated options needed for backwards compatibility
    componentPaths: []
  })
}));

// Export tests share a single beforeAll case to minimize fs writes
beforeAll(async () => {
  jest.clearAllMocks();
  await generateExport();
});

afterAll(() => {
  rimraf.sync(slash(mockOutputPath, '**/*'));
});

describe('webpack files', () => {
  it('exports _loader.html', () => {
    expect(existsSync(slash(mockOutputPath, '_loader.html'))).toBe(true);
  });

  it('exports main.js', () => {
    expect(existsSync(slash(mockOutputPath, 'main.js'))).toBe(true);
  });
});

describe('playground files', () => {
  it('exports _cosmos.ico', () => {
    expect(existsSync(slash(mockOutputPath, '_cosmos.ico'))).toBe(true);
  });

  it('exports _playground.js', () => {
    expect(existsSync(slash(mockOutputPath, '_playground.js'))).toBe(true);
  });

  it('exports index.html', () => {
    expect(existsSync(slash(mockOutputPath, 'index.html'))).toBe(true);
  });

  it('exports index.html with template vars replaced', () => {
    const inputPath = slash(__dirname, '../../shared/static/index.html');
    const outputPath = slash(mockOutputPath, 'index.html');
    const optsStr = JSON.stringify({
      platform: 'web',
      projectKey: mockRootPath,
      loaderUri: '/_loader.html',
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': true
      }
    });

    expect(readFileSync(outputPath, 'utf8')).toBe(
      replaceKeys(readFileSync(inputPath, 'utf8'), {
        __SCRIPT_SRC__: '_playground.js',
        __PLAYGROUND_OPTS__: optsStr
      })
    );
  });
});
