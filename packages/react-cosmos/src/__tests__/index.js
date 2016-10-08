const FakeRouter = jest.fn();
const FakeComponentPlayground = () => {};
const fakeProxies = [];
const fakeComponentsInput = {};
const fakeFixturesInput = {};
const fakeComponentsOutput = {};
const fakeFixturesOutput = {};
const fakeLoadComponents = jest.fn(() => fakeComponentsOutput);
const fakeLoadFixtures = jest.fn(() => fakeFixturesOutput);

jest.mock('react-querystring-router', () => ({ Router: FakeRouter }));
jest.mock('react-component-playground', () => FakeComponentPlayground);
jest.mock('../load-modules', () => ({
  loadComponents: fakeLoadComponents,
  loadFixtures: fakeLoadFixtures,
}));

const startReactCosmos = require('../index');

const routerInstance = startReactCosmos({
  proxies: fakeProxies,
  components: fakeComponentsInput,
  fixtures: fakeFixturesInput,
});

it('uses Componet Playground as router component class', () => {
  const { getComponentClass } = FakeRouter.mock.calls[0][0];
  expect(getComponentClass()).toBe(FakeComponentPlayground);
});

it('sends proxies to Component Playground props', () => {
  const { proxies } = FakeRouter.mock.calls[0][0].defaultProps;
  expect(proxies).toBe(fakeProxies);
});

it('sends components input to loadComponents lib', () => {
  expect(fakeLoadComponents.mock.calls[0][0]).toBe(fakeComponentsInput);
});

it('sends fixtures input to loadFixtures lib', () => {
  expect(fakeLoadFixtures.mock.calls[0][0]).toBe(fakeFixturesInput);
});

it('sends components output to Component Playground props', () => {
  const { components } = FakeRouter.mock.calls[0][0].defaultProps;
  expect(components).toBe(fakeComponentsOutput);
});

it('sends fixtures output to Component Playground props', () => {
  const { fixtures } = FakeRouter.mock.calls[0][0].defaultProps;
  expect(fixtures).toBe(fakeFixturesOutput);
});

it('returns router instance', () => {
  expect(routerInstance).toBeInstanceOf(FakeRouter);
});
