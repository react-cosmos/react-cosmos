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

it('has empty module.rules list', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toEqual([]);
});
