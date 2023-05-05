import { FixtureId } from '../userModules/fixtureTypes.js';
import { parseUrlQuery, stringifyUrlQuery } from './queryParams.js';

export type RendererQueryParams = {
  fixtureId?: FixtureId;
  locked?: boolean;
};

type RendererStringQueryParams = {
  fixtureId?: string;
  locked?: string;
};

export function stringifyRendererQueryParams(params: RendererQueryParams) {
  const stringParams: RendererStringQueryParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  if (params.locked) {
    stringParams.locked = String(params.locked);
  }

  return stringParams;
}

export function stringifyRendererUrlQuery(params: RendererQueryParams): string {
  return stringifyUrlQuery(stringifyRendererQueryParams(params));
}

export function parseRendererUrlQuery(query: string): RendererQueryParams {
  const stringParams = parseUrlQuery<RendererStringQueryParams>(query);
  const params: RendererQueryParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  if (stringParams.locked) {
    params.locked = stringParams.locked === 'true';
  }

  return params;
}
