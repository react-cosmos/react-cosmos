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
jest.mock('react-cosmos-utils/lib/linked-list', () => jest.fn(() => fakeLinkedList));

const PropsProxy = require('../components/proxies/PropsProxy').default;
const createLinkedList = require('react-cosmos-utils/lib/linked-list');
const startReactCosmos = require('../index');

let routerInstance;

const initRouter = (options) => {
  jest.clearAllMocks();
  routerInstance = startReactCosmos(options);
};

const commonTests = () => {
  it('uses Componet Playground as router component class', () => {
    const { getComponentClass } = FakeRouter.mock.calls[0][0];
    expect(getComponentClass()).toBe(FakeComponentPlayground);
  });

  it('create proxy list with user proxies', () => {
    expect(createLinkedList.mock.calls[0][0][0]).toBe(fakeProxies[0]);
    expect(createLinkedList.mock.calls[0][0][1]).toBe(fakeProxies[1]);
  });

  it('end proxy list with internal proxies', () => {
    expect(createLinkedList.mock.calls[0][0][3]).toBe(PropsProxy);
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
};

describe('without container query selector', () => {
  beforeAll(() => {
    initRouter({
      proxies: fakeProxies,
      components: fakeComponentsInput,
      fixtures: fakeFixturesInput,
    });
  });

  commonTests();

  it('uses element inside document body for router container', () => {
    const { container } = FakeRouter.mock.calls[0][0];
    expect(container.parentNode).toBe(document.body);
  });
});

describe('with container query selector and class name', () => {
  let rootEl;

  beforeAll(() => {
    rootEl = window.document.createElement('div', { id: 'root' });
    rootEl.id = 'app';
    document.body.appendChild(rootEl);

    initRouter({
      proxies: fakeProxies,
      components: fakeComponentsInput,
      fixtures: fakeFixturesInput,
      containerQuerySelector: '#app',
      containerClassName: 'foobar',
    });
  });

  afterAll(() => {
    document.body.removeChild(rootEl);
  });

  commonTests();

  it('uses queried element for router container', () => {
    const { container } = FakeRouter.mock.calls[0][0];
    // For some reason expect(container).toBe(rootEl) fills up the memory until
    // it reaches a V8 limit and crashes due to allocation fail. Probably when
    // pretty-format is used to display the pretty diff
    expect(container === rootEl).toBe(true);
  });

  it('sends containerClassName to Component Playground props', () => {
    const { containerClassName } = FakeRouter.mock.calls[0][0].defaultProps;
    expect(containerClassName).toBe('foobar');
  });
});
