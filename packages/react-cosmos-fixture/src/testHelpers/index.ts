// IMPORTANT: Import socket Socket.IO mock before modules which use Socket.IO
import './mockSocketIo';

import { mountPostMessage } from './postMessage';
import { mountWebSockets } from './webSockets';
import { FixtureLoaderTestArgs, FixtureLoaderTestCallback } from './shared';

export function testFixtureLoader(
  testName: string,
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  it(`[postMessage] ${testName}`, () => mountPostMessage(args, cb));
  it(`[webSockets] ${testName}`, () => mountWebSockets(args, cb));
}
