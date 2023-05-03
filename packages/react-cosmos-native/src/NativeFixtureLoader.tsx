import React from 'react';
import {
  FixtureId,
  ReactDecorator,
  RendererConfig,
  UserModuleWrappers,
} from 'react-cosmos-core';
import {
  ClientFixtureLoader,
  NativeRendererProvider,
} from 'react-cosmos-renderer/client';
import * as ReactNative from 'react-native';
import { getSocketUrl } from './getSocketUrl.js';

const { View, Text, StyleSheet } = ReactNative;

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  initialFixtureId?: FixtureId;
};

export function NativeFixtureLoader({
  rendererConfig,
  moduleWrappers,
  initialFixtureId,
}: Props) {
  const socketUrl = getSocketUrl(rendererConfig.playgroundUrl);
  return (
    <NativeRendererProvider socketUrl={socketUrl}>
      <ClientFixtureLoader
        moduleWrappers={moduleWrappers}
        globalDecorators={globalDecorators}
        initialFixtureId={initialFixtureId}
        renderMessage={renderMessage}
      />
    </NativeRendererProvider>
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
