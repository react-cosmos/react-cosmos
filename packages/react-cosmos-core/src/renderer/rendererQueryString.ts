import { FixtureId } from '../userModules/fixtureTypes.js';
import { buildQueryString, parseQueryString } from '../utils/queryString.js';
import { FixtureParams } from './rendererConnect.js';

type RendererParams = {
  fixtureId?: FixtureId;
  fixtureParams?: FixtureParams;
  locked?: boolean;
};

export type RendererSearchParams = {
  fixtureId?: string;
  fixtureParams?: string;
  locked?: string;
};

export function buildRendererQueryString(params: RendererParams) {
  return buildQueryString(encodeRendererSearchParams(params));
}

export function parseRendererQueryString(query: string) {
  return decodeRendererSearchParams(
    parseQueryString<RendererSearchParams>(query)
  );
}

export function encodeRendererSearchParams(params: RendererParams) {
  const stringParams: RendererSearchParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  if (params.fixtureParams) {
    stringParams.fixtureParams = JSON.stringify(params.fixtureParams);
  }

  if (params.locked) {
    stringParams.locked = 'true';
  }

  return stringParams;
}

export function decodeRendererSearchParams(stringParams: RendererSearchParams) {
  const params: RendererParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  if (stringParams.fixtureParams) {
    params.fixtureParams = JSON.parse(stringParams.fixtureParams);
  }

  if (stringParams.locked) {
    params.locked = stringParams.locked === 'true';
  }

  return params;
}
