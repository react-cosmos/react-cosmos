/* eslint-env browser */
// @flow

import qs from 'query-string';

import type { UrlParams } from '../index.js.flow';

export function getUrlParams() {
  return qs.parse(location.search);
}

export function pushUrlParams(urlParams: UrlParams) {
  const query = qs.stringify(urlParams);

  // Refresh page completely when pushState isn't supported
  if (!history.pushState) {
    return (location.search = query);
  }

  // Update URL without refreshing page
  history.pushState({}, '', `?${query}`);
}

export function onUrlChange(userHandler: UrlParams => mixed) {
  const handler = () => {
    userHandler(getUrlParams());
  };

  window.addEventListener('popstate', handler);

  return () => {
    window.removeEventListener('popstate', handler);
  };
}
