// @flow

import { getUrlParamsFromLocation } from './window';

import type { RouterState } from './shared';

export function getInitialState(): RouterState {
  return getUrlParamsFromLocation();
}
