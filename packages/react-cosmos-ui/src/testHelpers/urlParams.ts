import { buildQueryString, parseQueryString } from 'react-cosmos-core';
import { createRelativeUrlWithQuery } from '../shared/url.js';

type Params = Record<string, unknown>;

export function getUrlParams() {
  return parseQueryString(location.search);
}

export function pushUrlParams(params: Params) {
  const query = buildQueryString(params);
  history.pushState({}, '', createRelativeUrlWithQuery(query));
}

export function popUrlParams(params: Params) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrlParams() {
  pushUrlParams({});
}
