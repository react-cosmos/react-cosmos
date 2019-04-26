import qs from 'query-string';
import { UrlParams } from './public';

type EncodedUrlParams = {
  fixtureId?: string;
  fullScreen?: 'true';
};

export function getUrlParamsFromLocation(): UrlParams {
  return decodeUrlParams(qs.parse(location.search));
}

export function createUrl(urlParams: UrlParams) {
  return createUrlWithQuery(qs.stringify(encodeUrlParams(urlParams)));
}

// IDEA: Store fixtureState in history object and apply it on `popstate` event
export function pushUrlParamsToHistory(urlParams: UrlParams) {
  const query = qs.stringify(encodeUrlParams(urlParams));

  // Refresh page completely when pushState isn't supported
  if (!history.pushState) {
    location.search = query;
    return;
  }

  // Update URL without refreshing page
  history.pushState({}, '', createUrlWithQuery(query));
}

export function subscribeToLocationChanges(
  userHandler: (urlParams: UrlParams) => unknown
) {
  const handler = () => {
    userHandler(getUrlParamsFromLocation());
  };

  window.addEventListener('popstate', handler);

  return () => {
    window.removeEventListener('popstate', handler);
  };
}

function encodeUrlParams(decoded: UrlParams) {
  const encoded: EncodedUrlParams = {};

  if (decoded.fixtureId) {
    encoded.fixtureId = JSON.stringify(decoded.fixtureId);
  }
  if (decoded.fullScreen) {
    encoded.fullScreen = 'true';
  }

  return encoded;
}

function decodeUrlParams(encoded: EncodedUrlParams): UrlParams {
  const decoded: UrlParams = {};

  if (encoded.fixtureId) {
    decoded.fixtureId = JSON.parse(encoded.fixtureId);
  }
  if (encoded.fullScreen) {
    decoded.fullScreen = true;
  }

  return decoded;
}

function createUrlWithQuery(query: string) {
  // NOTE: "./" is used to return to the home URL. Passing an empty string
  // doesn't do anything. And passing "/" doesn't work if Cosmos is not hosted
  // at root (sub)domain level.
  return query.length > 0 ? `?${query}` : './';
}
