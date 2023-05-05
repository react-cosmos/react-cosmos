import { FixtureId } from '../userModules/fixtureTypes.js';
import { parseUrlQuery, stringifyUrlQuery } from './queryParams.js';

export type PlaygroundQueryParams = {
  fixtureId?: FixtureId;
};

type PlaygroundStringQueryParams = {
  fixtureId?: string;
};

export function stringifyPlaygroundUrlQuery(
  params: PlaygroundQueryParams
): string {
  const stringParams: PlaygroundStringQueryParams = {};

  if (params.fixtureId) {
    stringParams.fixtureId = JSON.stringify(params.fixtureId);
  }

  return stringifyUrlQuery(stringParams);
}

export function parsePlaygroundUrlQuery(query: string): PlaygroundQueryParams {
  const stringParams = parseUrlQuery<PlaygroundStringQueryParams>(query);
  const params: PlaygroundQueryParams = {};

  if (stringParams.fixtureId) {
    params.fixtureId = JSON.parse(stringParams.fixtureId);
  }

  return params;
}
