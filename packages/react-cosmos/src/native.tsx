import React from 'react';
import {
  createWebSocketsConnect,
  FixtureLoader
} from 'react-cosmos-shared2/FixtureLoader';
import {
  ReactDecoratorsByPath,
  ReactFixtureExportsByPath
} from 'react-cosmos-shared2/react';
import { NativeRendererConfig } from 'react-cosmos-shared2/renderer';
import { NativeModules, StyleSheet, Text, View, YellowBox } from 'react-native';
import parse from 'url-parse';

// https://stackoverflow.com/a/53655887/128816
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

// TODO: Generate unique ID per device
const rendererId = 'native-renderer';

type Props = {
  rendererConfig: NativeRendererConfig;
  fixtures: ReactFixtureExportsByPath;
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
      rendererId={rendererId}
      rendererConnect={createWebSocketsConnect(socketUrl)}
      fixtures={fixtures}
      selectedFixtureId={null}
      systemDecorators={[]}
      userDecorators={decorators}
      renderMessage={renderMessage}
    />
  );
}

function getSocketUrl(port: number) {
  const host = parse(NativeModules.SourceCode.scriptURL).hostname;
  return `ws://${host}:${port}`;
}

function renderMessage({ msg }: { msg: string }) {
  return (
    <View style={styles.container}>
      <Text>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
