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
  const { locked = false } = params;

  const rendererId = React.useMemo(() => getDomRendererId(), []);
  const rendererConnect = useDomRendererConnect(rendererConfig);

  const selectedFixture = useSelectedFixture(params.fixtureId);
  const setSelectedFixture = useSetSelectedFixture(selectedFixture, locked);

  return (
    <RendererProvider
      rendererId={rendererId}
      rendererConnect={rendererConnect}
      locked={locked}
      selectedFixture={selectedFixture}
      setSelectedFixture={setSelectedFixture}
      reloadRenderer={reloadDomRenderer}
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

function useSetSelectedFixture(
  selectedFixture: SelectedFixture | null,
  locked: boolean
) {
  const pathname = usePathname();
  const router = useRouter();

  return React.useCallback(
    (action: React.SetStateAction<SelectedFixture | null>) => {
      const nextState =
        typeof action === 'function' ? action(selectedFixture) : action;

      router.push(
        pathname +
          buildRendererQueryString({ locked, fixtureId: nextState?.fixtureId })
      );
    },
    [locked, pathname, router, selectedFixture]
  );
}
