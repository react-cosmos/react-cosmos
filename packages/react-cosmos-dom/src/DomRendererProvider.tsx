'use client';
import React from 'react';
import {
  RendererConfig,
  decodeRendererSearchParams,
  parseQueryString,
} from 'react-cosmos-core';
import { StatefulRendererProvider } from 'react-cosmos-renderer/client';
import { GlobalErrorHandler } from './GlobalErrorHandler.js';
import { reloadDomRenderer } from './reloadDomRenderer.js';
import { useDomRendererConnect } from './useDomRendererConnect.js';
import { useDomRendererId } from './useDomRendererId.js';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
};
export function DomRendererProvider({ children, rendererConfig }: Props) {
  const rendererId = useDomRendererId();
  const rendererConnect = useDomRendererConnect(rendererConfig);

  const { locked = false, fixtureId = null } = React.useMemo(
    () => decodeRendererSearchParams(parseQueryString(location.search)),
    []
  );

  return (
    <StatefulRendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={locked}
      selectedFixtureId={fixtureId}
      reloadRenderer={reloadDomRenderer}
    >
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </StatefulRendererProvider>
  );
}
