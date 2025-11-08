'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  FixtureId,
  FixtureParams,
  RendererConfig,
  createWebRendererUrl,
  decodeRendererSearchParams,
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
  rendererConfig: { rendererUrl, webSocketUrl },
  selectedFixture,
}: Props) {
  const rendererId = useDomRendererId();
  const rendererConnect = useDomRendererConnect(webSocketUrl);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { fixtureParams = {}, locked = false } = decodeRendererSearchParams(
    Object.fromEntries(searchParams.entries())
  );

  const selectFixture = React.useCallback(
    (fixtureId: FixtureId) => {
      if (rendererUrl) {
        router.replace(
          trimHtmlExtension(createWebRendererUrl({ rendererUrl, fixtureId }))
        );
      }
    },
    [rendererUrl, router]
  );

  const unselectFixture = React.useCallback(() => {
    if (rendererUrl) {
      router.replace(trimHtmlExtension(createWebRendererUrl({ rendererUrl })));
    }
  }, [rendererUrl, router]);

  const setFixtureParams = React.useCallback(
    (newFixtureParams: FixtureParams) => {
      if (rendererUrl && selectedFixture) {
        window.location.href = createWebRendererUrl({
          rendererUrl,
          fixtureId: selectedFixture.fixtureId,
          fixtureParams: newFixtureParams,
        });
      }
    },
    [rendererUrl, selectedFixture]
  );

  const reloadRenderer = React.useCallback(() => {
    if (rendererUrl) {
      window.location.href = createWebRendererUrl({ rendererUrl });
    }
  }, [rendererUrl]);

  console.log({ fixtureParams, setFixtureParams });

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

function trimHtmlExtension(href: string) {
  return href.replace(/\.html$/, '');
}
