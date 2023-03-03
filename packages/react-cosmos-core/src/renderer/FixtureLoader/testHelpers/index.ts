import { mountPostMessage } from './postMessage.js';
import { FixtureLoaderTestArgs, FixtureLoaderTestCallback } from './shared.js';
import { mountWebSockets } from './webSockets.js';

export function testFixtureLoader(
  testName: string,
  args: FixtureLoaderTestArgs,
  cb: FixtureLoaderTestCallback
) {
  const pmTest = () => mountPostMessage(args, cb);
  const wsTest = () => mountWebSockets(args, cb);

  if (args.only) {
    if (args.only !== 'webSocket') it.only(`[postMessage] ${testName}`, pmTest);
    if (args.only !== 'postMessage') it.only(`[webSocket] ${testName}`, wsTest);
  } else {
    it(`[postMessage] ${testName}`, pmTest);
    it(`[webSocket] ${testName}`, wsTest);
  }
}
