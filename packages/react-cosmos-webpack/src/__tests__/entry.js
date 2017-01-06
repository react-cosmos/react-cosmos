/* global window */

const mockComponents = {};
const mockFixtures = {};
const mockStartLoader = jest.fn();
const mockStartPlayground = jest.fn();
const mockProxies = [];
const mockIgnore = [];
const mockContainerQuerySelector = '#root';

let mockExpandModulePaths;

jest.mock('./dummy-config/cosmos.config.js', () => ({
  proxies: mockProxies,
  ignore: mockIgnore,
  containerQuerySelector: mockContainerQuerySelector,
}));

jest.mock('react-cosmos', () => ({
  startLoader: mockStartLoader,
  startPlayground: mockStartPlayground,
}));


jest.mock('../utils/expand-module-paths', () => ({ default: mockExpandModulePaths }));

const init = (pathname) => {
  jest.resetModules();
  jest.resetAllMocks();

  Object.defineProperty(window.location, 'pathname', {
    writable: true,
    value: pathname,
  });

  mockExpandModulePaths = jest.fn(() => ({
    components: mockComponents,
    fixtures: mockFixtures,
  }));

  require('../entry');
};

const commonTests = () => {
  test('calls expandModulePaths with component contexts', () => {
    // Component contexts are mocked inside jest.config.json
    expect(mockExpandModulePaths.mock.calls[0][0]).toBe('__COMPONENT_CONTEXTS__');
  });

  test('calls expandModulePaths with fixture contexts', () => {
    // Fixture contexts are mocked inside jest.config.json
    expect(mockExpandModulePaths.mock.calls[0][1]).toBe('__FIXTURE_CONTEXTS__');
  });

  test('calls expandModulePaths with ignore paths', () => {
    // Fixture contexts are mocked inside jest.config.json
    expect(mockExpandModulePaths.mock.calls[0][2]).toBe(mockIgnore);
  });
};

describe('loader path', () => {
  let options;

  beforeAll(() => {
    init('/loader/');
    options = mockStartLoader.mock.calls[0][0];
  });

  test('starts loader', () => {
    expect(mockStartLoader).toHaveBeenCalled();
  });

  test('sends proxies to loader', () => {
    expect(options.proxies).toBe(mockProxies);
  });

  test('sends components to loader', () => {
    expect(options.components).toBe(mockComponents);
  });

  test('sends fixtures to loader', () => {
    expect(options.fixtures).toBe(mockFixtures);
  });

  test('sends containerQuerySelector to loader', () => {
    expect(options.containerQuerySelector).toBe(mockContainerQuerySelector);
  });
});

describe('playground path', () => {
  let options;

  beforeAll(() => {
    init('/');
    options = mockStartPlayground.mock.calls[0][0];
  });

  commonTests();

  test('starts playground', () => {
    expect(mockStartPlayground).toHaveBeenCalled();
  });

  test('sends fixtures to playground', () => {
    expect(options.fixtures).toBe(mockFixtures);
  });

  test('sends loaderUri to playground', () => {
    expect(options.loaderUri).toBe('/loader/');
  });
});
