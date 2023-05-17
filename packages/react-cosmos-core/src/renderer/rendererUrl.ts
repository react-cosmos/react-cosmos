import { Base64 } from 'js-base64';
import { FixtureId } from '../userModules/fixtureTypes.js';
import { buildRendererQueryString } from './rendererQueryString.js';

export function createRendererUrl(
  rendererUrl: string,
  fixtureId?: FixtureId,
  locked?: boolean
) {
  if (hasFixtureVar(rendererUrl)) {
    if (!fixtureId) return replaceFixtureVar(rendererUrl, 'index');

    return (
      replaceFixtureVar(rendererUrl, encodeFixtureId(fixtureId)) +
      buildRendererQueryString({ locked })
    );
  } else {
    if (!fixtureId) return rendererUrl;

    const baseUrl = hostOnlyUrl(rendererUrl) ? rendererUrl + '/' : rendererUrl;
    return baseUrl + buildRendererQueryString({ fixtureId, locked });
  }
}

export function encodeFixtureId(fixtureId: FixtureId) {
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
