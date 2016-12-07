const fakeStartLoader = jest.fn();
const fakeStartPlayground = jest.fn();
const fakeProxies = {};
const fakeComponents = {};
const fakeFixtures = {};
const fakeContainerQuerySelector = '#root';

jest.mock('../start-loader', () => fakeStartLoader);
jest.mock('../start-playground', () => fakeStartPlayground);

const startCosmos = require('../index');

const init = (pathname) => {
  jest.clearAllMocks();

  Object.defineProperty(window.location, 'pathname', {
    writable: true,
    value: pathname,
  });

  startCosmos({
    proxies: fakeProxies,
    components: fakeComponents,
    fixtures: fakeFixtures,
    containerQuerySelector: fakeContainerQuerySelector,
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
