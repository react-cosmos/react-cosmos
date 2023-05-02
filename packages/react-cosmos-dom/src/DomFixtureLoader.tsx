import React from 'react';
import { UserModuleWrappers } from 'react-cosmos-core';
import { ClientFixtureLoader } from 'react-cosmos-renderer';
import { DomRendererProvider } from 'react-cosmos-renderer/src/client.js';
import { ErrorCatch } from './ErrorCatch.js';
import { getSelectedFixtureId } from './selectedFixtureId.js';
import { isInsideCosmosPreviewIframe } from './utils/isInsideCosmosPreviewIframe.js';

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
        renderNoFixtureSelected={!isInsideCosmosPreviewIframe()}
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
