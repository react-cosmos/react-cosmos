/**
 * @flow
 * @jest-environment node
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import rimraf from 'rimraf';
import { generateExport } from '../export';

const mockRootPath = __dirname;
const mockOutputPath = join(__dirname, './__fsoutput__/export');

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
  rimraf.sync(join(mockOutputPath, '**/*'));
});

describe('webpack files', () => {
  it('exports _loader.html', () => {
    expect(existsSync(join(mockOutputPath, '_loader.html'))).toBe(true);
  });

  it('exports main.js', () => {
    expect(existsSync(join(mockOutputPath, 'main.js'))).toBe(true);
  });
});

describe('playground files', () => {
  it('exports _cosmos.ico', () => {
    expect(existsSync(join(mockOutputPath, '_cosmos.ico'))).toBe(true);
  });

  it('exports _playground.js', () => {
    expect(existsSync(join(mockOutputPath, '_playground.js'))).toBe(true);
  });

  it('exports index.html', () => {
    expect(existsSync(join(mockOutputPath, 'index.html'))).toBe(true);
  });

  it('exports index.html with __PLAYGROUND_OPTS__ replaced', () => {
    const inputPath = join(__dirname, '../../shared/static/index.html');
    const outputPath = join(mockOutputPath, 'index.html');
    const optsStr = JSON.stringify({
      projectKey: mockRootPath,
      loaderTransport: 'postMessage',
      loaderUri: '/_loader.html',
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': true
      }
    });

    expect(readFileSync(outputPath, 'utf8')).toBe(
      readFileSync(inputPath, 'utf8').replace('__PLAYGROUND_OPTS__', optsStr)
    );
  });
});
