import React from 'react';
import {
  RendererConfig,
  StringRendererSearchParams,
  UserModuleWrappers,
} from 'react-cosmos-core';
import { ServerFixtureLoader } from 'react-cosmos-renderer';
import { NextRendererProvider } from './NextRendererProvider.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  searchParams: StringRendererSearchParams;
};
export function NextFixtureLoader({
  rendererConfig,
  moduleWrappers,
  searchParams,
}: Props) {
  return (
    <NextRendererProvider
      rendererConfig={rendererConfig}
      searchParams={searchParams}
    >
      <ServerFixtureLoader
        searchParams={searchParams}
        moduleWrappers={moduleWrappers}
        renderMessage={renderMessage}
      />
    </NextRendererProvider>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Ubuntu, "Helvetica Neue", Helvetica, sans-serif',
  fontSize: 14,
};

function renderMessage(msg: string) {
  return <div style={containerStyle}>{msg}</div>;
}
