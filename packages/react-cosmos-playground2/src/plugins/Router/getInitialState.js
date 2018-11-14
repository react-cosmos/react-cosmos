// @flow

import { getUrlParamsFromLocation } from './window';

import type { UrlParams } from './shared';

export function getInitialState(): UrlParams {
  return getUrlParamsFromLocation();
}
