import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      webpack: {}
    };

    return mocks[loaderName];
  }
}));

it('has empty plugins list', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.plugins).toEqual([]);
});
