import React from 'react';
import { UserModuleWrappers } from 'react-cosmos-core';
import {
  ClientFixtureLoader,
  DomRendererProvider,
} from 'react-cosmos-renderer/client';
import { ErrorCatch } from './ErrorCatch.js';
import { getSelectedFixtureId } from './selectedFixtureId.js';

type Props = {
  playgroundUrl: string;
  moduleWrappers: UserModuleWrappers;
};
export function DomFixtureLoader({ playgroundUrl, moduleWrappers }: Props) {
  return (
    <DomRendererProvider playgroundUrl={playgroundUrl}>
      <ClientFixtureLoader
        moduleWrappers={moduleWrappers}
        globalDecorators={globalDecorators}
        selectedFixtureId={getSelectedFixtureId()}
        renderMessage={renderDomMessage}
      />
    </DomRendererProvider>
  );
}

const globalDecorators = [ErrorCatch];

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

export function renderDomMessage(msg: string) {
  return <div style={containerStyle}>{msg}</div>;
}
