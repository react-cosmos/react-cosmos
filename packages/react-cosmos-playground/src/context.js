// @flow

import { createContext } from 'react';
import { defaultState } from './components/ComponentPlayground';

import type { PlaygroundOpts } from 'react-cosmos-flow/playground';
import type { State } from './components/ComponentPlayground';

type UrlParams = {
  component?: string,
  fixture?: string,
  editor?: boolean,
  responsive?: boolean | 'forceHide'
};

export type UiContextParams = {
  options: { platform: 'unknown' } | PlaygroundOpts,
  urlParams: UrlParams,
  state: State,
  onFixtureEdit: (fixturePart: Object) => any,
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
  onFixtureEdit: () => {},
  router: {
    goTo: () => {},
    routeLink: () => {}
  },
  getCleanUrlParams: params => params
});
