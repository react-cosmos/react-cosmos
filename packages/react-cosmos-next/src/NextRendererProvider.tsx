'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
  FixtureId,
  RendererConfig,
  RendererParams,
  buildQueryString,
} from 'react-cosmos-core';
import {
  GlobalErrorHandler,
  getDomRendererId,
  useDomRendererConnect,
} from 'react-cosmos-dom';
import {
  RendererProvider,
  SelectedFixture,
} from 'react-cosmos-renderer/client';

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
  const selectedFixture = useSelectedFixture(params.fixtureId);

  const pathname = usePathname();
  const router = useRouter();

  // TODO: WIP
  const setSelectedFixture = React.useCallback(
    (action: React.SetStateAction<SelectedFixture | null>) => {
      const nextState =
        typeof action === 'function' ? action(selectedFixture) : action;
      router.push(
        pathname +
          buildQueryString({
            locked: params.locked,
            fixtureId: nextState?.fixtureId,
          })
      );
    },
    [params.locked, pathname, router, selectedFixture]
  );

  return (
    <RendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={params.locked ?? false}
      selectedFixture={selectedFixture}
      setSelectedFixture={setSelectedFixture}
      reloadRenderer={reloadRenderer}
    >
      {children}
      {typeof window !== 'undefined' && <GlobalErrorHandler />}
    </RendererProvider>
  );
}

function useSelectedFixture(fixtureId: FixtureId | null = null) {
  return React.useMemo(
    () =>
      fixtureId && {
        fixtureId,
        initialFixtureState: {},
        renderKey: 0,
      },
    [fixtureId]
  );
}

function reloadRenderer() {
  window.location.reload();
}
