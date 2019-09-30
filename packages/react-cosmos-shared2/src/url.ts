import qs from 'query-string';
import { FixtureId } from './renderer';

export type PlaygroundUrlParams = {
  fixtureId?: FixtureId;
  fullScreen?: boolean;
};

export type RendererUrlParams = {
  _fixtureId?: FixtureId;
};

type EncodedPlaygroundUrlParams = {
  fixtureId?: string;
  fullScreen?: 'true';
};

type EncodedRendererUrlParams = {
  _fixtureId?: string;
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
  const encodedUrlParams = parseUrlQuery<EncodedPlaygroundUrlParams>(query);
  const decoded: PlaygroundUrlParams = {};

  if (encodedUrlParams.fixtureId) {
    decoded.fixtureId = JSON.parse(encodedUrlParams.fixtureId);
  }
  if (encodedUrlParams.fullScreen) {
    decoded.fullScreen = true;
  }

  return decoded;
}

export function parseRendererUrlQuery(query: string): RendererUrlParams {
  const encodedUrlParams = parseUrlQuery<EncodedRendererUrlParams>(query);
  const decoded: RendererUrlParams = {};

  if (encodedUrlParams._fixtureId) {
    decoded._fixtureId = JSON.parse(encodedUrlParams._fixtureId);
  }

  return decoded;
}

function parseUrlQuery<T extends {}>(query: string): T {
  return qs.parse(query) as T;
}
