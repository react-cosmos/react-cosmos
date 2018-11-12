/* eslint-env browser */
// @flow

import qs from 'query-string';

import type { RouterState } from './shared';

export function getUrlParamsFromLocation() {
  return qs.parse(location.search);
}

// IDEA: Store fixtureState in history object and apply it on `popstate` event
export function pushUrlParamsToHistory(urlParams: RouterState) {
  const query = qs.stringify(urlParams);

  // Refresh page completely when pushState isn't supported
  if (!history.pushState) {
    return (location.search = query);
  }

  // Update URL without refreshing page
  history.pushState({}, '', `?${query}`);
}

export function subscribeToLocationChanges(userHandler: RouterState => mixed) {
  const handler = () => {
    userHandler(getUrlParamsFromLocation());
  };

  window.addEventListener('popstate', handler);

  return () => {
    window.removeEventListener('popstate', handler);
  };
}
