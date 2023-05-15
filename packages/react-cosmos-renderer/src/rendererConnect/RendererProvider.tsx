'use client';
import React from 'react';
import { FixtureList, RendererConnect } from 'react-cosmos-core';
import { RendererContext, SelectedFixture } from './RendererContext.js';

type Props = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
  locked: boolean;
  selectedFixture: SelectedFixture | null;
  setSelectedFixture: React.Dispatch<
    React.SetStateAction<SelectedFixture | null>
  >;
  reloadRenderer(): void;
};
export function RendererProvider(props: Props) {
  const [lazyItems, setLazyItems] = React.useState<FixtureList>({});

  const value = React.useMemo(() => {
    return {
      rendererId: props.rendererId,
      rendererConnect: props.rendererConnect,
      locked: props.locked,
      selectedFixture: props.selectedFixture,
      setSelectedFixture: props.setSelectedFixture,
      reloadRenderer: props.reloadRenderer,
      lazyItems,
      setLazyItems,
    };
  }, [
    lazyItems,
    props.locked,
    props.reloadRenderer,
    props.rendererConnect,
    props.rendererId,
    props.selectedFixture,
    props.setSelectedFixture,
  ]);

  return (
    <RendererContext.Provider value={value}>
      {props.children}
    </RendererContext.Provider>
  );
}
