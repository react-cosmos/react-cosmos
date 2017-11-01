import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';
import extendWebpackConfig from '../extend-webpack-config';
import startExport from '../export';

const mockRootPath = __dirname;
const mockOutputPath = path.join(__dirname, './__fsoutput__/export');

jest.mock('react-cosmos-config', () => () => ({
  rootPath: mockRootPath,
  outputPath: mockOutputPath,
  globalImports: [],
  componentPaths: []
}));

jest.mock('webpack', () =>
  jest.fn(() => ({
    run: jest.fn(cb => {
      cb(null, {});
    })
  }))
);

jest.mock('../default-webpack-config', () =>
  jest.fn(() => 'MOCK_DEFAULT_WEBPACK_CONFIG')
);

jest.mock('../extend-webpack-config', () =>
  jest.fn(() => 'MOCK_WEBPACK_CONFIG')
);

// Warning: Export tests share a single beforeAll case to minimize fs writes
beforeAll(() => {
  jest.clearAllMocks();
  startExport();
});

afterAll(() => {
  rimraf.sync(path.join(mockOutputPath, '**/*'));
});

it('extends default webpack config with export flag', () => {
  expect(extendWebpackConfig).toHaveBeenCalledWith({
    webpack,
    userWebpackConfig: 'MOCK_DEFAULT_WEBPACK_CONFIG',
    shouldExport: true
  });
});

it('calls webpack compiler with mock', () => {
  expect(webpack).toHaveBeenCalledWith('MOCK_WEBPACK_CONFIG');
});

describe('playground files', () => {
  it('exports favicon.ico', () => {
    expect(fs.existsSync(path.join(mockOutputPath, 'favicon.ico'))).toBe(true);
  });

  it('exports bundle.js', () => {
    expect(fs.existsSync(path.join(mockOutputPath, 'bundle.js'))).toBe(true);
  });

  it('exports index.html', () => {
    expect(fs.existsSync(path.join(mockOutputPath, 'index.html'))).toBe(true);
  });

  it('exports index.html with __PLAYGROUND_OPTS__ replaced', () => {
    const inputPath = path.join(__dirname, '../static/index.html');
    const outputPath = path.join(mockOutputPath, 'index.html');
    const optsStr = JSON.stringify({
      loaderUri: './loader/index.html',
      projectKey: mockRootPath
    });

    expect(fs.readFileSync(outputPath, 'utf8')).toBe(
      fs.readFileSync(inputPath, 'utf8').replace('__PLAYGROUND_OPTS__', optsStr)
    );
  });
});
