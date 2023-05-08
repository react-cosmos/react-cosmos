import { FixtureId } from '../userModules/fixtureTypes.js';
import { buildQueryString, parseQueryString } from './queryString.js';

export type RendererSearchParams = {
  fixtureId?: FixtureId;
  locked?: boolean;
  key?: number;
};

export type StringRendererSearchParams = {
  fixtureId?: string;
  locked?: string;
  key?: string;
};

export function buildRendererQueryString(params: RendererSearchParams) {
  return buildQueryString(encodeRendererSearchParams(params));
}

export function parseRendererQueryString(query: string) {
  return decodeRendererSearchParams(
    parseQueryString<StringRendererSearchParams>(query)
  );
}

export function encodeRendererSearchParams(params: RendererSearchParams) {
  const stringParams: StringRendererSearchParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  if (params.locked) {
    stringParams.locked = 'true';
  }

  if (params.key) {
    stringParams.key = params.key.toString();
  }

  return stringParams;
}

export function decodeRendererSearchParams(
  stringParams: StringRendererSearchParams
) {
  const params: RendererSearchParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  if (stringParams.locked) {
    params.locked = stringParams.locked === 'true';
  }

  if (stringParams.key) {
    params.key = parseInt(stringParams.key, 10);
  }

  return params;
}
