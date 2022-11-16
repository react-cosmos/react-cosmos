import React from 'react';
import * as ReactNative from 'react-native';
import parse from 'url-parse';
import { FixtureId } from '../fixture/types.js';
import { FixtureLoader } from '../renderer/FixtureLoader/FixtureLoader.js';
import { createWebSocketsConnect } from '../renderer/FixtureLoader/webSockets.js';
import {
  ReactDecorators,
  ReactFixtureWrappers,
} from '../renderer/reactTypes.js';
import { NativeRendererConfig } from '../renderer/rendererConfig.js';

const { View, Text, StyleSheet, NativeModules } = ReactNative;

// TODO: Generate unique ID per device
const rendererId = 'native-renderer';

type Props = {
  rendererConfig: NativeRendererConfig;
  fixtures: ReactFixtureWrappers;
  decorators: ReactDecorators;
  initialFixtureId?: FixtureId;
};

export function NativeFixtureLoader({
  rendererConfig: { port },
  fixtures,
  decorators,
  initialFixtureId,
}: Props) {
  const socketUrl = getSocketUrl(port);
  return (
    <FixtureLoader
      rendererId={rendererId}
      rendererConnect={createWebSocketsConnect(socketUrl)}
      fixtures={fixtures}
      initialFixtureId={initialFixtureId}
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
    justifyContent: 'center',
  },
});
