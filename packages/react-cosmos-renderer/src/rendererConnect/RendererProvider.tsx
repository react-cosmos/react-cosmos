'use client';
import React from 'react';
import {
  FixtureList,
  RendererConnect,
  RendererSearchParams,
} from 'react-cosmos-core';
import { RendererContext } from './RendererContext.js';

export type Props = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
  searchParams: RendererSearchParams;
  setSearchParams(nextParams: RendererSearchParams): void;
  reloadRenderer(): void;
};
export function RendererProvider(props: Props) {
  const [lazyItems, setLazyItems] = React.useState<FixtureList>({});

  const value = React.useMemo(() => {
    return {
      rendererId: props.rendererId,
      rendererConnect: props.rendererConnect,
      searchParams: props.searchParams,
      setSearchParams: props.setSearchParams,
      reloadRenderer: props.reloadRenderer,
      lazyItems,
      setLazyItems,
    };
  }, [
    lazyItems,
    props.reloadRenderer,
    props.rendererConnect,
    props.rendererId,
    props.searchParams,
    props.setSearchParams,
  ]);

  return (
    <RendererContext.Provider value={value}>
      {props.children}
    </RendererContext.Provider>
  );
}
