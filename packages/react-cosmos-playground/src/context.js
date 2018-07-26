// @flow

import { createContext } from 'react';
import { defaultState } from './components/ComponentPlayground';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { State } from './components/ComponentPlayground';

export type UrlParams = {
  component?: string,
  fixture?: string,
  editor?: boolean,
  fullScreen?: boolean
};

export type UiContextParams = {
  options: { platform: 'unknown' } | PlaygroundOpts,
  urlParams: UrlParams,
  state: State,
  editFixture: (fixturePart: Object) => any,
  setPluginState: (state: Object) => void,
  router: {
    goTo: (e: SyntheticEvent<HTMLAnchorElement>) => any,
    routeLink: (location: string) => any
  },
  getCleanUrlParams: (urlParams: UrlParams) => UrlParams
};

// Match the shape of the populated UI context
export const UiContext = createContext({
  options: {
    platform: 'unknown'
  },
  urlParams: {},
  state: defaultState,
  editFixture: () => {},
  setPluginState: () => {},
  router: {
    goTo: () => {},
    routeLink: () => {}
  },
  getCleanUrlParams: params => params
});
