import { FixtureId } from '../userModules/fixtureTypes.js';
import { buildQueryString, parseQueryString } from './queryString.js';

export type PlaygroundSearchParams = {
  fixtureId?: FixtureId;
};

type StringSearchParams = {
  fixtureId?: string;
};

export function buildPlaygroundQueryString(params: PlaygroundSearchParams) {
  return buildQueryString(encodePlaygroundSearchParams(params));
}

export function parsePlaygroundQueryString(query: string) {
  return decodePlaygroundSearchParams(
    parseQueryString<StringSearchParams>(query)
  );
}

function encodePlaygroundSearchParams(params: PlaygroundSearchParams) {
  const stringParams: StringSearchParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  return stringParams;
}

function decodePlaygroundSearchParams(stringParams: StringSearchParams) {
  const params: PlaygroundSearchParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  return params;
}
