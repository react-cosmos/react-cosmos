const mockComponentClass = {};
const mockReactDOM = {
  render: jest.fn(() => {}),
};

let getComponentClass;
let getComponentProps;

const onChange = jest.fn();
const mockUriLocation = 'mypage.com?component=List&dataUrl=users.json';
const mockUriParams = {
  component: 'List',
  dataUrl: 'users.json',
};

let React;
let uri;
let Router;
let ReactDOM;
let routerInstance;

const nativeRefs = {};
const stubWindowApi = () => {
  nativeRefs.addEventListener = window.addEventListener;
  nativeRefs.removeEventListener = window.removeEventListener;
  nativeRefs.historyPushState = window.history.pushState;

  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
  window.history.pushState = jest.fn();
};
const restoreWindowApi = () => {
  window.addEventListener = nativeRefs.addEventListener;
  window.removeEventListener = nativeRefs.removeEventListener;
  window.history.pushState = nativeRefs.historyPushState;
};

const initRouter = () => {
  jest.resetModules();
  jest.resetAllMocks();

  getComponentClass = jest.fn(() => mockComponentClass);
  getComponentProps = jest.fn(() => ({
    foo: 'bar',
    lorem: 'ipsum',
  }));

  jest.mock('../uri', () => ({
    parseLocation: jest.fn(() => mockUriParams),
  }));

  jest.mock('react', () => ({
    createElement: jest.fn(),
  }));

  jest.mock('react-dom-polyfill', () => jest.fn(() => mockReactDOM));

  React = require('react');
  uri = require('../uri');
  Router = require('../router').default;
  ReactDOM = require('react-dom-polyfill')(React);

  routerInstance = new Router({
    defaultProps: {
      defaultProp: true,
    },
    container: '<fake DOM element>',
    getComponentClass,
    getComponentProps,
    onChange,
  });
};

const commonTests = () => {
  it('should call getComponentClass with route params', () => {
    const propsSent = getComponentClass.mock.calls[0][0];
    expect(propsSent.component).toBe(mockUriParams.component);
    expect(propsSent.dataUrl).toBe(mockUriParams.dataUrl);
  });

  it('should call getComponentProps with route params', () => {
    const propsSent = getComponentProps.mock.calls[0][0];
    expect(propsSent.component).toBe(mockUriParams.component);
    expect(propsSent.dataUrl).toBe(mockUriParams.dataUrl);
  });

  it('should call createElement with returned class', () => {
    expect(React.createElement.mock.calls[0][0]).toBe(mockComponentClass);
  });

  it('should call createElement with returned props', () => {
    const propsSent = React.createElement.mock.calls[0][1];
    expect(propsSent.foo).toBe('bar');
    expect(propsSent.lorem).toBe('ipsum');
  });

  it('should attach router reference to props', () => {
    expect(React.createElement.mock.calls[0][1].router).toBe(routerInstance);
  });

  it('should use container node received in options', () => {
    expect(ReactDOM.render.mock.calls[0][1]).toBe('<fake DOM element>');
  });

  it('should call onChange callback with params', () => {
    const params = onChange.mock.calls[0][0];
    expect(params.component).toBe(mockUriParams.component);
    expect(params.dataUrl).toBe(mockUriParams.dataUrl);
  });
};

const currentLocationTests = () => {
  it('should unserialize current location', () => {
    // window.location is mocked inside jest.config.json
    expect(uri.parseLocation.mock.calls[0][0]).toBe('http://foo.bar/');
  });
};

const pushLocationTests = () => {
  it('should push new entry to browser history', () => {
    expect(window.history.pushState.mock.calls[0][2]).toBe(mockUriLocation);
  });
};

beforeAll(() => {
  stubWindowApi();
});

afterAll(() => {
  restoreWindowApi();
});

describe('initial location', () => {
  beforeAll(() => {
    initRouter();
  });

  commonTests();
  currentLocationTests();

  it('should add popstate event listener', () => {
    expect(window.addEventListener.mock.calls[0]).toEqual(['popstate', routerInstance.onPopState]);
  });

  it('should remove popstate event listener on destroy', () => {
    routerInstance.stop();
    expect(window.removeEventListener.mock.calls[0]).toEqual(
      ['popstate', routerInstance.onPopState]);
  });
});

describe('.goTo method', () => {
  beforeAll(() => {
    initRouter();

    routerInstance.goTo(mockUriLocation);
  });

  commonTests();
  pushLocationTests();
});

describe('.routeLink method', () => {
  beforeAll(() => {
    initRouter();

    routerInstance.routeLink({
      preventDefault: () => {},
      currentTarget: {
        href: mockUriLocation,
      },
    });
  });

  commonTests();
  pushLocationTests();
});

describe('PopState event', () => {
  beforeAll(() => {
    initRouter();

    routerInstance.onPopState({
      state: {},
    });
  });

  commonTests();
  currentLocationTests();
});

describe('Empty PopState event', () => {
  beforeEach(() => {
    initRouter();

    routerInstance.onPopState({
      state: null,
    });
  });

  commonTests();
  currentLocationTests();
});
