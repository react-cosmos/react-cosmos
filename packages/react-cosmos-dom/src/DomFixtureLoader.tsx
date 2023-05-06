import React, { useCallback } from 'react';
import {
  RendererConfig,
  UserModuleWrappers,
  buildQueryString,
  parseQueryString,
} from 'react-cosmos-core';
import {
  ClientFixtureLoader,
  DomRendererProvider,
} from 'react-cosmos-renderer/client';
import { ErrorCatch } from './ErrorCatch.js';
import { getSelectedFixtureId } from './selectedFixtureId.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
};
export function DomFixtureLoader({ rendererConfig, moduleWrappers }: Props) {
  const onSearchParams = useCallback((queryParams: {}) => {
    // TODO: Figure out if this is the best way to update the URL
    window.location.search = buildQueryString(queryParams);
  }, []);

  return (
    <DomRendererProvider
      rendererConfig={rendererConfig}
      searchParams={parseQueryString(location.search)}
      onSearchParams={onSearchParams}
    >
      <ClientFixtureLoader
        moduleWrappers={moduleWrappers}
        globalDecorators={globalDecorators}
        // TODO: Unify this with searchParams
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
