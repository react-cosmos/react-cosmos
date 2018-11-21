/* eslint-env browser */
// @flow

import qs from 'query-string';

import type { UrlParams } from './shared';

export function getUrlParamsFromLocation() {
  return qs.parse(location.search);
}

// IDEA: Store fixtureState in history object and apply it on `popstate` event
export function pushUrlParamsToHistory(urlParams: UrlParams) {
  const query = qs.stringify(urlParams);

  // Refresh page completely when pushState isn't supported
  if (!history.pushState) {
    return (location.search = query);
  }

  // NOTE: "./" is used to return to the home URL. Passing an empty string
  // doesn't do anything. And passing "/" doesn't work if Cosmos is not hosted
  // at root (sub)domain level.
  const nextUrl = query.length > 0 ? `?${query}` : './';

  // Update URL without refreshing page
  history.pushState({}, '', nextUrl);
}

export function subscribeToLocationChanges(userHandler: UrlParams => mixed) {
  const handler = () => {
    userHandler(getUrlParamsFromLocation());
  };

  window.addEventListener('popstate', handler);

  return () => {
    window.removeEventListener('popstate', handler);
  };
}
