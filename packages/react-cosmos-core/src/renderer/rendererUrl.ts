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
  params: RendererParams = {}
) {
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
) {
  return applyWindowHostnameToRendererUrl(
    createRendererUrl(rendererUrl, params)
  );
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
