import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({ silent: () => {} }));

it('has empty module.rules list', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toEqual([]);
});
