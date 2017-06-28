import ReactComponentPlayground from '../components/ComponentPlayground';
import { Router } from 'react-querystring-router';

// index.js is not an ES6 module
const mountPlayground = require('../');

// Vars populated in beforeEach blocks
let routerInstance;

jest.mock('react-querystring-router', () => ({
  Router: jest.fn(),
}));

describe('Playground mount', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    routerInstance = mountPlayground({
      loaderUri: '/fake-loader-uri/',
    });
  });

  it('creates Router instance', () => {
    expect(Router).toHaveBeenCalled();
  });

  describe('router options', () => {
    let routerArgs;

    beforeEach(() => {
      routerArgs = Router.mock.calls[0];
    });

    it('uses Playground as router component class', () => {
      const { getComponentClass } = routerArgs[0];
      expect(getComponentClass()).toBe(ReactComponentPlayground);
    });

    it('puts loaderUri option in Playground props', () => {
      const { getComponentProps } = routerArgs[0];
      const { loaderUri } = getComponentProps();
      expect(loaderUri).toBe('/fake-loader-uri/');
    });

    it('returns router instance', () => {
      expect(routerInstance).toBeInstanceOf(Router);
    });

    it('uses element inside document body for router container', () => {
      const { container } = routerArgs[0];
      expect(container.parentNode).toBe(document.body);
    });

    it('sets document title to "React Cosmos" on home route', () => {
      const { onChange } = routerArgs[0];
      onChange({});
      expect(document.title).toBe('React Cosmos');
    });

    it('sets component and fixture in documet title', () => {
      const { onChange } = routerArgs[0];
      onChange({
        component: 'Foo',
        fixture: 'bar',
      });
      expect(document.title).toBe('Foo:bar – React Cosmos');
    });
  });
});
