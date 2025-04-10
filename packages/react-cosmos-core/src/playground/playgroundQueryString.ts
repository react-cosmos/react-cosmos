import { buildQueryString, parseQueryString } from '../utils/queryString.js';
import { PlaygroundParams } from './playgroundParams.js';

type SearchParams = {
  fixture?: string;
};

export function buildPlaygroundQueryString(params: PlaygroundParams) {
  return buildQueryString(encodePlaygroundSearchParams(params));
}

export function parsePlaygroundQueryString(query: string) {
  return decodePlaygroundSearchParams(parseQueryString<SearchParams>(query));
}

function encodePlaygroundSearchParams(params: PlaygroundParams) {
  const stringParams: SearchParams = {};

  if (params.fixture) {
    stringParams.fixture = JSON.stringify(params.fixture);
  }

  return stringParams;
}

function decodePlaygroundSearchParams(stringParams: SearchParams) {
  const params: PlaygroundParams = {};

  if (stringParams.fixture) {
    params.fixture = JSON.parse(stringParams.fixture);
  }

  return params;
}
