import { buildQueryString, parseQueryString } from '../utils/queryString.js';
import { RendererParams } from './rendererParams.js';

export type RendererSearchParams = {
  fixtureId?: string;
  locked?: string;
  key?: string;
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

  if (params.locked) {
    stringParams.locked = 'true';
  }

  if (params.key) {
    stringParams.key = params.key.toString();
  }

  return stringParams;
}

export function decodeRendererSearchParams(stringParams: RendererSearchParams) {
  const params: RendererParams = {};

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
