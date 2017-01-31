/* global window */

const mockComponents = {};
const mockFixtures = {};
const mockProxies = [];
const mockStartLoader = jest.fn();
const mockStartPlayground = jest.fn();

let mockGetUserModules;

jest.mock('react-cosmos', () => ({
  startLoader: mockStartLoader,
  startPlayground: mockStartPlayground,
}));

jest.mock('../user-modules', () => ({ default: mockGetUserModules }));

const init = pathname => {
  jest.resetModules();
  jest.resetAllMocks();

  Object.defineProperty(window.location, 'pathname', {
    writable: true,
    value: pathname,
  });

  mockGetUserModules = jest.fn(() => ({
    components: mockComponents,
    fixtures: mockFixtures,
    proxies: mockProxies,
  }));

  require('../entry');
};

const commonTests = () => {
  test('calls expandModulePaths with ignore paths', () => {
    expect(mockGetUserModules).toHaveBeenCalled();
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
    // Mocked in jest.config.js
    expect(options.containerQuerySelector).toBe('__mock__containerQuerySelector');
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
