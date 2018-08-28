// @flow

import ComponentPlayground from '../components/ComponentPlayground';
import { Router } from 'react-querystring-router';
import mountPlayground from '..';

// Vars populated in beforeEach blocks
let routerInstance;

jest.mock('react-querystring-router', () => ({
  Router: jest.fn()
}));

const playgroundOpts = {
  platform: 'web',
  projectKey: '/fake-project-key/',
  loaderUri: '/fake-loader-uri/',
  webpackConfigType: 'custom',
  deps: {},
  plugin: {}
};

describe('Playground mount', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    routerInstance = mountPlayground(playgroundOpts);
  });

  it('creates Router instance', () => {
    expect(Router).toHaveBeenCalled();
  });

  describe('router options', () => {
    let routerArgs;

    beforeEach(() => {
      [routerArgs] = Router.mock.calls;
    });

    it('uses Playground as router component class', () => {
      const [{ getComponentClass }] = routerArgs;
      expect(getComponentClass()).toBe(ComponentPlayground);
    });

    it('sends options to Playground', () => {
      const [{ getComponentProps }] = routerArgs;
      const { options } = getComponentProps();
      expect(options).toEqual(playgroundOpts);
    });

    it('returns router instance', () => {
      expect(routerInstance).toBeInstanceOf(Router);
    });

    it('uses element inside document body for router container', () => {
      const [{ container }] = routerArgs;
      expect(container.parentNode).toBe(document.body);
    });

    it('sets document title to "React Cosmos" on home route', () => {
      const [{ onChange }] = routerArgs;
      onChange({});
      expect(document.title).toBe('React Cosmos');
    });

    it('sets component and fixture in documet title', () => {
      const [{ onChange }] = routerArgs;
      onChange({
        component: 'Foo',
        fixture: 'bar'
      });
      expect(document.title).toBe('Foo:bar – React Cosmos');
    });
  });
});
