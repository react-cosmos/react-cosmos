'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  FixtureId,
  RendererConfig,
  createRendererUrl,
} from 'react-cosmos-core';
import {
  GlobalErrorHandler,
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
  rendererConfig: { rendererUrl, playgroundUrl },
  selectedFixture,
}: Props) {
  const rendererId = useDomRendererId();
  const rendererConnect = useDomRendererConnect(playgroundUrl);

  const router = useRouter();
  const searchParams = useSearchParams();
  const locked = searchParams.get('locked') === 'true';

  const selectFixture = React.useCallback(
    (fixtureId: FixtureId) => {
      if (rendererUrl) {
        router.push(trimHrefHtmlExt(createRendererUrl(rendererUrl, fixtureId)));
      }
    },
    [rendererUrl, router]
  );

  const unselectFixture = React.useCallback(() => {
    if (rendererUrl) {
      router.push(trimHrefHtmlExt(createRendererUrl(rendererUrl)));
    }
  }, [rendererUrl, router]);

  const reloadRenderer = React.useCallback(() => {
    if (rendererUrl) {
      window.location.href = createRendererUrl(
        rendererUrl,
        selectedFixture?.fixtureId
      );
    }
  }, [rendererUrl, selectedFixture?.fixtureId]);

  return (
    <RendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={locked}
      selectedFixture={selectedFixture}
      selectFixture={selectFixture}
      unselectFixture={unselectFixture}
      reloadRenderer={reloadRenderer}
    >
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </RendererProvider>
  );
}

function trimHrefHtmlExt(href: string) {
  return href.replace(/\.html$/, '');
}
