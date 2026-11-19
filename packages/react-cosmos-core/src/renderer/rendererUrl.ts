import { Base64 } from 'js-base64';
import type { CosmosMode } from '../server/serverTypes.js';
import type { FixtureId } from '../userModules/fixtureTypes.js';
import type { RendererParams } from './rendererParams.js';
import { buildRendererQueryString } from './rendererQueryString.js';

export type CosmosRendererUrl = null | string | { dev: string; export: string };

export function pickRendererUrl(
  rendererUrl: undefined | CosmosRendererUrl,
  mode: CosmosMode
): null | string {
  return rendererUrl && typeof rendererUrl === 'object'
    ? rendererUrl[mode]
    : (rendererUrl ?? null);
}

export function createRendererUrl(
  rendererUrl: string,
  params?: RendererParams
): string;
/** @deprecated Pass renderer params as an object */
export function createRendererUrl(
  rendererUrl: string,
  fixtureId?: FixtureId,
  locked?: boolean
): string;
export function createRendererUrl(
  rendererUrl: string,
  paramsOrFixtureId?: RendererParams | FixtureId,
  locked?: boolean
) {
  const params = toRendererParams(paramsOrFixtureId, locked);
  if (hasFixtureVar(rendererUrl)) {
    const { fixtureId, ...queryParams } = params;
    const fixture = fixtureId ? encodeRendererUrlFixture(fixtureId) : 'index';
    return (
      replaceFixtureVar(rendererUrl, fixture) +
      buildRendererQueryString(queryParams)
    );
  } else {
    const queryString = buildRendererQueryString(params);
    if (!queryString) return rendererUrl;

    const baseUrl = hostOnlyUrl(rendererUrl) ? rendererUrl + '/' : rendererUrl;
    return baseUrl + queryString;
  }
}

export function createWebRendererUrl(
  rendererUrl: string,
  params?: RendererParams
): string;
/** @deprecated Pass renderer params as an object */
export function createWebRendererUrl(
  rendererUrl: string,
  fixtureId?: FixtureId,
  locked?: boolean
): string;
export function createWebRendererUrl(
  rendererUrl: string,
  paramsOrFixtureId?: RendererParams | FixtureId,
  locked?: boolean
) {
  return applyWindowHostnameToRendererUrl(
    createRendererUrl(rendererUrl, toRendererParams(paramsOrFixtureId, locked))
  );
}

// Cosmos packages older than 7.5 depend on this package with a caret range, so
// they can end up calling this version with the positional (fixtureId, locked)
// arguments they were built against. See the tech debt doc for when this can
// be removed.
function toRendererParams(
  paramsOrFixtureId: RendererParams | FixtureId = {},
  locked?: boolean
): RendererParams {
  return 'path' in paramsOrFixtureId
    ? { fixtureId: paramsOrFixtureId, locked }
    : paramsOrFixtureId;
}

export function encodeRendererUrlFixture(fixtureId: FixtureId) {
  return Base64.encode(JSON.stringify(fixtureId));
}

export function decodeRendererUrlFixture(fixture: string): FixtureId {
  return JSON.parse(Base64.decode(fixture));
}

function hasFixtureVar(rendererUrl: string) {
  return rendererUrl.includes('<fixture>');
}

function replaceFixtureVar(rendererUrl: string, fixture: string) {
  return rendererUrl.replace(/<fixture>/g, fixture);
}

function hostOnlyUrl(url: string) {
  try {
    const { protocol, pathname } = new URL(url);
    return (protocol === 'http:' || protocol === 'https:') && pathname === '/';
  } catch {
    return false;
  }
}

function applyWindowHostnameToRendererUrl(rendererUrl: string) {
  try {
    const url = new URL(rendererUrl);

    const windowHostname = window.location.hostname;
    if (url.hostname !== windowHostname && url.hostname === 'localhost')
      url.hostname = windowHostname;

    return url.toString();
  } catch {
    return rendererUrl;
  }
}
