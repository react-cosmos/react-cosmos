'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  FixtureId,
  RendererConfig,
  createRendererUrl,
  pickRendererUrl,
} from 'react-cosmos-core';
import {
  GlobalErrorHandler,
  reloadDomRenderer,
  useDomRendererConnect,
  useDomRendererId,
} from 'react-cosmos-dom';
import { SelectedFixture } from 'react-cosmos-renderer';
import { RendererProvider } from 'react-cosmos-renderer/client';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  selectedFixture: SelectedFixture | null;
};
export function NextRendererProvider({
  children,
  rendererConfig,
  selectedFixture,
}: Props) {
  const rendererId = useDomRendererId();
  const rendererConnect = useDomRendererConnect(rendererConfig);

  const router = useRouter();
  const rendererUrl = pickRendererUrl(
    rendererConfig.rendererUrl,
    process.env.NODE_ENV === 'production' ? 'export' : 'dev'
  );

  const searchParams = useSearchParams();
  const locked = searchParams.get('locked') === 'true';

  const selectFixture = React.useCallback(
    (fixtureId: FixtureId) => {
      if (rendererUrl) router.push(createRendererUrl(rendererUrl, fixtureId));
    },
    [rendererUrl, router]
  );

  const unselectFixture = React.useCallback(() => {
    if (rendererUrl) router.push(createRendererUrl(rendererUrl));
  }, [rendererUrl, router]);

  return (
    <RendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={locked}
      selectedFixture={selectedFixture}
      selectFixture={selectFixture}
      unselectFixture={unselectFixture}
      reloadRenderer={reloadDomRenderer}
    >
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </RendererProvider>
  );
}
