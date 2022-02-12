import * as ReactNative from 'react-native';

// https://stackoverflow.com/a/53655887/128816
const wsWarning =
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?';
if (ReactNative.LogBox) ReactNative.LogBox.ignoreLogs([wsWarning]);
else if (ReactNative.YellowBox)
  ReactNative.YellowBox.ignoreWarnings([wsWarning]);

export { NativeFixtureLoader } from './NativeFixtureLoader';
