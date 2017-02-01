const mockComponentElement = {};
const mockLoader = () => {};
const mockPropsProxy = () => {};
const mockStateProxy = () => {};
const mockProxy1 = {};
const mockProxy2 = {};
const mockProxies = [() => mockProxy1, () => mockProxy2];
const mockComponentsInput = {};
const mockFixturesInput = {};
const mockComponentsOutput = {};
const mockFixturesOutput = {};
let mockReact;
let mockLoadComponents;
let mockLoadFixtures;
let createLoaderElement;
let props;

const init = options => {
  jest.resetModules();
  jest.resetAllMocks();

  mockReact = {
    createElement: jest.fn(() => mockComponentElement),
  };
  mockLoadComponents = jest.fn(() => mockComponentsOutput);
  mockLoadFixtures = jest.fn(() => mockFixturesOutput);

  jest.mock('react', () => mockReact);
  jest.mock('../components/Loader', () => mockLoader);
  jest.mock('../components/proxies/StateProxy', () => () => mockStateProxy);
  jest.mock('../components/proxies/PropsProxy', () => mockPropsProxy);
  jest.mock('../load-modules', () => ({
    loadComponents: mockLoadComponents,
    loadFixtures: mockLoadFixtures,
  }));

  createLoaderElement = require('../create-loader-element').default;

  createLoaderElement(options);

  props = mockReact.createElement.mock.calls[0][1];
};

beforeAll(() => {
  init({
    proxies: mockProxies,
    components: mockComponentsInput,
    fixtures: mockFixturesInput,
  });
});

test('creates Loader element', () => {
  expect(mockReact.createElement.mock.calls[0][0]).toBe(mockLoader);
});

test('sends initialized user proxies to Loader', () => {
  const { proxies } = props;
  expect(proxies[0]).toBe(mockProxy1);
  expect(proxies[1]).toBe(mockProxy2);
});

test('includes StateProxy', () => {
  const { proxies } = props;
  expect(proxies[2]).toBe(mockStateProxy);
});

test('includes PropsProxy', () => {
  const { proxies } = props;
  expect(proxies[3]).toBe(mockPropsProxy);
});

test('sends components input to loadComponents lib', () => {
  expect(mockLoadComponents.mock.calls[0][0]).toBe(mockComponentsInput);
});

test('sends fixtures input to loadFixtures lib', () => {
  expect(mockLoadFixtures.mock.calls[0][0]).toBe(mockFixturesInput);
});

test('sends components output to Component Playground props', () => {
  const { components } = props;
  expect(components).toBe(mockComponentsOutput);
});

test('sends fixtures output to Component Playground props', () => {
  const { fixtures } = props;
  expect(fixtures).toBe(mockFixturesOutput);
});
