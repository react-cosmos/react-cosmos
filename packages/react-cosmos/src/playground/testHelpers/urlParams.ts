import { parseUrlQuery, stringifyUrlQuery } from 'react-cosmos-core/playground';

type Params = Record<string, unknown>;

export function getUrlParams() {
  return parseUrlQuery(location.search);
}

export function pushUrlParams(params: Params) {
  const query = stringifyUrlQuery(params);
  history.pushState({}, '', `?${query}`);
}

export function popUrlParams(params: Params) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrlParams() {
  pushUrlParams({});
}
