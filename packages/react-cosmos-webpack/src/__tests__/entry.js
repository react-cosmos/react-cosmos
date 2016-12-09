/* global window */

const fakeComponents = {};
const fakeFixtures = {};
const fakeExpandModulePaths = jest.fn(() => ({
  components: fakeComponents,
  fixtures: fakeFixtures,
}));
const fakeStartLoader = jest.fn();
const fakeStartPlayground = jest.fn();
const fakeProxies = [];
const fakeIgnore = [];
const fakeContainerQuerySelector = '#root';

jest.mock('./dummy-config/cosmos.config.js', () => ({
  proxies: fakeProxies,
  ignore: fakeIgnore,
  containerQuerySelector: fakeContainerQuerySelector,
}));

jest.mock('react-cosmos', () => ({
  startLoader: fakeStartLoader,
  startPlayground: fakeStartPlayground,
}));

jest.mock('../utils/expand-module-paths', () => ({ default: fakeExpandModulePaths }));

const init = (pathname) => {
  jest.resetModules();
  jest.clearAllMocks();

  Object.defineProperty(window.location, 'pathname', {
    writable: true,
    value: pathname,
  });

  require('../entry');
};

const commonTests = () => {
  test('calls expandModulePaths with component contexts', () => {
    // Component contexts are mocked inside jest.config.json
    expect(fakeExpandModulePaths.mock.calls[0][0]).toBe('__COMPONENT_CONTEXTS__');
  });

  test('calls expandModulePaths with fixture contexts', () => {
    // Fixture contexts are mocked inside jest.config.json
    expect(fakeExpandModulePaths.mock.calls[0][1]).toBe('__FIXTURE_CONTEXTS__');
  });

  test('calls expandModulePaths with ignore paths', () => {
    // Fixture contexts are mocked inside jest.config.json
    expect(fakeExpandModulePaths.mock.calls[0][2]).toBe(fakeIgnore);
  });
};

describe('loader path', () => {
  let options;

  beforeAll(() => {
    init('/loader/');
    options = fakeStartLoader.mock.calls[0][0];
  });

  test('starts loader', () => {
    expect(fakeStartLoader).toHaveBeenCalled();
  });

  test('sends proxies to loader', () => {
    expect(options.proxies).toBe(fakeProxies);
  });

  test('sends components to loader', () => {
    expect(options.components).toBe(fakeComponents);
  });

  test('sends fixtures to loader', () => {
    expect(options.fixtures).toBe(fakeFixtures);
  });

  test('sends containerQuerySelector to loader', () => {
    expect(options.containerQuerySelector).toBe(fakeContainerQuerySelector);
  });
});

describe('playground path', () => {
  let options;

  beforeAll(() => {
    init('/');
    options = fakeStartPlayground.mock.calls[0][0];
  });

  commonTests();

  test('starts playground', () => {
    expect(fakeStartPlayground).toHaveBeenCalled();
  });

  test('sends fixtures to playground', () => {
    expect(options.fixtures).toBe(fakeFixtures);
  });

  test('sends loaderUri to playground', () => {
    expect(options.loaderUri).toBe('/loader/');
  });
});
