'use client';
import React from 'react';
import { FixtureId, RendererConnect } from 'react-cosmos-core';
import { RendererProvider } from './RendererProvider.js';

type Props = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
  locked: boolean;
  selectedFixtureId?: FixtureId | null;
  reloadRenderer(): void;
};
export function ClientRendererProvider(props: Props) {
  const { selectedFixtureId = null } = props;
  const [selectedFixture, setSelectedFixture] = React.useState(
    () =>
      selectedFixtureId && {
        fixtureId: selectedFixtureId,
        initialFixtureState: {},
        renderKey: 0,
      }
  );

  return (
    <RendererProvider
      rendererId={props.rendererId}
      rendererConnect={props.rendererConnect}
      locked={props.locked}
      selectedFixture={selectedFixture}
      setSelectedFixture={setSelectedFixture}
      reloadRenderer={props.reloadRenderer}
    >
      {props.children}
    </RendererProvider>
  );
}
