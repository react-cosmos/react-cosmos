'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  FixtureId,
  RendererConfig,
  RendererParams,
  buildRendererQueryString,
} from 'react-cosmos-core';
import {
  GlobalErrorHandler,
  getDomRendererId,
  reloadDomRenderer,
  useDomRendererConnect,
} from 'react-cosmos-dom';
import { RendererProvider } from 'react-cosmos-renderer/client';

type Props = {
  children: React.ReactNode;
  rendererConfig: RendererConfig;
  params: RendererParams;
};
export function NextRendererProvider({
  children,
  rendererConfig,
  params,
}: Props) {
  const rendererId = React.useMemo(() => getDomRendererId(), []);
  const rendererConnect = useDomRendererConnect(rendererConfig);

  const { locked = false } = params;
  const selectedFixtureId = params.fixtureId ?? null;

  const selectedFixture = React.useMemo(
    () =>
      selectedFixtureId && {
        fixtureId: selectedFixtureId,
        initialFixtureState: {},
        renderKey: 0,
      },
    [selectedFixtureId]
  );

  const pathname = usePathname();
  const router = useRouter();

  const selectFixture = React.useCallback(
    (fixtureId: FixtureId) => {
      router.push(pathname + buildRendererQueryString({ locked, fixtureId }));
    },
    [locked, pathname, router]
  );

  const unselectFixture = React.useCallback(() => {
    router.push(pathname + buildRendererQueryString({ locked }));
  }, [locked, pathname, router]);

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
