import React from 'react';
import {
  createWebSocketsConnect,
  FixtureId,
  FixtureLoader,
  ReactDecorators,
  ReactFixtureWrappers,
  RendererConfig,
} from 'react-cosmos-core';
import * as ReactNative from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

const { View, Text, StyleSheet } = ReactNative;

// TODO: Generate unique ID per device
const rendererId = 'native-renderer';

type Props = {
  rendererConfig: RendererConfig;
  fixtures: ReactFixtureWrappers;
  decorators: ReactDecorators;
  initialFixtureId?: FixtureId;
};

export function NativeFixtureLoader({
  rendererConfig: { playgroundUrl },
  fixtures,
  decorators,
  initialFixtureId,
}: Props) {
  const socketUrl = getSocketUrl(playgroundUrl);
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
