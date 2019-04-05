import './mockSocketIo';
import { mountPostMessage } from './postMessage';
import { mountWebSockets } from './webSockets';
import { MountFixtureLoader } from './shared';

type TestsCallback = (mount: MountFixtureLoader) => void;

export function runFixtureLoaderTests(cb: TestsCallback) {
  cb(mountPostMessage);
  cb(mountWebSockets);
}
