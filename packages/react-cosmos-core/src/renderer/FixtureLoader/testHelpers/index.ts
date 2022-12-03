import { mountPostMessage } from './postMessage.js';
import { FixtureLoaderTestArgs, FixtureLoaderTestCallback } from './shared.js';
import { mountWebSockets } from './webSockets.js';

export function testFixtureLoader(
  testName: string,
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback,
  only = false
) {
  if (only) {
    it.only(`[postMessage] ${testName}`, () => mountPostMessage(args, cb));
    it.only(`[webSockets] ${testName}`, () => mountWebSockets(args, cb));
  } else {
    it(`[postMessage] ${testName}`, () => mountPostMessage(args, cb));
    it(`[webSockets] ${testName}`, () => mountWebSockets(args, cb));
  }
}
