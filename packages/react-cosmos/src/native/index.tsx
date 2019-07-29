import React from 'react';
import { createWebSocketsConnect, FixtureLoader } from 'react-cosmos-fixture';
import {
  ReactDecoratorsByPath,
  ReactFixturesByPath
} from 'react-cosmos-shared2/react';
import { NativeModules, YellowBox } from 'react-native';
import parse from 'url-parse';
import { NativeRendererConfig } from '../shared/rendererConfig';

// https://stackoverflow.com/a/53655887/128816
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

type Props = {
  rendererConfig: NativeRendererConfig;
  fixtures: ReactFixturesByPath;
  decorators: ReactDecoratorsByPath;
};

export function NativeFixtureLoader({
  rendererConfig: { port },
  fixtures,
  decorators
}: Props) {
  const socketUrl = getSocketUrl(port);
  return (
    <FixtureLoader
      rendererId="native-renderer"
      rendererConnect={createWebSocketsConnect(socketUrl)}
      fixtures={fixtures}
      systemDecorators={[]}
      userDecorators={decorators}
    />
  );
}

function getSocketUrl(port: number) {
  const host = parse(NativeModules.SourceCode.scriptURL).hostname;
  return `ws://${host}:${port}`;
}
