import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({ silent: () => {} }));

it('has empty plugins list', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.plugins).toEqual([]);
});
