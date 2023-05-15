'use client';
import React from 'react';
import { FixtureId, RendererConnect } from 'react-cosmos-core';
import { RendererProvider } from './RendererProvider.js';

type Props = {
  children: React.ReactNode;
  rendererId: string;
  rendererConnect: RendererConnect;
  locked: boolean;
  selectedFixtureId: FixtureId | null;
  reloadRenderer(): void;
};
export function StatefulRendererProvider({
  children,
  selectedFixtureId,
  ...otherProps
}: Props) {
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
      {...otherProps}
      selectedFixture={selectedFixture}
      setSelectedFixture={setSelectedFixture}
    >
      {children}
    </RendererProvider>
  );
}
