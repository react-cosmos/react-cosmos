jest.mock('loader-utils');

const loaderUtils = require('loader-utils');
const entryLoader = require('../entry-loader');

loaderUtils.__setMocks({
  components: '__MOCK_COMPONENTS__',
  fixtures: '__MOCK_FIXTURES__',
});

const loaderContext = {
  query: 'all component and fixture paths are crammed in here',
};
const loaderInput = 'components = COMPONENTS; fixtures = FIXTURES;';
const loaderOutput = entryLoader.call(loaderContext, loaderInput);

test('calls loaderUtils.parseQuery with context query', () => {
  expect(loaderUtils.parseQuery.mock.calls[0][0]).toBe(loaderContext.query);
});

test('replaces COMPONENTS body with components code', () => {
  expect(loaderOutput).toMatch('components = __MOCK_COMPONENTS__');
});

test('replaces FIXTURES body with fixtures code', () => {
  expect(loaderOutput).toMatch('fixtures = __MOCK_FIXTURES__');
});
