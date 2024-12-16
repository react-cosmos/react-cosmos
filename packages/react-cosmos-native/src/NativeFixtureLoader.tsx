import React from 'react';
import {
  FixtureId,
  RendererConfig,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { ClientFixtureLoader } from 'react-cosmos-renderer/client';
// @ts-ignore FIXME Need to install react-native in the monorepo?
import * as ReactNative from 'react-native';
import { NativeRendererProvider } from './NativeRendererProvider.js';

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
  return (
    <NativeRendererProvider
      rendererConfig={rendererConfig}
      initialFixtureId={initialFixtureId}
    >
      <ClientFixtureLoader
        moduleWrappers={moduleWrappers}
        renderMessage={renderMessage}
      />
    </NativeRendererProvider>
  );
}

function renderMessage(msg: string) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{msg}</Text>
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
  text: {
    fontSize: 24,
    fontWeight: '300',
  },
});
