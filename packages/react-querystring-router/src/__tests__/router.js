const mockComponentClass = {};
const mockReactDOM = {
  render: jest.fn(() => {})
};

let getComponentClass;
let getComponentProps;

const onChange = jest.fn();
// \window.location is mocked inside jest.config.json
const mockUriLocationInitial = 'http://foo.bar/';
const mockUriLocation = `${mockUriLocationInitial}?component=List&dataUrl=users.json`;
const mockUriParams = {
  component: 'List',
  dataUrl: 'users.json'
};

let React;
let parseLocation;
let Router;
let ReactDOM;
let routerInstance;

const initRouter = () => {
  jest.resetModules();
  jest.resetAllMocks();

  getComponentClass = jest.fn(() => mockComponentClass);
  getComponentProps = jest.fn(() => ({
    foo: 'bar',
    lorem: 'ipsum'
  }));

  jest.mock('../uri', () => ({
    parseLocation: jest.fn(() => mockUriParams)
  }));

  jest.mock('react', () => ({
    createElement: jest.fn()
  }));

  jest.mock('react-dom', () => mockReactDOM);

  React = require('react');
  ReactDOM = require('react-dom');
  parseLocation = require('../uri').parseLocation;
  Router = require('../router').Router;

  routerInstance = new Router({
    defaultProps: {
      defaultProp: true
    },
    container: '<fake DOM element>',
    getComponentClass,
    getComponentProps,
    onChange
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

describe('initial location', () => {
  beforeAll(() => {
    initRouter();
  });

  commonTests();

  it('should unserialize current location', () => {
    expect(parseLocation.mock.calls[0][0]).toBe(mockUriLocationInitial);
  });
});

describe('.goTo method', () => {
  beforeAll(() => {
    initRouter();

    routerInstance.goTo(mockUriLocation);
  });

  afterAll(() => {
    window.history.pushState({}, '', mockUriLocationInitial);
  });

  commonTests();

  it('should push new entry to browser history', () => {
    expect(window.location.href).toBe(mockUriLocation);
  });
});

describe('.routeLink method', () => {
  beforeAll(() => {
    initRouter();

    routerInstance.routeLink({
      preventDefault: () => {},
      currentTarget: {
        href: mockUriLocation
      }
    });
  });

  afterAll(() => {
    window.history.pushState({}, '', mockUriLocationInitial);
  });

  commonTests();

  it('should push new entry to browser history', () => {
    expect(window.location.href).toBe(mockUriLocation);
  });
});

describe('PopState event', () => {
  beforeAll(() => {
    initRouter();

    window.history.pushState({}, '', mockUriLocation);
    window.dispatchEvent(new Event('popstate'));
  });

  commonTests();

  it('should unserialize current location', () => {
    expect(parseLocation.mock.calls[1][0]).toBe(mockUriLocation);
  });

  it('should remove popstate event listener on destroy', () => {
    routerInstance.stop();
    window.dispatchEvent(new Event('popstate'));

    expect(parseLocation.mock.calls.length).toEqual(2);
  });
});
