// @flow
/* eslint-env browser */

import qs from 'query-string';

import type { UrlParams } from '../index.js.flow';

export function getUrlParams() {
  return qs.parse(location.search);
}

export function pushUrlParams(params: UrlParams) {
  const query = qs.stringify(params);
  history.pushState({}, '', `?${query}`);
}

export function popUrlParams(params: UrlParams) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrl() {
  pushUrlParams({});
}
