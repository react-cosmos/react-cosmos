import React from 'react';
import {
  RendererConfig,
  RendererSearchParams,
  UserModuleWrappers,
  decodeRendererSearchParams,
} from 'react-cosmos-core';
import { ServerFixtureLoader } from 'react-cosmos-renderer';
import { NextRendererProvider } from './NextRendererProvider.js';

type Props = {
  rendererConfig: RendererConfig;
  moduleWrappers: UserModuleWrappers;
  searchParams: RendererSearchParams;
};
export function NextFixtureLoader({
  rendererConfig,
  moduleWrappers,
  searchParams,
}: Props) {
  const params = useDecodedSearchParams(searchParams);
  return (
    <NextRendererProvider rendererConfig={rendererConfig} params={params}>
      <ServerFixtureLoader
        fixtureId={params.fixtureId}
        moduleWrappers={moduleWrappers}
        renderMessage={renderMessage}
      />
    </NextRendererProvider>
  );
}

function useDecodedSearchParams(searchParams: RendererSearchParams) {
  return React.useMemo(
    () => decodeRendererSearchParams(searchParams),
    [searchParams]
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
