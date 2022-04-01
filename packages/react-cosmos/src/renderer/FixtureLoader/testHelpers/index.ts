// IMPORTANT: Import socket Socket.IO mock before modules which use Socket.IO
import './mockSocketIo.js';
import { mountPostMessage } from './postMessage.js';
import { FixtureLoaderTestArgs, FixtureLoaderTestCallback } from './shared.js';
import { mountWebSockets } from './webSockets.js';

export function testFixtureLoader(
  testName: string,
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  it(`[postMessage] ${testName}`, () => mountPostMessage(args, cb));
  it(`[webSockets] ${testName}`, () => mountWebSockets(args, cb));
}
