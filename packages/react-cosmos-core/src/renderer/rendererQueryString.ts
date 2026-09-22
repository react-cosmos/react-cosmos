import { buildQueryString, parseQueryString } from '../utils/queryString.js';
import type { RendererParams } from './rendererParams.js';

export type RendererSearchParams = {
  fixtureId?: string;
  locked?: string;
  detached?: string;
};

export function buildRendererQueryString(params: RendererParams) {
  return buildQueryString(encodeRendererSearchParams(params));
}

export function parseRendererQueryString(query: string) {
  return decodeRendererSearchParams(
    parseQueryString<RendererSearchParams>(query)
  );
}

function encodeRendererSearchParams(params: RendererParams) {
  const stringParams: RendererSearchParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  if (params.locked) {
    stringParams.locked = 'true';
  }

  if (params.detached) {
    stringParams.detached = 'true';
  }

  return stringParams;
}

function decodeRendererSearchParams(stringParams: RendererSearchParams) {
  const params: RendererParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  if (stringParams.locked) {
    params.locked = stringParams.locked === 'true';
  }

  if (stringParams.detached) {
    params.detached = stringParams.detached === 'true';
  }

  return params;
}
