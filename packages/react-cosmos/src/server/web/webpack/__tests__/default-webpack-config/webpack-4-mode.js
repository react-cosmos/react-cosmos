import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      webpack: { version: '4.2.0' }
    };
    return mocks[loaderName];
  }
}));

it('sets config.mode as NODE_ENV', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.mode).toEqual('development');
});
