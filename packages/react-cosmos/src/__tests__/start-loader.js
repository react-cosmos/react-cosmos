const fakeComponentElement = {};
const fakeComponentInstance = {};
const FakeReact = {
  createElement: jest.fn(() => fakeComponentElement),
};
const FakeReactDOM = {
  render: jest.fn(() => fakeComponentInstance),
};
const FakeLoader = () => {};
const FakePropsProxy = () => {};
const FakeStateProxy = () => {};
const fakeProxies = [{}, {}];
const fakeComponentsInput = {};
const fakeFixturesInput = {};
const fakeComponentsOutput = {};
const fakeFixturesOutput = {};
const fakeLoadComponents = jest.fn(() => fakeComponentsOutput);
const fakeLoadFixtures = jest.fn(() => fakeFixturesOutput);

jest.mock('react', () => FakeReact);
jest.mock('react-dom-polyfill', () => jest.fn(() => FakeReactDOM));
jest.mock('../components/Loader', () => FakeLoader);
jest.mock('../components/proxies/StateProxy', () => () => FakeStateProxy);
jest.mock('../components/proxies/PropsProxy', () => FakePropsProxy);
jest.mock('../load-modules', () => ({
  loadComponents: fakeLoadComponents,
  loadFixtures: fakeLoadFixtures,
}));

const startLoader = require('../start-loader');

let props;

const init = (options) => {
  jest.clearAllMocks();
  startLoader(options);
  props = FakeReact.createElement.mock.calls[0][1];
};

const commonTests = () => {
  it('creates Loader element', () => {
    expect(FakeReact.createElement.mock.calls[0][0]).toBe(FakeLoader);
  });

  it('sends user proxies to Loader', () => {
    const { proxies } = props;
    expect(proxies[0]).toBe(fakeProxies[0]);
    expect(proxies[1]).toBe(fakeProxies[1]);
  });

  it('includes StateProxy', () => {
    const { proxies } = props;
    expect(proxies[2]).toBe(FakeStateProxy);
  });

  it('includes PropsProxy', () => {
    const { proxies } = props;
    expect(proxies[3]).toBe(FakePropsProxy);
  });

  it('sends components input to loadComponents lib', () => {
    expect(fakeLoadComponents.mock.calls[0][0]).toBe(fakeComponentsInput);
  });

  it('sends fixtures input to loadFixtures lib', () => {
    expect(fakeLoadFixtures.mock.calls[0][0]).toBe(fakeFixturesInput);
  });

  it('sends components output to Component Playground props', () => {
    const { components } = props;
    expect(components).toBe(fakeComponentsOutput);
  });

  it('sends fixtures output to Component Playground props', () => {
    const { fixtures } = props;
    expect(fixtures).toBe(fakeFixturesOutput);
  });

  it('renders React element', () => {
    expect(FakeReactDOM.render.mock.calls[0][0]).toBe(fakeComponentElement);
  });
};

describe('without container query selector', () => {
  beforeAll(() => {
    init({
      proxies: fakeProxies,
      components: fakeComponentsInput,
      fixtures: fakeFixturesInput,
    });
  });

  commonTests();

  it('uses element inside document body for render container', () => {
    const container = FakeReactDOM.render.mock.calls[0][1];
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
      proxies: fakeProxies,
      components: fakeComponentsInput,
      fixtures: fakeFixturesInput,
      containerQuerySelector: '#app',
    });
  });

  afterAll(() => {
    document.body.removeChild(rootEl);
  });

  commonTests();

  it('uses queried element for render container', () => {
    const container = FakeReactDOM.render.mock.calls[0][1];
    // For some reason expect(container).toBe(rootEl) fills up the memory until
    // it reaches a V8 limit and crashes due to allocation fail. Probably when
    // pretty-format is used to display the pretty diff
    expect(container === rootEl).toBe(true);
  });
});
