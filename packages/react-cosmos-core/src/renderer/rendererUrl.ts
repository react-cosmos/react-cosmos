import { Base64 } from 'js-base64';
import { CosmosMode } from '../server/serverTypes.js';
import { FixtureId } from '../userModules/fixtureTypes.js';
import { FixtureParams } from './rendererConnect.js';
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

export function createRendererUrl(opts: {
  rendererUrl: string;
  fixtureId?: FixtureId;
  fixtureParams?: FixtureParams;
  locked?: boolean;
}) {
  const { rendererUrl, fixtureId, fixtureParams, locked } = opts;

  if (hasFixtureVar(rendererUrl)) {
    if (!fixtureId) return replaceFixtureVar(rendererUrl, 'index');

    return (
      replaceFixtureVar(rendererUrl, encodeRendererUrlFixture(fixtureId)) +
      buildRendererQueryString({ fixtureParams, locked })
    );
  } else {
    if (!fixtureId) return rendererUrl;

    const baseUrl = hostOnlyUrl(rendererUrl) ? rendererUrl + '/' : rendererUrl;
    return (
      baseUrl + buildRendererQueryString({ fixtureId, fixtureParams, locked })
    );
  }
}

export function createWebRendererUrl(opts: {
  rendererUrl: string;
  fixtureId?: FixtureId;
  fixtureParams?: FixtureParams;
  locked?: boolean;
}) {
  return applyWindowHostnameToRendererUrl(createRendererUrl(opts));
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
  } catch (err) {
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
