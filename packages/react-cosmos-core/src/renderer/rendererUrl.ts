import { Base64 } from 'js-base64';
import type { CosmosMode } from '../server/serverTypes.js';
import type { FixtureId } from '../userModules/fixtureTypes.js';
import { buildRendererQueryString } from './rendererQueryString.js';

export type CosmosRendererUrl = null | string | { dev: string; export: string };

export type RendererUrlOptions = {
  // The renderer stays on the selected fixture but still syncs fixture state
  // with the Cosmos UI. Used by the full-screen preview.
  locked?: boolean;
  // The renderer is disconnected from the Cosmos UI and the dev server and
  // only responds to window hooks. Used by visual test runners.
  detached?: boolean;
};

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
  fixtureId?: FixtureId,
  options: RendererUrlOptions = {}
) {
  if (hasFixtureVar(rendererUrl)) {
    if (!fixtureId) return replaceFixtureVar(rendererUrl, 'index');

    return (
      replaceFixtureVar(rendererUrl, encodeRendererUrlFixture(fixtureId)) +
      buildRendererQueryString(options)
    );
  } else {
    if (!fixtureId) return rendererUrl;

    const baseUrl = hostOnlyUrl(rendererUrl) ? rendererUrl + '/' : rendererUrl;
    return baseUrl + buildRendererQueryString({ fixtureId, ...options });
  }
}

export function createWebRendererUrl(
  rendererUrl: string,
  fixtureId?: FixtureId,
  options?: RendererUrlOptions
) {
  return applyWindowHostnameToRendererUrl(
    createRendererUrl(rendererUrl, fixtureId, options)
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
