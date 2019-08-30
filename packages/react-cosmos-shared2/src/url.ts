import qs from 'query-string';
import { FixtureId } from './renderer';

export type PlaygroundUrlParams = {
  fixtureId?: FixtureId;
  fullScreen?: boolean;
};

type EncodedPlaygroundUrlParams = {
  fixtureId?: string;
  fullScreen?: 'true';
};

export function stringifyPlaygroundUrlQuery(
  urlParams: PlaygroundUrlParams
): string {
  const encodedUrlParams: EncodedPlaygroundUrlParams = {};

  if (urlParams.fixtureId) {
    encodedUrlParams.fixtureId = JSON.stringify(urlParams.fixtureId);
  }
  if (urlParams.fullScreen) {
    encodedUrlParams.fullScreen = 'true';
  }

  return qs.stringify(encodedUrlParams);
}

export function parsePlaygroundUrlQuery(query: string): PlaygroundUrlParams {
  const encodedUrlParams: EncodedPlaygroundUrlParams = qs.parse(query);
  const decoded: PlaygroundUrlParams = {};

  if (encodedUrlParams.fixtureId) {
    decoded.fixtureId = JSON.parse(encodedUrlParams.fixtureId);
  }
  if (encodedUrlParams.fullScreen) {
    decoded.fullScreen = true;
  }

  return decoded;
}
