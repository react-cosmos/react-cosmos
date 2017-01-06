const mockComponentElement = {};
const mockComponentInstance = {};
const mockLoader = () => {};
const mockPropsProxy = () => {};
const mockStateProxy = () => {};
const mockProxies = [{}, {}];
const mockComponentsInput = {};
const mockFixturesInput = {};
const mockComponentsOutput = {};
const mockFixturesOutput = {};
let mockReact;
let mockReactDOM;
let mockLoadComponents;
let mockLoadFixtures;
let startLoader;
let props;

const init = (options) => {
  jest.resetModules();
  jest.resetAllMocks();

  mockReact = {
    createElement: jest.fn(() => mockComponentElement),
  };
  mockReactDOM = {
    render: jest.fn(() => mockComponentInstance),
  };
  mockLoadComponents = jest.fn(() => mockComponentsOutput);
  mockLoadFixtures = jest.fn(() => mockFixturesOutput);

  jest.mock('react', () => mockReact);
  jest.mock('react-dom-polyfill', () => jest.fn(() => mockReactDOM));
  jest.mock('../components/Loader', () => mockLoader);
  jest.mock('../components/proxies/StateProxy', () => () => mockStateProxy);
  jest.mock('../components/proxies/PropsProxy', () => mockPropsProxy);
  jest.mock('../load-modules', () => ({
    loadComponents: mockLoadComponents,
    loadFixtures: mockLoadFixtures,
  }));

  startLoader = require('../start-loader');

  startLoader(options);

  props = mockReact.createElement.mock.calls[0][1];
};

const commonTests = () => {
  it('creates Loader element', () => {
    expect(mockReact.createElement.mock.calls[0][0]).toBe(mockLoader);
  });

  it('sends user proxies to Loader', () => {
    const { proxies } = props;
    expect(proxies[0]).toBe(mockProxies[0]);
    expect(proxies[1]).toBe(mockProxies[1]);
  });

  it('includes StateProxy', () => {
    const { proxies } = props;
    expect(proxies[2]).toBe(mockStateProxy);
  });

  it('includes PropsProxy', () => {
    const { proxies } = props;
    expect(proxies[3]).toBe(mockPropsProxy);
  });

  it('sends components input to loadComponents lib', () => {
    expect(mockLoadComponents.mock.calls[0][0]).toBe(mockComponentsInput);
  });

  it('sends fixtures input to loadFixtures lib', () => {
    expect(mockLoadFixtures.mock.calls[0][0]).toBe(mockFixturesInput);
  });

  it('sends components output to Component Playground props', () => {
    const { components } = props;
    expect(components).toBe(mockComponentsOutput);
  });

  it('sends fixtures output to Component Playground props', () => {
    const { fixtures } = props;
    expect(fixtures).toBe(mockFixturesOutput);
  });

  it('renders React element', () => {
    expect(mockReactDOM.render.mock.calls[0][0]).toBe(mockComponentElement);
  });
};

describe('without container query selector', () => {
  beforeAll(() => {
    init({
      proxies: mockProxies,
      components: mockComponentsInput,
      fixtures: mockFixturesInput,
    });
  });

  commonTests();

  it('uses element inside document body for render container', () => {
    const container = mockReactDOM.render.mock.calls[0][1];
    expect(container.parentNode).toBe(document.body);
  });
});

describe('with container query selector and class name', () => {
  let rootEl;

  beforeAll(() => {
    rootEl = window.document.createElement('div', { id: 'root' });
    rootEl.id = 'app';
    document.body.appendChild(rootEl);

    init({
      proxies: mockProxies,
      components: mockComponentsInput,
      fixtures: mockFixturesInput,
      containerQuerySelector: '#app',
    });
  });

  afterAll(() => {
    document.body.removeChild(rootEl);
  });

  commonTests();

  it('uses queried element for render container', () => {
    const container = mockReactDOM.render.mock.calls[0][1];
    // For some reason expect(container).toBe(rootEl) fills up the memory until
    // it reaches a V8 limit and crashes due to allocation fail. Probably when
    // pretty-format is used to display the pretty diff
    expect(container === rootEl).toBe(true);
  });
});
