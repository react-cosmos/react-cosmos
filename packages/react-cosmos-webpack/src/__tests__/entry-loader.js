jest.mock('loader-utils');

const loaderUtils = require('loader-utils');
const entryLoader = require('../entry-loader');

loaderUtils.__setParseQueryMocks({
  componentPaths: [
    '/somewhere/over/the/rainbow/components',
    '/somewhere/over/the/rainbow/containers',
  ],
  fixturePaths: [
    '/somewhere/over/the/rainbow/test/fixtures',
  ],
});

const jsonLoader = require.resolve('json-loader');
const loaderContext = {
  query: 'all component and fixture paths are crammed in here',
};
const loaderInput = 'components = COMPONENT_CONTEXTS; fixtures = FIXTURE_CONTEXTS;';
const loaderOutput = entryLoader.call(loaderContext, loaderInput);

/* eslint-disable max-len */
const component1Context =
  'require.context(\'/somewhere/over/the/rainbow/components\', true, /\\.jsx?$/';
const component2Context =
  'require.context(\'/somewhere/over/the/rainbow/containers\', true, /\\.jsx?$/';
const component1FixtureContext =
  'require.context(\'/somewhere/over/the/rainbow/components\', true, /\\/__fixtures__\\/.+\\.js$/)';
const component1FixtureJsonContext =
  `require.context('${jsonLoader}!/somewhere/over/the/rainbow/components', true, /\\/__fixtures__\\/.+\\.json$/)`;
const component2FixtureContext =
  'require.context(\'/somewhere/over/the/rainbow/containers\', true, /\\/__fixtures__\\/.+\\.js$/)';
const component2FixtureJsonContext =
  `require.context('${jsonLoader}!/somewhere/over/the/rainbow/containers', true, /\\/__fixtures__\\/.+\\.json$/)`;
const customFixtureContext =
  'require.context(\'/somewhere/over/the/rainbow/test/fixtures\', true, /\\.js$/)';
const customFixtureJsonContext =
  `require.context('${jsonLoader}!/somewhere/over/the/rainbow/test/fixtures', true, /\\.json$/)`;
/* eslint-enable max-len */

test('calls loaderUtils.parseQuery with context query', () => {
  expect(loaderUtils.parseQuery.mock.calls[0][0]).toBe(loaderContext.query);
});

test('creates context for 1st component path', () => {
  expect(loaderOutput).toContain(component1Context);
});

test('creates context for 2nd component path', () => {
  expect(loaderOutput).toContain(component2Context);
});

test('creates __fixtures__ context for 1st component path', () => {
  expect(loaderOutput).toContain(component1FixtureContext);
});

test('creates __fixtures__ .json context for 1st component path', () => {
  expect(loaderOutput).toContain(component1FixtureJsonContext);
});

test('creates __fixtures__ context for 2st component path', () => {
  expect(loaderOutput).toContain(component2FixtureContext);
});

test('creates __fixtures__ .json context for 2st component path', () => {
  expect(loaderOutput).toContain(component2FixtureJsonContext);
});

test('creates context for custom fixture path', () => {
  expect(loaderOutput).toContain(customFixtureContext);
});

test('creates .json context for custom fixture path', () => {
  expect(loaderOutput).toContain(customFixtureJsonContext);
});

test('replaces placeholders with valid arrays', () => {
  const [, c, f] = loaderOutput.match(/^components = (.+); fixtures = (.+);$/);

  /* eslint-disable no-eval */
  const components = eval(c.replace(/require.context/g, ''));
  const fixtures = eval(f.replace(/require.context/g, ''));
  /* eslint-enable no-eval */

  expect(components.length).toBe(2);
  expect(fixtures.length).toBe(6);
});
