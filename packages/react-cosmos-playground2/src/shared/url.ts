import qs from 'query-string';
import { FixtureId } from 'react-cosmos-shared2/renderer';

export type UrlParams = {
  fixtureId?: FixtureId;
  fullScreen?: boolean;
};

type EncodedUrlParams = {
  fixtureId?: string;
  fullScreen?: 'true';
};

export function getUrlParams(): UrlParams {
  return decodeUrlParams(qs.parse(location.search));
}

// IDEA: Store fixtureState in history object and apply it on `popstate` event
export function pushUrlParams(urlParams: UrlParams) {
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
    userHandler(getUrlParams());
  };
  window.addEventListener('popstate', handler);
  return () => {
    window.removeEventListener('popstate', handler);
  };
}

export function createUrl(urlParams: UrlParams) {
  return createUrlWithQuery(qs.stringify(encodeUrlParams(urlParams)));
}

function createUrlWithQuery(query: string) {
  // NOTE: "./" is used to return to the home URL. Passing an empty string
  // doesn't do anything. And passing "/" doesn't work if Cosmos is not hosted
  // at root (sub)domain level.
  return query.length > 0 ? `?${query}` : './';
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
