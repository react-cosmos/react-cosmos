const mockComponentElement = {};
const mockComponentInstance = {};
const mockProxy1 = {};
const mockProxy2 = {};
const mockProxies = [() => mockProxy1, () => mockProxy2];
const mockComponentsInput = {};
const mockFixturesInput = {};
let mockCreateLoaderElement;
let mockReactDOM;
let startLoader;

const init = options => {
  jest.resetModules();
  jest.resetAllMocks();

  mockCreateLoaderElement = jest.fn(() => mockComponentElement);
  mockReactDOM = {
    render: jest.fn(() => mockComponentInstance),
  };
  jest.mock('../create-loader-element', () => mockCreateLoaderElement);
  jest.mock('react-dom-polyfill', () => jest.fn(() => mockReactDOM));

  startLoader = require('../start-loader.js').default;

  startLoader(options);
};

const commonTests = () => {
  it('passes proxies to loader element', () => {
    expect(mockCreateLoaderElement.mock.calls[0][0].proxies).toBe(mockProxies);
  });

  it('passes components to loader element', () => {
    expect(mockCreateLoaderElement.mock.calls[0][0].components).toBe(mockComponentsInput);
  });

  it('passes fixtures to loader element', () => {
    expect(mockCreateLoaderElement.mock.calls[0][0].fixtures).toBe(mockFixturesInput);
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
