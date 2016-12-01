const FakeRouter = jest.fn();
const FakeComponentPlayground = () => {};
const fakeFixturesInput = {};
const fakeFixturesOutput = {};
const fakeLoadFixtures = jest.fn(() => fakeFixturesOutput);

jest.mock('react-querystring-router', () => ({ Router: FakeRouter }));
jest.mock('react-component-playground', () => FakeComponentPlayground);
jest.mock('../load-modules', () => ({
  loadFixtures: fakeLoadFixtures,
}));

const startPlayground = require('../start-playground');

let routerInstance;
let getComponentClass;
let getComponentProps;
let onChange;

const initRouter = (options) => {
  jest.clearAllMocks();
  routerInstance = startPlayground(options);
  ({
    getComponentClass,
    getComponentProps,
    onChange,
  } = FakeRouter.mock.calls[0][0]);
};

beforeAll(() => {
  initRouter({
    fixtures: fakeFixturesInput,
    loaderUri: '/fake-loader-uri/',
  });
});

it('uses Playground as router component class', () => {
  expect(getComponentClass()).toBe(FakeComponentPlayground);
});

it('sends fixtures input to loadFixtures lib', () => {
  getComponentProps();
  expect(fakeLoadFixtures.mock.calls[0][0]).toBe(fakeFixturesInput);
});

it('puts fixtures in Playground props', () => {
  const { fixtures } = getComponentProps();
  expect(fixtures).toBe(fakeFixturesOutput);
});

it('puts loaderUri option in Playground props', () => {
  const { loaderUri } = getComponentProps();
  expect(loaderUri).toBe('/fake-loader-uri/');
});

it('returns router instance', () => {
  expect(routerInstance).toBeInstanceOf(FakeRouter);
});

it('uses element inside document body for router container', () => {
  const { container } = FakeRouter.mock.calls[0][0];
  expect(container.parentNode).toBe(document.body);
});

it('sets document title to "React Cosmos" on home route', () => {
  onChange({});
  expect(document.title).toBe('React Cosmos');
});

it('sets componet and fixture in documet title', () => {
  onChange({
    component: 'Foo',
    fixture: 'bar',
  });
  expect(document.title).toBe('Foo:bar – React Cosmos');
});
