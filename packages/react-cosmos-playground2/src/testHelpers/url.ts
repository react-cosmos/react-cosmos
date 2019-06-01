import qs from 'query-string';

type Params = Record<string, unknown>;

export function getUrlParams() {
  return qs.parse(location.search);
}

export function pushUrlParams(params: Params) {
  const query = qs.stringify(params);
  history.pushState({}, '', `?${query}`);
}

export function popUrlParams(params: Params) {
  pushUrlParams(params);
  // Simulate `popstate` event, like using back/fwd browser buttons
  window.dispatchEvent(new Event('popstate'));
}

export function resetUrl() {
  pushUrlParams({});
}
