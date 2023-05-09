'use client';
import React from 'react';
import {
  FixtureList,
  RendererConnect,
  RendererParams,
} from 'react-cosmos-core';
import { RendererContext } from './RendererContext.js';

export type Props = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
  params: RendererParams;
  setParams(nextParams: RendererParams): void;
  reloadRenderer(): void;
};
export function RendererProvider(props: Props) {
  const [lazyItems, setLazyItems] = React.useState<FixtureList>({});

  const value = React.useMemo(() => {
    return {
      rendererId: props.rendererId,
      rendererConnect: props.rendererConnect,
      params: props.params,
      setParams: props.setParams,
      reloadRenderer: props.reloadRenderer,
      lazyItems,
      setLazyItems,
    };
  }, [
    lazyItems,
    props.params,
    props.reloadRenderer,
    props.rendererConnect,
    props.rendererId,
    props.setParams,
  ]);

  return (
    <RendererContext.Provider value={value}>
      {props.children}
    </RendererContext.Provider>
  );
}
