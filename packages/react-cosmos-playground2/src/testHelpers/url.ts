/* eslint-env browser */

import * as qs from 'query-string';

export function getUrlParams() {
  return qs.parse(location.search);
}

export function pushUrlParams(params: object) {
  const query = qs.stringify(params);
  history.pushState({}, '', `?${query}`);
}

export function popUrlParams(params: object) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrl() {
  pushUrlParams({});
}
