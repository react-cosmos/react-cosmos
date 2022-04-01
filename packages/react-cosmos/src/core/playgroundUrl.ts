import qs from 'query-string';
import { FixtureId } from './types.js';

export type PlaygroundUrlParams = {
  fixtureId?: FixtureId;
};

export type RendererUrlParams = {
  _fixtureId?: FixtureId;
};

type EncodedPlaygroundUrlParams = {
  fixtureId?: string;
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

  return qs.stringify(encodedUrlParams);
}

export function parsePlaygroundUrlQuery(query: string): PlaygroundUrlParams {
  const encodedUrlParams = parseUrlQuery<EncodedPlaygroundUrlParams>(query);
  const decoded: PlaygroundUrlParams = {};

  if (encodedUrlParams.fixtureId) {
    decoded.fixtureId = JSON.parse(encodedUrlParams.fixtureId);
  }

  return decoded;
}

export function stringifyRendererUrlQuery(
  urlParams: RendererUrlParams
): string {
  const encodedUrlParams: EncodedRendererUrlParams = {};

  if (urlParams._fixtureId) {
    encodedUrlParams._fixtureId = JSON.stringify(urlParams._fixtureId);
  }

  return qs.stringify(encodedUrlParams);
}

export function parseRendererUrlQuery(query: string): RendererUrlParams {
  const encodedUrlParams = parseUrlQuery<EncodedRendererUrlParams>(query);
  const decoded: RendererUrlParams = {};

  if (encodedUrlParams._fixtureId) {
    decoded._fixtureId = JSON.parse(encodedUrlParams._fixtureId);
  }

  return decoded;
}

export function parseUrlQuery<T extends {}>(query: string): T {
  return qs.parse(query) as T;
}

export function stringifyUrlQuery(params: {}): string {
  return qs.stringify(params);
}
