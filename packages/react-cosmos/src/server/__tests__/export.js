/**
 * @jest-environment node
 */

import fs from 'fs';
import { join } from 'path';
import rimraf from 'rimraf';
import startExport from '../export';

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
  await startExport();
});

afterAll(() => {
  rimraf.sync(join(mockOutputPath, '**/*'));
});

describe('webpack files', () => {
  it('exports _loader.html', () => {
    expect(fs.existsSync(join(mockOutputPath, '_loader.html'))).toBe(true);
  });

  it('exports main.js', () => {
    expect(fs.existsSync(join(mockOutputPath, 'main.js'))).toBe(true);
  });
});

describe('playground files', () => {
  it('exports _cosmos.ico', () => {
    expect(fs.existsSync(join(mockOutputPath, '_cosmos.ico'))).toBe(true);
  });

  it('exports _playground.js', () => {
    expect(fs.existsSync(join(mockOutputPath, '_playground.js'))).toBe(true);
  });

  it('exports index.html', () => {
    expect(fs.existsSync(join(mockOutputPath, 'index.html'))).toBe(true);
  });

  it('exports index.html with __PLAYGROUND_OPTS__ replaced', () => {
    const inputPath = join(__dirname, '../static/index.html');
    const outputPath = join(mockOutputPath, 'index.html');
    const optsStr = JSON.stringify({
      loaderUri: '/_loader.html',
      projectKey: mockRootPath,
      webpackConfigType: 'default',
      deps: {
        'html-webpack-plugin': true
      }
    });

    expect(fs.readFileSync(outputPath, 'utf8')).toBe(
      fs.readFileSync(inputPath, 'utf8').replace('__PLAYGROUND_OPTS__', optsStr)
    );
  });
});
