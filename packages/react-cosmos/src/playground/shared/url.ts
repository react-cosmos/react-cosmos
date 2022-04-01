import {
  parsePlaygroundUrlQuery,
  PlaygroundUrlParams,
  stringifyPlaygroundUrlQuery,
} from '../../core/playgroundUrl';

export function getUrlParams(): PlaygroundUrlParams {
  return parsePlaygroundUrlQuery(location.search);
}

export function pushUrlParams(urlParams: PlaygroundUrlParams) {
  const query = stringifyPlaygroundUrlQuery(urlParams);

  // Refresh page completely when pushState isn't supported
  if (!history.pushState) {
    location.search = query;
    return;
  }

  // Update URL without refreshing page
  history.pushState({}, '', createRelativeUrlWithQuery(query));
}

export function subscribeToLocationChanges(
  userHandler: (urlParams: PlaygroundUrlParams) => unknown
) {
  const handler = () => {
    userHandler(getUrlParams());
  };
  window.addEventListener('popstate', handler);
  return () => {
    window.removeEventListener('popstate', handler);
  };
}

export function createRelativePlaygroundUrl(urlParams: PlaygroundUrlParams) {
  const query = stringifyPlaygroundUrlQuery(urlParams);
  return createRelativeUrlWithQuery(query);
}

function createRelativeUrlWithQuery(query: string) {
  // NOTE: "./" is used to return to the home URL. Passing an empty string
  // doesn't do anything. And passing "/" doesn't work if Cosmos is not hosted
  // at root (sub)domain level.
  return query.length > 0 ? `?${query}` : './';
}
