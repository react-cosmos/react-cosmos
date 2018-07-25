// @flow

import { createContext } from 'react';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { State } from './components/ComponentPlayground';

type UrlParams = {
  component?: string,
  fixture?: string,
  editor?: boolean,
  responsive?: boolean | 'forceHide'
};

export type UiContextParams = {
  options: PlaygroundOpts,
  urlParams: UrlParams,
  state: State,
  onFixtureEdit: (fixturePart: Object) => any,
  router: {
    goTo: (e: SyntheticEvent<HTMLAnchorElement>) => any,
    routeLink: (location: string) => any
  },
  getCleanUrlParams: (urlParams: UrlParams) => UrlParams
};

// TODO: Figure out how to handle default context state
export const UiContext = createContext({
  options: {
    projectKey: 'default',
    platform: 'web',
    loaderUri: '/_loader.html',
    responsiveDevices: [],
    deps: {},
    webpackConfigType: 'default'
  },
  urlParams: {},
  state: {
    loaderStatus: 'PENDING',
    isDragging: false,
    leftNavSize: 250,
    fixtureEditorPaneSize: 250,
    orientation: 'landscape',
    fixtureBody: {},
    fixtures: {}
  },
  onFixtureEdit: () => {},
  router: {
    goTo: () => {},
    routeLink: () => {}
  },
  getCleanUrlParams: params => params
});
