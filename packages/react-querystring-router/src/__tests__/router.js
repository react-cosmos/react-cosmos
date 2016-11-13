const ComponentClass = {};
const componentInstance = {};
const ReactDOMMock = {
  render: jest.fn(() => componentInstance),
};
const getComponentClass = jest.fn(() => ComponentClass);
const onChange = jest.fn();
const uriLocation = 'mypage.com?component=List&dataUrl=users.json';
const uriParams = {
  component: 'List',
  dataUrl: 'users.json',
};

let routerInstance;

jest.mock('../uri', () => ({
  parseLocation: jest.fn(() => uriParams),
}));

jest.mock('react', () => ({
  createElement: jest.fn(),
}));

jest.mock('react-dom-polyfill', () => jest.fn(() => ReactDOMMock));

const React = require('react');
const uri = require('../uri');
const Router = require('../router');
const ReactDOM = require('react-dom-polyfill')(React);

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
  routerInstance = new Router({
    defaultProps: {
      defaultProp: true,
    },
    container: '<fake DOM element>',
    getComponentClass,
    onChange,
  });
};

const commonTests = () => {
  it('should call getComponentClass with route params', () => {
    const propsSent = getComponentClass.mock.calls[0][0];
    expect(propsSent.component).toBe(uriParams.component);
    expect(propsSent.dataUrl).toBe(uriParams.dataUrl);
  });

  it('should call getComponentClass with default props', () => {
    const propsSent = getComponentClass.mock.calls[0][0];
    expect(propsSent.defaultProp).toBe(true);
  });

  it('should call createElement with returned class', () => {
    expect(React.createElement.mock.calls[0][0]).toBe(ComponentClass);
  });

  it('should render using URL params as props', () => {
    const propsSent = React.createElement.mock.calls[0][1];
    expect(propsSent.dataUrl).toBe(uriParams.dataUrl);
  });

  it('should attach router reference to props', () => {
    expect(React.createElement.mock.calls[0][1].router).toBe(routerInstance);
  });

  it('should extend default props', () => {
    const props = React.createElement.mock.calls[0][1];
    expect(props.dataUrl).toBe(uriParams.dataUrl);
    expect(props.defaultProp).toBe(true);
  });

  it('should use container node received in options', () => {
    expect(ReactDOM.render.mock.calls[0][1]).toBe('<fake DOM element>');
  });

  it('should expose reference to root component', () => {
    expect(routerInstance.rootComponent).toBe(componentInstance);
  });

  it('should call onChange callback with params', () => {
    const params = onChange.mock.calls[0][0];
    expect(params.component).toBe(uriParams.component);
    expect(params.dataUrl).toBe(uriParams.dataUrl);
  });

  it('should call onChange callback with default props', () => {
    const params = onChange.mock.calls[0][0];
    expect(params.defaultProp).toBe(true);
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
    expect(window.history.pushState.mock.calls[0][2]).toBe(uriLocation);
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
    jest.clearAllMocks();

    routerInstance.goTo(uriLocation);
  });

  commonTests();
  pushLocationTests();
});

describe('.routeLink method', () => {
  beforeAll(() => {
    initRouter();
    jest.clearAllMocks();

    routerInstance.routeLink({
      preventDefault: () => {},
      currentTarget: {
        href: uriLocation,
      },
    });
  });

  commonTests();
  pushLocationTests();
});

describe('PopState event', () => {
  beforeAll(() => {
    initRouter();
    jest.clearAllMocks();

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
    jest.clearAllMocks();

    routerInstance.onPopState({
      state: null,
    });
  });

  commonTests();
  currentLocationTests();
});
