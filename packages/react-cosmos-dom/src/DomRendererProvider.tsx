'use client';
import React from 'react';
import {
  RendererConfig,
  decodeRendererSearchParams,
  parseQueryString,
} from 'react-cosmos-core';
import { ClientRendererProvider } from 'react-cosmos-renderer/client';
import { GlobalErrorHandler } from './GlobalErrorHandler.js';
import { getDomRendererId } from './domRendererId.js';
import { useDomRendererConnect } from './useDomRendererConnect.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
};
export function DomRendererProvider({ children, rendererConfig }: Props) {
  const rendererId = React.useMemo(() => getDomRendererId(), []);
  const rendererConnect = useDomRendererConnect(rendererConfig);
  const searchParams = useDecodedSearchParams();

  return (
    <ClientRendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={searchParams.locked ?? false}
      selectedFixtureId={searchParams.fixtureId}
      reloadRenderer={reloadRenderer}
    >
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </ClientRendererProvider>
  );
}

function reloadRenderer() {
  window.location.reload();
}

function useDecodedSearchParams() {
  return React.useMemo(
    () => decodeRendererSearchParams(parseQueryString(location.search)),
    []
  );
}
