import './mockSocketIo';
import { mountPostMessage } from './postMessage';
import { mountWebSockets } from './webSockets';
import { MountFixtureConnect } from './shared';

type TestsCallback = (mount: MountFixtureConnect) => void;

export function runFixtureConnectTests(cb: TestsCallback) {
  cb(mountPostMessage);
  cb(mountWebSockets);
}
