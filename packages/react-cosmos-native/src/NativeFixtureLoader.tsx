import React from 'react';
import {
  FixtureId,
  ReactDecorator,
  RendererConfig,
  UserModuleWrappers,
} from 'react-cosmos-core';
import {
  FixtureConnect,
  RendererContextProvider,
  createWebSocketsConnect,
} from 'react-cosmos-renderer/client';
import * as ReactNative from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

const { View, Text, StyleSheet } = ReactNative;

// TODO: Generate unique ID per device
const rendererId = 'native-renderer';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  initialFixtureId?: FixtureId;
};

export function NativeFixtureLoader({
  rendererConfig: { playgroundUrl },
  moduleWrappers,
  initialFixtureId,
}: Props) {
  const socketUrl = getSocketUrl(playgroundUrl);
  return (
    <RendererContextProvider
      rendererId={rendererId}
      rendererConnect={createWebSocketsConnect(socketUrl)}
    >
      <FixtureConnect
        moduleWrappers={moduleWrappers}
        globalDecorators={globalDecorators}
        initialFixtureId={initialFixtureId}
        renderMessage={renderMessage}
      />
    </RendererContextProvider>
  );
}

const globalDecorators: ReactDecorator[] = [];

function renderMessage(msg: string) {
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
