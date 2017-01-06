const mockRouter = jest.fn();
const mockComponentPlayground = () => {};
const mockFixturesInput = {};
const mockFixturesOutput = {};
let mockLoadFixtures;
let startPlayground;
let routerInstance;
let getComponentClass;
let getComponentProps;
let onChange;

const initRouter = (options) => {
  jest.resetModules();
  jest.resetAllMocks();

  mockLoadFixtures = jest.fn(() => mockFixturesOutput);

  jest.mock('react-querystring-router', () => ({ Router: mockRouter }));
  jest.mock('react-component-playground', () => mockComponentPlayground);
  jest.mock('../load-modules', () => ({
    loadFixtures: mockLoadFixtures,
  }));

  startPlayground = require('../start-playground');

  routerInstance = startPlayground(options);
  ({
    getComponentClass,
    getComponentProps,
    onChange,
  } = mockRouter.mock.calls[0][0]);
};

beforeAll(() => {
  initRouter({
    fixtures: mockFixturesInput,
    loaderUri: '/fake-loader-uri/',
  });
});

it('uses Playground as router component class', () => {
  expect(getComponentClass()).toBe(mockComponentPlayground);
});

it('sends fixtures input to loadFixtures lib', () => {
  getComponentProps();
  expect(mockLoadFixtures.mock.calls[0][0]).toBe(mockFixturesInput);
});

it('puts fixtures in Playground props', () => {
  const { fixtures } = getComponentProps();
  expect(fixtures).toBe(mockFixturesOutput);
});

it('puts loaderUri option in Playground props', () => {
  const { loaderUri } = getComponentProps();
  expect(loaderUri).toBe('/fake-loader-uri/');
});

it('returns router instance', () => {
  expect(routerInstance).toBeInstanceOf(mockRouter);
});

it('uses element inside document body for router container', () => {
  const { container } = mockRouter.mock.calls[0][0];
  expect(container.parentNode).toBe(document.body);
});

it('sets document title to "React Cosmos" on home route', () => {
  onChange({});
  expect(document.title).toBe('React Cosmos');
});

it('sets component and fixture in documet title', () => {
  onChange({
    component: 'Foo',
    fixture: 'bar',
  });
  expect(document.title).toBe('Foo:bar – React Cosmos');
});
