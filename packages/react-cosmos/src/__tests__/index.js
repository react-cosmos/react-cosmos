const FakeRouter = jest.fn();
const FakeComponentPlayground = () => {};
const fakeProxies = [{}, {}];
const fakeComponentsInput = {};
const fakeFixturesInput = {};
const fakeComponentsOutput = {};
const fakeFixturesOutput = {};
const fakeLoadComponents = jest.fn(() => fakeComponentsOutput);
const fakeLoadFixtures = jest.fn(() => fakeFixturesOutput);
const fakeLinkedList = {};

jest.mock('react-querystring-router', () => ({ Router: FakeRouter }));
jest.mock('react-component-playground', () => FakeComponentPlayground);
jest.mock('../load-modules', () => ({
  loadComponents: fakeLoadComponents,
  loadFixtures: fakeLoadFixtures,
}));
jest.mock('../linked-list', () => jest.fn(() => fakeLinkedList));

const PreviewLoader = require('../proxies/PreviewLoader').default;
const createLinkedList = require('../linked-list');
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

it('create proxy list with user proxies', () => {
  expect(createLinkedList.mock.calls[0][0][0]).toBe(fakeProxies[0]);
  expect(createLinkedList.mock.calls[0][0][1]).toBe(fakeProxies[1]);
});

it('end proxy list with internal proxies', () => {
  expect(createLinkedList.mock.calls[0][0][3]).toBe(PreviewLoader);
});

it('sends proxy list to Component Playground props', () => {
  const { firstProxy } = FakeRouter.mock.calls[0][0].defaultProps;
  expect(firstProxy).toBe(fakeLinkedList);
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
