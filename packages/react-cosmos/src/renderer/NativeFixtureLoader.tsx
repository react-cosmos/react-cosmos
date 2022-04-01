import React from 'react';
import * as ReactNative from 'react-native';
import parse from 'url-parse';
import { ReactDecorators, ReactFixtureWrappers } from '../core/react/types';
import { FixtureLoader } from './FixtureLoader/FixtureLoader';
import { createWebSocketsConnect } from './FixtureLoader/webSockets';
import { NativeRendererConfig } from './rendererConfig';
import { FixtureId } from './types';

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
