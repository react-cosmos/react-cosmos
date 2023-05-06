import { FixtureId } from '../userModules/fixtureTypes.js';
import { buildQueryString, parseQueryString } from './queryString.js';

export type RendererSearchParams = {
  fixtureId?: FixtureId;
  locked?: boolean;
};

type StringSearchParams = {
  fixtureId?: string;
  locked?: string;
};

export function buildRendererQueryString(params: RendererSearchParams) {
  return buildQueryString(encodeRendererSearchParams(params));
}

export function parseRendererQueryString(query: string) {
  return decodeRendererSearchParams(
    parseQueryString<StringSearchParams>(query)
  );
}

export function encodeRendererSearchParams(params: RendererSearchParams) {
  const stringParams: StringSearchParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  if (params.locked) {
    stringParams.locked = String(params.locked);
  }

  return stringParams;
}

function decodeRendererSearchParams(stringParams: StringSearchParams) {
  const params: RendererSearchParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  if (stringParams.locked) {
    params.locked = stringParams.locked === 'true';
  }

  return params;
}
