import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      webpack: { version: '3.5.0' }
    };
    return mocks[loaderName];
  }
}));

it('does not add config.mode', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.mode).not.toBeDefined();
});
