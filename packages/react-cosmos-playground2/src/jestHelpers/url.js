// @flow
/* eslint-env browser */

import qs from 'query-string';

export function getUrlParams() {
  return qs.parse(location.search);
}

export function pushUrlParams(params: Object) {
  const query = qs.stringify(params);
  history.pushState({}, '', `?${query}`);
}

export function popUrlParams(params: Object) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrl() {
  pushUrlParams({});
}
